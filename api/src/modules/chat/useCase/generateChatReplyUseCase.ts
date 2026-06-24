import { Injectable } from '@nestjs/common';
import { OllamaService } from 'src/infra/ai/ollama.service';
import { isCatalogBrowseQuestion } from './extractSearchTerms';

type Candidate = {
  id: string;
  name: string;
  description: string | null;
  unit_value: number;
  category: string;
  score: number;
};

@Injectable()
export class GenerateChatReplyUseCase {
  constructor(private ollama: OllamaService) {}

  async execute(userMessage: string, matches: Candidate[]): Promise<string> {
    if (matches.length === 0) {
      return 'Não encontrei um produto parecido na loja. Pode descrever com mais detalhes (cor, categoria, nome)?';
    }

    const catalog = matches
      .map(
        (p, i) =>
          `${i + 1}. ${p.name} | ${p.category} | R$ ${p.unit_value.toFixed(2)} | ${p.description ?? ''}`,
      )
      .join('\n');

    const browseCatalog = isCatalogBrowseQuestion(userMessage);

    const systemPrompt = `Você é assistente de uma loja online em português do Brasil.
Regras:
- Só pode recomendar produtos da lista fornecida.
- Nunca invente produtos ou preços.
- Compare o pedido do usuário com nome, categoria e descrição de cada candidato.
- Se o usuário pediu um atributo explícito (ex.: cor "roxa", tamanho "G"), só recomende produtos que mencionem esse atributo ou equivalente.
- Se nenhum candidato atender aos atributos pedidos, diga claramente que não temos esse item e peça mais detalhes. Não recomende produto incompatível (ex.: usuário pediu roxa, produto é preta).
- Nunca mostre IDs internos, pipes (|) nem o formato técnico da lista ao usuário.
- Só diga que uma categoria não está disponível se nenhum candidato da lista pertencer a ela.
- Seja breve e amigável.
- ${
      browseCatalog
        ? 'O usuário quer ver opções disponíveis: liste todos os candidatos relevantes com nome e preço em linguagem natural (até 5 itens). Se pediu mais de uma categoria, agrupe por categoria.'
        : 'Mencione o nome e preço do produto mais relevante.'
    }
- Convide o usuário a adicionar ao carrinho.
- Valide se o produto existe e está disponível.

Produtos candidatos:
${catalog}`;

    return this.ollama.chat(systemPrompt, userMessage);
  }
}
