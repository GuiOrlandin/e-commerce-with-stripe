import { Test } from '@nestjs/testing';
import { ProductRepository } from 'src/modules/products/repositories/productRepository';
import { EmbeddingIndexService } from './embedding-index.service';
import { OllamaService } from './ollama.service';

describe('EmbeddingIndexService', () => {
  it('buildProductText joins name, category and description', () => {
    const service = new EmbeddingIndexService(
      {} as OllamaService,
      {} as ProductRepository,
    );

    expect(
      service.buildProductText({
        name: 'Tênis Nike',
        category: 'Calçados',
        description: 'Cor vermelha',
      }),
    ).toBe('Tênis Nike | Calçados | Cor vermelha');
  });

  it('indexProductText embeds text and persists vector', async () => {
    const ollama = { embed: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]) };
    const productRepository = {
      updateTextEmbedding: jest.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        EmbeddingIndexService,
        { provide: OllamaService, useValue: ollama },
        { provide: ProductRepository, useValue: productRepository },
      ],
    }).compile();

    const service = moduleRef.get(EmbeddingIndexService);
    await service.indexProductText('prod-1', {
      name: 'Tênis Nike',
      category: 'Calçados',
      description: 'Cor vermelha',
    });

    expect(ollama.embed).toHaveBeenCalledWith(
      'Tênis Nike | Calçados | Cor vermelha',
    );
    expect(productRepository.updateTextEmbedding).toHaveBeenCalledWith(
      'prod-1',
      [0.1, 0.2, 0.3],
    );
  });
});
