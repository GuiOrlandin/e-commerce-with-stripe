import { endToEndCorrect, hitAtK, mean, recallAtK } from './scoring';

describe('eval scoring', () => {
  const retrieved = ['Camisa preta', 'Tênis Nike', 'Iphone pro max 15'];

  it('hit@K is true when any expected name is in the top K (case/accent-insensitive)', () => {
    expect(hitAtK(['tenis nike'], retrieved, 2)).toBe(true);
    expect(hitAtK(['Iphone pro max 15'], retrieved, 2)).toBe(false);
  });

  it('recall@K is the fraction of expected names found in the top K', () => {
    expect(recallAtK(['Camisa preta', 'Iphone pro max 15'], retrieved, 2)).toBe(
      0.5,
    );
    expect(recallAtK(['Camisa preta', 'Tênis Nike'], retrieved, 3)).toBe(1);
    expect(recallAtK([], retrieved, 3)).toBe(0);
  });

  it('end-to-end: refuse cases must return no products', () => {
    const c = { id: 'x', query: 'capital da França?', shouldRefuse: true };
    expect(endToEndCorrect(c, [])).toBe(true);
    expect(endToEndCorrect(c, ['Tênis Nike'])).toBe(false);
  });

  it('end-to-end: normal cases need one expected product', () => {
    const c = { id: 'y', query: 'tênis', expectedNames: ['Tênis Nike'] };
    expect(endToEndCorrect(c, retrieved)).toBe(true);
    expect(endToEndCorrect(c, [])).toBe(false);
  });

  it('mean of empty list is 0', () => {
    expect(mean([])).toBe(0);
    expect(mean([1, 0])).toBe(0.5);
  });
});
