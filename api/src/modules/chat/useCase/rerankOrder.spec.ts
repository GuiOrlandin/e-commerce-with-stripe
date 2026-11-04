import { applyRerankOrder, parseRerankOrderedIds } from './rerankOrder';

describe('parseRerankOrderedIds', () => {
  it('parses a plain JSON object with orderedIds', () => {
    expect(
      parseRerankOrderedIds('{"orderedIds":["b","a","c"]}'),
    ).toEqual(['b', 'a', 'c']);
  });

  it('parses JSON wrapped in markdown fences', () => {
    const raw = '```json\n{"orderedIds":["a","b"]}\n```';
    expect(parseRerankOrderedIds(raw)).toEqual(['a', 'b']);
  });

  it('returns null on invalid JSON', () => {
    expect(parseRerankOrderedIds('not json')).toBeNull();
  });

  it('returns null when orderedIds is missing', () => {
    expect(parseRerankOrderedIds('{"ids":["a"]}')).toBeNull();
  });
});

describe('applyRerankOrder', () => {
  const candidates = [
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
    { id: 'c', name: 'C' },
  ];

  it('reorders by orderedIds and appends omitted ids in original order', () => {
    expect(applyRerankOrder(candidates, ['c', 'a']).map((p) => p.id)).toEqual([
      'c',
      'a',
      'b',
    ]);
  });

  it('ignores unknown ids', () => {
    expect(
      applyRerankOrder(candidates, ['b', 'ghost', 'a']).map((p) => p.id),
    ).toEqual(['b', 'a', 'c']);
  });
});
