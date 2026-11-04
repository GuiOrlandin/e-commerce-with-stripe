/**
 * Reciprocal Rank Fusion: score(d) = Σ 1/(k + rank_r(d)), rank 1-based.
 * Ties keep first-seen order. Same id keeps the first payload.
 */
export function rrfMerge<T extends { id: string }>(
  rankedLists: T[][],
  k = 60,
): T[] {
  const scores = new Map<string, number>();
  const payloads = new Map<string, T>();
  const order: string[] = [];
  const orderIndex = new Map<string, number>();

  for (const list of rankedLists) {
    list.forEach((item, index) => {
      const rank = index + 1;
      const prev = scores.get(item.id) ?? 0;
      if (!scores.has(item.id)) {
        orderIndex.set(item.id, order.length);
        order.push(item.id);
        payloads.set(item.id, item);
      }
      scores.set(item.id, prev + 1 / (k + rank));
    });
  }

  return order
    .slice()
    .sort((a, b) => {
      const diff = (scores.get(b) ?? 0) - (scores.get(a) ?? 0);
      if (diff !== 0) {
        return diff;
      }
      return (orderIndex.get(a) ?? 0) - (orderIndex.get(b) ?? 0);
    })
    .map((id) => payloads.get(id)!);
}
