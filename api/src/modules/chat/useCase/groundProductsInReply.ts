import { normalize } from './productAttributeGroups';

/** Keep only catalog products the assistant actually named in the reply. */
export function groundProductsInReply<T extends { name: string }>(
  products: T[],
  reply: string,
): T[] {
  const haystack = normalize(reply);
  if (!haystack || products.length === 0) return [];

  return products.filter((product) => {
    const name = normalize(product.name).trim();
    return name.length > 0 && haystack.includes(name);
  });
}
