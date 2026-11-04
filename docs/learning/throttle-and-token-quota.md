# Throttle, rate limit e cota de tokens — guia de estudo

Documento de estudo ligado ao chat autenticado deste e-commerce.

Relacionado:

- [Design: chat auth + throttle + cota](../superpowers/specs/2026-11-04-chat-auth-throttle-token-quota-design.md)
- [Hybrid retrieval & re-rank](./hybrid-retrieval-and-rerank.md)
- [Glossário de IA](../ai-glossary.md)

---

## 1. Por que isso existe (AI Engineer)

Chamar Ollama (chat + embed + re-rank) **custa CPU/GPU e latência**. Sem limite:

- um user (ou bot) pode saturar a máquina;
- o resto da loja (checkout, catálogo) sofre;
- em APIs pagas, a fatura explode.

Duas proteções diferentes:

| Mecanismo | Pergunta que responde | Exemplo |
|-----------|----------------------|---------|
| **Throttle / rate limit (req)** | “Quantas vezes por minuto?” | 10 requests / 60s |
| **Cota de tokens** | “Quanto texto/modelo por dia?” | ~50 000 tokens / dia |

Throttle sozinho **não** impede uma única mensagem enorme. Cota sozinha **não** impede 100 requests curtas em 1 segundo. Em produção de IA, use **os dois**.

---

## 2. O que é throttle (rate limiting)

**Throttle** = limitar a **taxa** de eventos (requests) por chave, numa **janela de tempo**.

### Janela fixa (fixed window)

Conta hits em `[00:00–00:59]`, zera no próximo minuto.

- Simples
- Pode haver “burst” na virada (50 no fim + 50 no início)

### Janela deslizante (sliding window)

Guarda timestamps dos hits; remove os mais velhos que `now - windowMs`.

- Mais justo
- Um pouco mais de memória/CPU

### Algoritmos clássicos (nomes de entrevista)

- **Token bucket** — “saldo” de tokens que regenera; picos curtos OK
- **Leaky bucket** — processa em ritmo constante
- **Fixed / sliding window counters** — o que este projeto usa no v1 (contador por janela)

### Chave (key)

Sem login: IP (fácil de burlar).  
Com login (nosso caso): **`userId`** do JWT — abuso fica amarrado à conta.

### Resposta HTTP

- Status **`429 Too Many Requests`**
- Ideal: header `Retry-After` (segundos)
- Corpo legível para o front

---

## 3. Cota de tokens (budget)

**Token** ≈ pedaço de texto que o modelo processa (entrada + saída). Estimativa preguiçosa comum: `ceil(chars / 4)` para texto em inglês/código; em PT-BR é aproximado — serve para **orçamento**, não para fatura exata.

Neste app, cada mensagem de chat pode gerar:

1. embed da query  
2. (opcional) re-rank LLM  
3. reply do agent/chat  

A cota diária soma **estimativas** desses pedaços (com overhead fixo configurável). Quando `usado + estimado > limite` → **429** antes de gastar Ollama.

### Reserve → work → (opcional) adjust

1. Estimar custo  
2. Tentar reservar no ledger (atômico)  
3. Se ok, executar  
4. Se a execução falhar cedo, pode-se reembolsar (v1 pode só reservar up-front — ponytail)

---

## 4. Onde guardar contadores

| Store | Quando |
|-------|--------|
| **Memória do processo** | Throttle req/min com **1** réplica Nest |
| **Postgres** | Cota **diária** auditável; 1 ou N réplicas |
| **Redis** | Multi-réplica + TTL; quando já existe ou o PG vira gargalo |

v1 deste projeto: **memória** (throttle) + **Postgres** (cota/dia). Redis = upgrade path, não requisito.

---

## 5. Como aparece neste repositório

- Chat **exige JWT** (não é mais `@Public()`).
- Guard/serviço de throttle: chave `userId`, limite/janela via env.
- Ledger `UserAiUsage` (user + dia): `requestCount`, `tokenEstimate`.
- Front: `Authorization: Bearer …`; tratar `401` / `429`.

---

## 6. Cheat sheet

| Sintoma | Provável causa | Peça |
|---------|----------------|------|
| Burst de cliques no Send | Muitas req/s | Throttle |
| Prompt de 10 páginas 1×/dia | Custo por request | Cota tokens |
| 3 pods Nest, limite “não pega” | Contador só na memória local | Redis / store compartilhado |
| User sem login no chat | Rota pública | Auth JWT |

---

## 7. Glossário rápido

| Termo | Uma linha |
|-------|-----------|
| **Rate limit** | Teto de taxa (req/tempo) |
| **Throttle** | Aplicar esse teto (muitas vezes sinônimo de rate limit) |
| **Quota / budget** | Teto de **consumo** (tokens, $) num período maior |
| **429** | Cliente deve esperar / reduzir ritmo |
| **getTracker** | Função que escolhe a chave (userId vs IP) no throttler |
