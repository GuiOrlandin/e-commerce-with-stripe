import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LangChainChatAgentService } from 'src/infra/ai/langchainChatAgent.service';
import { OllamaService } from 'src/infra/ai/ollama.service';
import {
  agentCalledSearchProducts,
  extractLastAiText,
  extractProductsFromAgentMessages,
} from './extractProductsFromAgentMessages';
import { groundProductsInReply } from './groundProductsInReply';
import { ChatProductDto } from './parseSearchProductsToolResult';
import { SearchProductsByTextUseCase } from './searchProductsByTextUseCase';

const EMPTY_CATALOG_REPLY =
  'Não encontrei um produto parecido na loja. Pode descrever com mais detalhes (cor, categoria, nome)?';

@Injectable()
export class GenerateChatV2ReplyUseCase {
  constructor(
    private agent: LangChainChatAgentService,
    private searchProducts: SearchProductsByTextUseCase,
    private ollama: OllamaService,
  ) {}

  async execute(input: { message: string; conversationId?: string }) {
    const conversationId = input.conversationId?.trim() || randomUUID();

    const agentState = await this.agent.invoke({
      message: input.message,
      conversationId,
    });

    const messages = agentState.messages ?? [];
    let products = extractProductsFromAgentMessages(messages);
    let reply = extractLastAiText(messages);

    // Fallback only when the model skipped tool-calling (common on small local models).
    if (!agentCalledSearchProducts(messages)) {
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

    const catalog = products
      .map(
        (p, i) =>
          `${i + 1}. ${p.name} | ${p.category} | R$ ${p.unit_value.toFixed(2)} | ${p.description ?? ''}`,
      )
      .join('\n');

    const reply = await this.ollama.chat(
      `Você é assistente de uma loja online em português do Brasil.
Só recomende produtos da lista. Não invente itens. Seja breve.
Se o pedido não for de compra/catálogo, diga isso e não cite produtos da lista.
Não diga que vai adicionar ao carrinho nem pergunte se pode adicionar.
Se for orientar a compra, diga só para clicar no botão "Adicionar ao carrinho" do card — nunca no nome do produto.
Produtos:
${catalog}`,
      message,
    );

    return { reply, products: groundProductsInReply(products, reply) };
  }
}
