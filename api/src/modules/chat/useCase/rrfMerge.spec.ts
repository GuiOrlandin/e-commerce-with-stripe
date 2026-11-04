import { rrfMerge } from './rrfMerge';

type Item = { id: string; label: string };

describe('rrfMerge', () => {
  it('fuses ranks with 1/(k+rank) across lists', () => {
    const semantic: Item[] = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
    ];
    const keyword: Item[] = [
      { id: 'b', label: 'B' },
      { id: 'd', label: 'D' },
      { id: 'a', label: 'A' },
    ];

    // k=60: b=1/61+1/62 > a=1/61+1/63 > d=1/62 > c=1/63
    expect(rrfMerge([semantic, keyword], 60).map((item) => item.id)).toEqual([
      'b',
      'a',
      'd',
      'c',
    ]);
  });

  it('keeps docs that appear in only one list', () => {
    const onlySemantic: Item[] = [{ id: 'solo', label: 'Solo' }];
    const empty: Item[] = [];

    expect(rrfMerge([onlySemantic, empty], 60).map((item) => item.id)).toEqual([
      'solo',
    ]);
  });

  it('breaks ties by first-seen list order (stable)', () => {
    const left: Item[] = [
      { id: 'x', label: 'X' },
      { id: 'y', label: 'Y' },
    ];
    const right: Item[] = [
      { id: 'y', label: 'Y' },
      { id: 'x', label: 'X' },
    ];

    // Same RRF for x and y at k=60 → keep insertion order (x then y)
    expect(rrfMerge([left, right], 60).map((item) => item.id)).toEqual([
      'x',
      'y',
    ]);
  });

  it('prefers the first payload when the same id appears twice', () => {
    const semantic: Item[] = [{ id: 'a', label: 'from-semantic' }];
    const keyword: Item[] = [{ id: 'a', label: 'from-keyword' }];

    expect(rrfMerge([semantic, keyword], 60)[0].label).toBe('from-semantic');
  });
});
