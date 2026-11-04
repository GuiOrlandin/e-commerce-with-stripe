# Design: Chat autenticado + throttle + cota de tokens (Postgres)

**Status:** accepted — implementing  
**Data:** 2026-11-04  

Estudo: [docs/learning/throttle-and-token-quota.md](../../learning/throttle-and-token-quota.md).

---

## Objetivo

1. Exigir login em `POST /chat` e `POST /chat/v2`.
2. Throttle por `userId` (anti-rajada).
3. Cota diária de tokens **estimados** no Postgres (anti-custo).
4. Redis **não** no v1 (upgrade path documentado).

---

## Fluxo

```text
JWT → JwtAuthGuard
   → ChatQuotaGuard (throttle janela + reserve tokens)
   → use case chat
```

Estimativa v1: `estimateTokens(message) + CHAT_TOKEN_OVERHEAD` (cobre embed/rerank/reply de forma grosseira).

---

## Dados

`UserAiUsage`: `userId`, `day` (date UTC), `requestCount`, `tokenEstimate`, `@@unique([userId, day])`.

Consume atômico: só incrementa se `tokenEstimate + n <= dailyLimit`.

Throttle: mapa in-memory de timestamps por `userId` (sliding window).

---

## Config

| Env | Default |
|-----|---------|
| `CHAT_RATE_LIMIT` | `10` |
| `CHAT_RATE_WINDOW_MS` | `60000` |
| `CHAT_TOKEN_DAILY_LIMIT` | `50000` |
| `CHAT_TOKEN_OVERHEAD` | `1500` |

---

## HTTP

- Sem JWT → `401`
- Throttle ou cota → `429` + mensagem clara
- Front: Bearer no `useChat`; UX mínima para 401/429

## Fora de escopo

Redis, planos Stripe, exact tokens Ollama, cache de busca.
