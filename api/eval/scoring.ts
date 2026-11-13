import { normalize } from 'src/modules/chat/useCase/productAttributeGroups';

export type EvalCase = {
  id: string;
  query: string;
  expectedNames?: string[];
  shouldRefuse?: boolean;
};

// Compare by normalized name (case/accents) so the golden set survives reseeding.
function namesIn(names: string[], k = names.length) {
  return new Set(names.slice(0, k).map((n) => normalize(n.trim())));
}

export function hitAtK(expected: string[], retrieved: string[], k: number) {
  const top = namesIn(retrieved, k);
  return expected.some((n) => top.has(normalize(n.trim())));
}

export function recallAtK(expected: string[], retrieved: string[], k: number) {
  if (expected.length === 0) return 0;
  const top = namesIn(retrieved, k);
  return (
    expected.filter((n) => top.has(normalize(n.trim()))).length /
    expected.length
  );
}

/** Refuse cases: no product cards. Normal cases: at least one expected product returned. */
export function endToEndCorrect(c: EvalCase, productNames: string[]) {
  if (c.shouldRefuse) return productNames.length === 0;
  return hitAtK(c.expectedNames ?? [], productNames, productNames.length);
}

export function mean(values: number[]) {
  return values.length === 0
    ? 0
    : values.reduce((a, b) => a + b, 0) / values.length;
}
