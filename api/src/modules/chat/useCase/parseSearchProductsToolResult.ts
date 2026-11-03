export type ChatProductDto = {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  unit_value: number;
  stock: number;
  category: string;
  score: number;
};

function isProduct(value: unknown): value is ChatProductDto {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string, unknown>;
  return typeof p.id === 'string' && typeof p.name === 'string';
}

/** Grounding helper: only accept products serialized by the search_products tool. */
export function parseSearchProductsToolResult(content: string): ChatProductDto[] {
  try {
    const parsed = JSON.parse(content) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter(isProduct);
    }
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray((parsed as { products?: unknown }).products)
    ) {
      return ((parsed as { products: unknown[] }).products).filter(isProduct);
    }
    return [];
  } catch {
    return [];
  }
}
