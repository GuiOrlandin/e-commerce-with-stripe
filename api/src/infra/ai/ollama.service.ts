import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { estimateTokens } from 'src/modules/chat/quota/estimateTokens';
import { recordUsage } from 'src/modules/chat/quota/usageMeter';

interface OllamaEmbedResponse {
  embedding: number[];
}

interface OllamaChatResponse {
  message: { role: string; content: string };
  prompt_eval_count?: number;
  eval_count?: number;
}

@Injectable()
export class OllamaService {
  constructor(private config: ConfigService) {}

  private get baseUrl(): string {
    return this.config.get<string>('OLLAMA.baseUrl')!;
  }

  private get timeoutMs(): number {
    return this.config.get<number>('OLLAMA.timeoutMs')!;
  }

  async embed(text: string): Promise<number[]> {
    const model = this.config.get<string>('OLLAMA.embedModel')!;
    const response = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt: text }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`Ollama embed failed: ${response.statusText}`);
    }

    const data = (await response.json()) as OllamaEmbedResponse;
    // /api/embeddings returns no token count: estimate.
    recordUsage(estimateTokens(text));
    return data.embedding;
  }

  async chat(
    systemPrompt: string,
    userMessage: string,
    options?: { temperature?: number },
  ): Promise<string> {
    const model = this.config.get<string>('OLLAMA.chatModel')!;
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        options:
          options?.temperature !== undefined
            ? { temperature: options.temperature }
            : undefined,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`Ollama chat failed: ${response.statusText}`);
    }

    const data = (await response.json()) as OllamaChatResponse;
    recordUsage((data.prompt_eval_count ?? 0) + (data.eval_count ?? 0));
    return data.message.content;
  }
}
