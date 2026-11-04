import { z } from 'zod';

const rerankSchema = z.object({
  orderedIds: z.array(z.string()),
});

/** Extract orderedIds from LLM text; null if unusable. */
export function parseRerankOrderedIds(raw: string): string[] | null {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();

  try {
    const parsed = rerankSchema.safeParse(JSON.parse(candidate));
    if (!parsed.success) {
      return null;
    }
    return parsed.data.orderedIds;
  } catch {
    return null;
  }
}

/** Reorder candidates by orderedIds; unknown ids dropped; omitted keep original order at end. */
export function applyRerankOrder<T extends { id: string }>(
  candidates: T[],
  orderedIds: string[],
): T[] {
  const byId = new Map(candidates.map((c) => [c.id, c]));
  const seen = new Set<string>();
  const result: T[] = [];

  for (const id of orderedIds) {
    const item = byId.get(id);
    if (!item || seen.has(id)) {
      continue;
    }
    seen.add(id);
    result.push(item);
  }

  for (const item of candidates) {
    if (!seen.has(item.id)) {
      result.push(item);
    }
  }

  return result;
}
