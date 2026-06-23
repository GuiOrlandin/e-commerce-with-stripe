import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import configs from '../../../config/config';
import { OllamaService } from './ollama.service';

describe('OllamaService', () => {
  it('embed returns float array from ollama response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ embedding: [0.1, 0.2, 0.3] }),
    }) as jest.Mock;

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configs], isGlobal: true })],
      providers: [OllamaService],
    }).compile();

    const service = moduleRef.get(OllamaService);
    const result = await service.embed('tênis vermelho');

    expect(result).toEqual([0.1, 0.2, 0.3]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/embeddings'),
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
