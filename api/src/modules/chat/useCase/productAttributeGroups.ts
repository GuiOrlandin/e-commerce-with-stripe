export const COLOR_GROUPS = [
  ['roxa', 'roxo', 'purple', 'violeta'],
  ['preta', 'preto', 'black'],
  ['branca', 'branco', 'white'],
  ['azul', 'blue'],
  ['vermelha', 'vermelho', 'red'],
  ['verde', 'green'],
  ['amarela', 'amarelo', 'yellow'],
  ['cinza', 'grey', 'gray'],
  ['rosa', 'pink'],
  ['marrom', 'brown'],
];

export const PRODUCT_TYPE_GROUPS = [
  ['camisa', 'camiseta', 'blusa'],
  ['calca', 'calcas', 'calça', 'pantalon'],
  ['tenis', 'tênis', 'sapato', 'sapatos'],
  ['short', 'shorts', 'bermuda'],
  ['celular', 'smartphone', 'telefone', 'iphone'],
];

export function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

export function findGroup(text: string, groups: string[][]): string[] | null {
  const normalized = normalize(text);
  return (
    groups.find((group) =>
      group.some((term) => normalized.includes(normalize(term))),
    ) ?? null
  );
}

export function findAllMatchedGroups(
  text: string,
  groups: string[][],
): string[][] {
  const normalized = normalize(text);
  return groups.filter((group) =>
    group.some((term) => normalized.includes(normalize(term))),
  );
}

export function findMatchedTermInMessage(
  message: string,
  groups: string[][],
): string | null {
  const normalized = normalize(message);
  for (const group of groups) {
    const matched = group.find((term) => normalized.includes(normalize(term)));
    if (matched) {
      return normalize(matched);
    }
  }
  return null;
}

export function findAllMatchedTermsInMessage(
  message: string,
  groups: string[][],
): string[] {
  const normalized = normalize(message);
  return findAllMatchedGroups(message, groups).map((group) => {
    const matched = group.find((term) => normalized.includes(normalize(term)))!;
    return normalize(matched);
  });
}

export function isAttributeSynonym(term: string): boolean {
  const normalized = normalize(term);
  return [...PRODUCT_TYPE_GROUPS, ...COLOR_GROUPS]
    .flat()
    .some((synonym) => normalize(synonym) === normalized);
}
