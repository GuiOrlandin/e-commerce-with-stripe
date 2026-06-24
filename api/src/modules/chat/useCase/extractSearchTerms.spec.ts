import {
  buildProductSearchQuery,
  extractMaxPrice,
  extractSearchTerms,
  isCatalogBrowseQuestion,
} from './extractSearchTerms';

describe('extractSearchTerms', () => {
  it('removes stop words and keeps product terms', () => {
    expect(extractSearchTerms('quero um celular preto')).toEqual([
      'celular',
      'preto',
    ]);
  });

  it('keeps brand and category terms', () => {
    expect(extractSearchTerms('celular iphone')).toEqual(['celular', 'iphone']);
  });

  it('ignores price words and numbers', () => {
    expect(
      extractSearchTerms('quero um iphone no máximo de 20000 reais'),
    ).toEqual(['iphone']);
  });

  it('strips punctuation from terms', () => {
    expect(extractSearchTerms('camisa preta?')).toEqual(['camisa', 'preta']);
  });
});

describe('buildProductSearchQuery', () => {
  it('isolates product terms from a conversational sentence', () => {
    expect(
      buildProductSearchQuery(
        'você por obséquio teria uma camisa preta para me vender?',
      ),
    ).toBe('camisa preta');
  });

  it('keeps direct product queries unchanged', () => {
    expect(buildProductSearchQuery('camisa preta')).toBe('camisa preta');
  });

  it('combines type and color for electronics', () => {
    expect(buildProductSearchQuery('quero um celular preto')).toBe(
      'celular preto',
    );
  });

  it('ignores price phrases in conversational sentences', () => {
    expect(
      buildProductSearchQuery(
        'você por obséquio teria uma celular preto para me vender abaixo de 20000 reais?',
      ),
    ).toBe('celular preto');
  });

  it('falls back to non-attribute terms when no color or type is detected', () => {
    expect(buildProductSearchQuery('quero um iphone')).toBe('iphone');
  });

  it('keeps only the product type in open catalog questions', () => {
    expect(
      buildProductSearchQuery(
        'estou pensando em comprar uma camisa, quais você tem disponivel para mim?',
      ),
    ).toBe('camisa');
  });

  it('extracts multiple product types from one message', () => {
    expect(buildProductSearchQuery('opções de celular e camisas')).toBe(
      'camisa celular',
    );
  });
});

describe('isCatalogBrowseQuestion', () => {
  it('detects open catalog questions', () => {
    expect(
      isCatalogBrowseQuestion(
        'estou pensando em comprar uma camisa, quais você tem disponivel para mim?',
      ),
    ).toBe(true);
  });

  it('does not flag specific product requests', () => {
    expect(isCatalogBrowseQuestion('quero uma camisa preta')).toBe(false);
    expect(isCatalogBrowseQuestion('quero que seja preta')).toBe(false);
  });
});

describe('extractMaxPrice', () => {
  it('parses upper price limit from message', () => {
    expect(extractMaxPrice('quero um iphone no máximo de 20000 reais')).toBe(
      20000,
    );
  });

  it('parses price limit with abaixo de', () => {
    expect(extractMaxPrice('celular preto abaixo de 20000 reais')).toBe(20000);
  });
});
