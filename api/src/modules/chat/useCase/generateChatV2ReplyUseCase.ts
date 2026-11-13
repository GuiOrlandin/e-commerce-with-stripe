import { GraphRecursionError } from '@langchain/langgraph';
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LangChainChatAgentService } from 'src/infra/ai/langchainChatAgent.service';
import { OllamaService } from 'src/infra/ai/ollama.service';
import { BASE_SYSTEM_PROMPT, formatCatalog } from '../prompts';
import { noteChat, recordLlmCall, recordUsage } from '../quota/usageMeter';
import {
  agentCalledSearchProducts,
  agentTurnLlmCalls,
  agentTurnTokens,
  extractLastAiText,
  extractProductsFromAgentMessages,
} from './extractProductsFromAgentMessages';
import { groundProductsInReply } from './groundProductsInReply';
import { JUDGE_FALLBACK_REPLY, judgeReply, reasonKinds } from './judgeReply';
import { ChatProductDto } from './parseSearchProductsToolResult';
import { SearchProductsByTextUseCase } from './searchProductsByTextUseCase';

const EMPTY_CATALOG_REPLY =
  'Não encontrei um produto parecido na loja. Pode descrever com mais detalhes (cor, categoria, nome)?';

@Injectable()
export class GenerateChatV2ReplyUseCase {
  private readonly logger = new Logger(GenerateChatV2ReplyUseCase.name);

  constructor(
    private agent: LangChainChatAgentService,
    private searchProducts: SearchProductsByTextUseCase,
    private ollama: OllamaService,
  ) {}

  async execute(input: {
    userId: string;
    message: string;
    conversationId?: string;
  }) {
    const conversationId = input.conversationId?.trim() || randomUUID();

    const agentState = await this.agent
      .invoke({
        message: input.message,
        // Memory is keyed by owner + id: a leaked/guessed conversationId can't read another user's history.
        conversationId: `${input.userId}:${conversationId}`,
      })
      .catch((error: unknown) => {
        // Loop cap hit: drop the agent output; no search tool call -> single bounded fallback below.
        if (error instanceof GraphRecursionError) return { messages: [] };
        throw error;
      });

    const messages = agentState.messages ?? [];
    // Tool-side embeddings/rerank are metered in OllamaService; this adds the agent's own LLM calls.
    recordUsage(agentTurnTokens(messages));
    recordLlmCall({ calls: agentTurnLlmCalls(messages) });
    let products = extractProductsFromAgentMessages(messages);
    let reply = extractLastAiText(messages);

    // Fallback only when the model skipped tool-calling (common on small local models).
    const toolCalled = agentCalledSearchProducts(messages);
    // Empty messages only come from the recursion-limit catch above.
    noteChat({
      toolCalled,
      fallback: toolCalled
        ? 'none'
        : messages.length
          ? 'no_tool'
          : 'recursion_limit',
    });
    if (!toolCalled) {
      const fallback = await this.fallbackSearchAndReply(input.message);
      products = fallback.products;
      reply = fallback.reply;
    } else if (products.length === 0 && !reply) {
      reply = EMPTY_CATALOG_REPLY;
    }

    if (!reply) {
      reply =
        products.length === 0
          ? EMPTY_CATALOG_REPLY
          : 'Encontrei opções no catálogo. Quer que eu detalhe alguma?';
    }

    // Judged against everything retrieved (agent or fallback); the fixed reply names no product, so grounding drops all cards.
    const verdict = judgeReply(reply, products);
    if ('reasons' in verdict) {
      this.logger.warn(
        `judge rejected reply: ${reasonKinds(verdict.reasons).join(', ')}`,
      );
      noteChat({
        judgeBlocked: true,
        judgeReasons: reasonKinds(verdict.reasons),
      });
      reply = JUDGE_FALLBACK_REPLY;
    }

    // Cards follow the reply: decline / off-topic text must not ship search hits.
    products = groundProductsInReply(products, reply);

    return { conversationId, reply, products };
  }

  private async fallbackSearchAndReply(message: string): Promise<{
    reply: string;
    products: ChatProductDto[];
  }> {
    const { matches } = await this.searchProducts.execute(message);
    const products: ChatProductDto[] = matches.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      image_url: `/files/${p.image_url}`,
      unit_value: p.unit_value,
      stock: p.stock,
      category: p.category,
      score: p.score,
    }));

    if (products.length === 0) {
      return { reply: EMPTY_CATALOG_REPLY, products };
    }

    const reply = await this.ollama.chat(
      `${BASE_SYSTEM_PROMPT}
- Só pode recomendar produtos do catálogo entre <catalogo> e </catalogo> abaixo.

${formatCatalog(products)}`,
      message,
    );

    // Grounding + judge run once in execute() for both paths.
    return { reply, products };
  }
}
