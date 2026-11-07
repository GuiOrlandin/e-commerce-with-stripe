import { ChatProductDto } from './parseSearchProductsToolResult';

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}

/** Keep only catalog products the assistant actually named in the reply. */
export function groundProductsInReply(
  products: ChatProductDto[],
  reply: string,
): ChatProductDto[] {
  const haystack = normalize(reply);
  if (!haystack || products.length === 0) return [];

  return products.filter((product) => {
    const name = normalize(product.name).trim();
    return name.length > 0 && haystack.includes(name);
  });
}
