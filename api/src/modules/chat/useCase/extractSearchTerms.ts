import {
  COLOR_GROUPS,
  findAllMatchedTermsInMessage,
  findMatchedTermInMessage,
  isAttributeSynonym,
  normalize,
  PRODUCT_TYPE_GROUPS,
} from './productAttributeGroups';

function isProductAttributeTerm(term: string): boolean {
  return (
    isAttributeSynonym(term) ||
    (term.endsWith('s') && isAttributeSynonym(term.slice(0, -1)))
  );
}

const STOP_WORDS = new Set([
  'a',
  'abaixo',
  'acima',
  'as',
  'ate',
  'barato',
  'caro',
  'com',
  'comprar',
  'compraria',
  'da',
  'das',
  'de',
  'disponivel',
  'do',
  'dos',
  'e',
  'em',
  'estou',
  'eu',
  'favor',
  'gostaria',
  'listar',
  'lista',
  'mais',
  'maxima',
  'maximo',
  'me',
  'menos',
  'mim',
  'minima',
  'minimo',
  'mostrar',
  'mostra',
  'na',
  'nas',
  'no',
  'nos',
  'o',
  'obsequio',
  'opcoes',
  'opcao',
  'os',
  'ou',
  'para',
  'pensando',
  'poderia',
  'por',
  'quais',
  'que',
  'quero',
  'real',
  'reais',
  'tem',
  'temos',
  'teria',
  'um',
  'uma',
  'uns',
  'umas',
  'vender',
  'voce',
  'voces',
]);

function withoutPricePhrases(message: string): string {
  return normalize(message).replace(
    /\b(?:no\s+)?(?:maximo|maxima|ate|abaixo|acima)\s+(?:de\s+)?\d+(?:[.,]\d{3})*(?:[.,]\d+)?\s*(?:reais?)?\b/g,
    ' ',
  );
}

export function extractMaxPrice(message: string): number | null {
  const normalized = normalize(message);
  const match = normalized.match(
    /(?:no\s+)?(?:maximo|maxima|ate|abaixo|acima)\s+(?:de\s+)?(\d+(?:[.,]\d{3})*(?:[.,]\d+)?)/,
  );

  if (!match) {
    return null;
  }

  const raw = match[1].replace(/\./g, '').replace(',', '.');
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : null;
}

export function extractSearchTerms(message: string): string[] {
  return [
    ...new Set(
      withoutPricePhrases(message)
        .split(/\s+/)
        .map((term) => term.replace(/[^\p{L}\p{N}]/gu, '').trim())
        .filter(
          (term) =>
            term.length >= 2 &&
            !STOP_WORDS.has(term) &&
            !/^\d+(?:[.,]\d+)?$/.test(term),
        ),
    ),
  ];
}

export function buildProductSearchQuery(message: string): string {
  const parts: string[] = [
    ...findAllMatchedTermsInMessage(message, PRODUCT_TYPE_GROUPS),
  ];
  const colorTerm = findMatchedTermInMessage(message, COLOR_GROUPS);

  if (colorTerm && !parts.includes(colorTerm)) {
    parts.push(colorTerm);
  }

  for (const term of extractSearchTerms(message)) {
    if (!parts.includes(term) && !isProductAttributeTerm(term)) {
      parts.push(term);
    }
  }

  return parts.join(' ');
}

export function isCatalogBrowseQuestion(message: string): boolean {
  const normalized = withoutPricePhrases(message);
  return (
    /\b(quais|disponiveis?|opcoes|opcao)\b/.test(normalized) ||
    /\b(tem|temos|teria|teriam)\b.*\b(disponivel|para mim|na loja)\b/.test(
      normalized,
    ) ||
    /\b(mostrar?|listar?|ver)\b.*\b(opcoes|produtos?)\b/.test(normalized)
  );
}
