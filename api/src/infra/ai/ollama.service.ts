import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface OllamaEmbedResponse {
  embedding: number[];
}

interface OllamaChatResponse {
  message: { role: string; content: string };
}

@Injectable()
export class OllamaService {
  constructor(private config: ConfigService) {}

  private get baseUrl(): string {
    return this.config.get<string>('OLLAMA.baseUrl')!;
  }

  async embed(text: string): Promise<number[]> {
    const model = this.config.get<string>('OLLAMA.embedModel')!;
    const response = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt: text }),
    });

    if (!response.ok) {
      throw new Error(`Ollama embed failed: ${response.statusText}`);
    }

    const data = (await response.json()) as OllamaEmbedResponse;
    return data.embedding;
  }

  async chat(systemPrompt: string, userMessage: string): Promise<string> {
    const model = this.config.get<string>('OLLAMA.chatModel')!;
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama chat failed: ${response.statusText}`);
    }

    const data = (await response.json()) as OllamaChatResponse;
    return data.message.content;
  }
}
