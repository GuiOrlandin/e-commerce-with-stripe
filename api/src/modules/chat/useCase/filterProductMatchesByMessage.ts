import { ProductTextSearchResult } from 'src/modules/products/repositories/productRepository';
import {
  COLOR_GROUPS,
  findAllMatchedGroups,
  findGroup,
  normalize,
  PRODUCT_TYPE_GROUPS,
} from './productAttributeGroups';

function productText(product: ProductTextSearchResult): string {
  return normalize(
    `${product.name} ${product.description ?? ''} ${product.category}`,
  );
}

export function filterProductMatchesByMessage<
  T extends ProductTextSearchResult,
>(message: string, candidates: T[]): T[] {
  const askedColor = findGroup(message, COLOR_GROUPS);
  const askedTypes = findAllMatchedGroups(message, PRODUCT_TYPE_GROUPS);

  return candidates.filter((product) => {
    const text = productText(product);
    const productColor = findGroup(text, COLOR_GROUPS);
    const productType = findGroup(text, PRODUCT_TYPE_GROUPS);

    if (
      askedTypes.length > 0 &&
      (!productType || !askedTypes.includes(productType))
    ) {
      return false;
    }

    if (askedColor && askedColor !== productColor) {
      return false;
    }

    return true;
  });
}
