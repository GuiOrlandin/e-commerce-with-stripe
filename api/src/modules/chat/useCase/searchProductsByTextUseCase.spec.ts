import { SearchProductsByTextUseCase } from './searchProductsByTextUseCase';
import { ProductTextSearchResult } from 'src/modules/products/repositories/productRepository';

function product(
  partial: Partial<ProductTextSearchResult> & Pick<ProductTextSearchResult, 'id' | 'name'>,
): ProductTextSearchResult {
  return {
    description: null,
    image_url: 'x.jpg',
    unit_value: 100,
    stock: 1,
    category: 'eletronicos',
    score: 0.9,
    ...partial,
  };
}

describe('SearchProductsByTextUseCase hybrid + rerank', () => {
  const semanticHit = product({
    id: 'sem',
    name: 'Celular Galaxy',
    category: 'eletronicos',
    score: 0.95,
  });
  const keywordHit = product({
    id: 'key',
    name: 'Celular Nokia',
    category: 'eletronicos',
    score: 1,
  });

  function buildUseCase(opts: {
    rerankEnabled: boolean;
    chat?: jest.Mock;
  }) {
    const embed = jest.fn().mockResolvedValue([0.1, 0.2]);
    const chat = opts.chat ?? jest.fn();
    const searchByTextEmbedding = jest.fn().mockResolvedValue([semanticHit]);
    const searchByKeywords = jest.fn().mockResolvedValue([keywordHit]);

    const configGet = jest.fn((key: string) => {
      const map: Record<string, unknown> = {
        'CHAT.topK': 5,
        'CHAT.retrieveK': 15,
        'CHAT.rerankN': 10,
        'CHAT.rrfK': 60,
        'CHAT.rerankEnabled': opts.rerankEnabled,
        'CHAT.similarityThreshold': 0.65,
      };
      return map[key];
    });

    const useCase = new SearchProductsByTextUseCase(
      { embed, chat } as never,
      { searchByTextEmbedding, searchByKeywords } as never,
      { get: configGet } as never,
    );

    return { useCase, embed, chat, searchByTextEmbedding, searchByKeywords };
  }

  it('runs semantic and keyword retrieval in parallel (not keyword-only fallback)', async () => {
    const { useCase, searchByTextEmbedding, searchByKeywords, chat } =
      buildUseCase({ rerankEnabled: false });

    const { matches, candidates } = await useCase.execute('quero celular');

    expect(searchByTextEmbedding).toHaveBeenCalled();
    expect(searchByKeywords).toHaveBeenCalled();
    expect(chat).not.toHaveBeenCalled();
    expect(candidates.map((c) => c.id).sort()).toEqual(['key', 'sem']);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((m) => ['key', 'sem'].includes(m.id))).toBe(true);
  });

  it('calls Ollama rerank when enabled and reorders matches', async () => {
    const chat = jest
      .fn()
      .mockResolvedValue('{"orderedIds":["key","sem"]}');
    const { useCase } = buildUseCase({ rerankEnabled: true, chat });

    const { matches } = await useCase.execute('quero celular');

    expect(chat).toHaveBeenCalled();
    expect(matches.map((m) => m.id)).toEqual(['key', 'sem']);
  });

  it('keeps RRF order when rerank JSON is invalid', async () => {
    const chat = jest.fn().mockResolvedValue('não consegui ordenar');
    const { useCase } = buildUseCase({ rerankEnabled: true, chat });

    const { matches } = await useCase.execute('quero celular');

    expect(chat).toHaveBeenCalled();
    // Both present; order is whatever RRF produced — must not throw / empty out
    expect(matches.map((m) => m.id).sort()).toEqual(['key', 'sem']);
  });
});
