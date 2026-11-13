import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOllama } from '@langchain/ollama';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { SearchProductsByTextUseCase } from 'src/modules/chat/useCase/searchProductsByTextUseCase';

const SYSTEM_PROMPT = `Você é assistente de uma loja online em português do Brasil.
Regras:
- Use a tool search_products para buscar no catálogo antes de recomendar.
- Só pode recomendar produtos devolvidos pela tool.
- Nunca invente produtos, preços ou estoque.
- Se a tool não achar nada, diga que não encontrou e peça mais detalhes (cor, categoria, nome).
- Seja breve e amigável.
- Não diga que vai adicionar ao carrinho nem pergunte se pode adicionar — você não tem essa ação.
- Se for orientar a compra, diga apenas para clicar no botão "Adicionar ao carrinho" do card abaixo. Nunca diga para clicar no nome do produto (o nome não é clicável).
- Nunca mostre IDs internos ao usuário.`;

// Keep the last `max` messages, starting on a human turn so no ToolMessage loses its AI tool_call.
export function trimHistory(messages: BaseMessage[], max: number) {
  return trimMessages(messages, {
    maxTokens: max,
    tokenCounter: (msgs) => msgs.length,
    strategy: 'last',
    startOn: 'human',
  });
}

@Injectable()
export class LangChainChatAgentService {
  private readonly agent: ReturnType<typeof createReactAgent>;

  constructor(
    private config: ConfigService,
    private searchProducts: SearchProductsByTextUseCase,
  ) {
    const baseUrl = this.config.get<string>('OLLAMA.baseUrl')!;
    const model = this.config.get<string>('OLLAMA.chatModel')!;
    const historyMax = this.config.get<number>('CHAT.historyMaxMessages')!;

    const searchProductsTool = tool(
      async ({ message }: { message: string }) => {
        const { matches } = await this.searchProducts.execute(message);
        const products = matches.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          image_url: `/files/${p.image_url}`,
          unit_value: p.unit_value,
          stock: p.stock,
          category: p.category,
          score: p.score,
        }));
        return JSON.stringify({
          products,
          matchCount: products.length,
        });
      },
      {
        name: 'search_products',
        description:
          'Busca produtos no catálogo (hybrid semantic+keyword, re-rank) com filtros de cor, tipo e preço. Sempre use antes de recomendar.',
        schema: z.object({
          message: z
            .string()
            .describe('Pedido do usuário em linguagem natural'),
        }),
      },
    );

    const llm = new ChatOllama({
      model,
      baseUrl,
      temperature: 0,
    });

    this.agent = createReactAgent({
      llm,
      tools: [searchProductsTool],
      // shortcut: MemorySaver keeps every thread in RAM forever (only what the model sees is trimmed), swap for a persistent checkpointer with TTL (e.g. Postgres saver) before multi-instance/prod.
      checkpointSaver: new MemorySaver(),
      // Bound context per call: older turns stay in memory but are not resent to the model.
      prompt: async (state) => [
        new SystemMessage(SYSTEM_PROMPT),
        ...(await trimHistory(state.messages, historyMax)),
      ],
    });
  }

  async invoke(input: { message: string; conversationId: string }) {
    // MemorySaver keeps prior turns per thread_id; only append the new user message.
    return this.agent.invoke(
      { messages: [new HumanMessage(input.message)] },
      {
        configurable: { thread_id: input.conversationId },
        // Caps agent<->tool loops: a prompt-injected "search 20 times" stops here (GraphRecursionError).
        recursionLimit: this.config.get<number>('CHAT.agentRecursionLimit')!,
        // ChatOllama has no timeout option; bound the whole run instead.
        signal: AbortSignal.timeout(
          this.config.get<number>('OLLAMA.timeoutMs')!,
        ),
      },
    );
  }
}
