import {
  ChatProductDto,
  parseSearchProductsToolResult,
} from './parseSearchProductsToolResult';

describe('parseSearchProductsToolResult', () => {
  const sample: ChatProductDto = {
    id: 'p1',
    name: 'Camiseta roxa',
    description: 'algodão',
    image_url: '/files/camisa.jpg',
    unit_value: 79.9,
    stock: 3,
    category: 'roupa',
    score: 0.91,
  };

  it('parses JSON array of products from tool content', () => {
    const products = parseSearchProductsToolResult(JSON.stringify([sample]));
    expect(products).toEqual([sample]);
  });

  it('parses wrapped { products: [...] } payload', () => {
    const products = parseSearchProductsToolResult(
      JSON.stringify({ products: [sample], matchCount: 1 }),
    );
    expect(products).toEqual([sample]);
  });

  it('returns empty array for invalid JSON', () => {
    expect(parseSearchProductsToolResult('not-json')).toEqual([]);
  });

  it('returns empty array when products missing', () => {
    expect(parseSearchProductsToolResult(JSON.stringify({ ok: true }))).toEqual(
      [],
    );
  });
});
