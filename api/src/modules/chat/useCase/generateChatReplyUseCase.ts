import { Injectable, Logger } from '@nestjs/common';
import { OllamaService } from 'src/infra/ai/ollama.service';
import { BASE_SYSTEM_PROMPT, formatCatalog } from '../prompts';
import { isCatalogBrowseQuestion } from './extractSearchTerms';
import { noteChat } from '../quota/usageMeter';
import { JUDGE_FALLBACK_REPLY, judgeReply, reasonKinds } from './judgeReply';

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
  private readonly logger = new Logger(GenerateChatReplyUseCase.name);

  constructor(private ollama: OllamaService) {}

  async execute(userMessage: string, matches: Candidate[]): Promise<string> {
    if (matches.length === 0) {
      return 'Não encontrei um produto parecido na loja. Pode descrever com mais detalhes (cor, categoria, nome)?';
    }

    const browseCatalog = isCatalogBrowseQuestion(userMessage);

    const systemPrompt = `${BASE_SYSTEM_PROMPT}
- Só pode recomendar produtos do catálogo entre <catalogo> e </catalogo> abaixo.
- Compare o pedido do usuário com nome, categoria e descrição de cada candidato.
- Se o usuário pediu um atributo explícito (ex.: cor "roxa", tamanho "G"), só recomende produtos que mencionem esse atributo ou equivalente.
- Se nenhum candidato atender aos atributos pedidos, diga claramente que não temos esse item e peça mais detalhes. Não recomende produto incompatível (ex.: usuário pediu roxa, produto é preta).
- Nunca mostre pipes (|) nem o formato técnico da lista ao usuário.
- Só diga que uma categoria não está disponível se nenhum candidato da lista pertencer a ela.
- ${
      browseCatalog
        ? 'O usuário quer ver opções disponíveis: liste todos os candidatos relevantes com nome e preço em linguagem natural (até 5 itens). Se pediu mais de uma categoria, agrupe por categoria.'
        : 'Mencione o nome e preço do produto mais relevante.'
    }

${formatCatalog(matches)}`;

    const reply = await this.ollama.chat(systemPrompt, userMessage);
    const verdict = judgeReply(reply, matches);
    if (!('reasons' in verdict)) return reply;
    this.logger.warn(`judge rejected reply: ${verdict.reasons.join('; ')}`);
    noteChat({
      judgeBlocked: true,
      judgeReasons: reasonKinds(verdict.reasons),
    });
    return JUDGE_FALLBACK_REPLY;
  }
}
