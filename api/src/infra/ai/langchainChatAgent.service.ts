import { HumanMessage } from '@langchain/core/messages';
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
- Seja breve e amigável; convide a adicionar ao carrinho.
- Nunca mostre IDs internos ao usuário.`;

@Injectable()
export class LangChainChatAgentService {
  private readonly agent: ReturnType<typeof createReactAgent>;

  constructor(
    private config: ConfigService,
    private searchProducts: SearchProductsByTextUseCase,
  ) {
    const baseUrl = this.config.get<string>('OLLAMA.baseUrl')!;
    const model = this.config.get<string>('OLLAMA.chatModel')!;

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
          'Busca produtos no catálogo da loja por similaridade semântica e filtros (cor, tipo, preço). Sempre use antes de recomendar.',
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
      checkpointSaver: new MemorySaver(),
      prompt: SYSTEM_PROMPT,
    });
  }

  async invoke(input: { message: string; conversationId: string }) {
    // MemorySaver keeps prior turns per thread_id; only append the new user message.
    return this.agent.invoke(
      { messages: [new HumanMessage(input.message)] },
      { configurable: { thread_id: input.conversationId } },
    );
  }
}
