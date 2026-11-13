import { ChatProductDto } from './parseSearchProductsToolResult';

/** Fail-closed reply when the judge rejects the model output. */
export const JUDGE_FALLBACK_REPLY =
  'Não consegui responder com segurança agora. Pode reformular ou dar mais detalhes do produto que procura?';

// "R$ 1.299,00" | "R$ 1.299" (pt-BR thousands) or "R$ 49,90" | "R$49.90" | "R$ 199".
// shortcut: only amounts prefixed by "R$"; "49 reais" or "1,299.00" (en-US) slip through, extend if the eval shows them.
const BRL = /R\$\s*(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)/g;
// shortcut: bare domains limited to common TLDs; "loja.xyz" passes, widen the list if needed.
const LINK =
  /\bhttps?:\/\/\S+|\bwww\.\S+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|io|br)\b/gi;

function parseBrl(raw: string): number {
  // Comma is always the decimal mark; a dot is decimal only when it isn't a thousands group.
  if (raw.includes(','))
    return Number(raw.replace(/\./g, '').replace(',', '.'));
  return Number(/^\d{1,3}(\.\d{3})+$/.test(raw) ? raw.replace(/\./g, '') : raw);
}

/** Deterministic output guardrail: prices must come from the catalog, and the store never sends links. */
export function judgeReply(
  reply: string,
  products: Pick<ChatProductDto, 'unit_value'>[],
): { ok: true } | { ok: false; reasons: string[] } {
  const reasons: string[] = [];

  for (const [text, raw] of reply.matchAll(BRL)) {
    const value = parseBrl(raw);
    if (!products.some((p) => Math.abs(p.unit_value - value) <= 0.01)) {
      reasons.push(`price not in catalog: ${text.trim()}`);
    }
  }
  for (const [link] of reply.matchAll(LINK)) {
    reasons.push(`link: ${link}`);
  }

  return reasons.length ? { ok: false, reasons } : { ok: true };
}

/** Reason kinds without the matched reply text, safe for structured logs. */
export function reasonKinds(reasons: string[]): string[] {
  return [...new Set(reasons.map((r) => r.split(':')[0]))];
}
