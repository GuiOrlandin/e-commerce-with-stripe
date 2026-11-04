# Design: Hybrid search + RRF + re-rank LLM local

**Status:** accepted — implementing  
**Data:** 2026-11-04  
**Stack:** NestJS / TypeScript / Ollama / pgvector (sem serviço Python em produção)

Guia de conceitos e carreira: [docs/learning/hybrid-retrieval-and-rerank.md](../../learning/hybrid-retrieval-and-rerank.md).

---

## 1. Objetivo

Melhorar a tool `search_products` (e o fallback do chat v2) para:

1. **Recall:** semantic + keyword em paralelo (hybrid de verdade).
2. **Precision no top-K:** reordenar o top-N com o LLM Ollama já usado no chat.
3. Manter filtros de domínio (cor, tipo, preço) e grounding atuais.

Critério de sucesso acordado: recall + precision, **prioridade no top-K que o agent vê**. Restrição: **só local/Ollama**.

---

## 2. Estado atual (baseline)

Arquivo central: `api/src/modules/chat/useCase/searchProductsByTextUseCase.ts`.

1. Extrai termos / query de busca.
2. `ollama.embed` → `searchByTextEmbedding`.
3. `filterProductMatchesByMessage`.
4. Se `matches` vazio → `searchByKeywords` (`ILIKE`) + filtro de novo.
5. Filtro opcional de preço máximo.

Consumidores: `LangChainChatAgentService` (tool), `GenerateChatV2ReplyUseCase` (fallback), `ChatController` (endpoint de busca).

---

## 3. Design alvo

### 3.1 Fluxo

```text
message
  → build searchQuery + terms (existente)
  → Promise.all([
        embed(searchQuery) → searchByTextEmbedding(topK_retrieve),
        searchByKeywords(terms, topK_retrieve)
     ])
  → RRF(semanticRanks, keywordRanks) → lista fundida
  → take topN_rerank
  → ollamaRerank(message, candidates) → ordem de IDs
  → filterProductMatchesByMessage + maxPrice
  → take topK (CHAT_TOP_K) como matches
  → candidates = fundidos pré-filtro (ou pós-RRF) para debug/endpoint
```

Notas:

- **Paralelo:** keyword deixa de ser só fallback.
- **RRF:** não mistura cosine com `1.0` flat do ILIKE; usa só ranks.
- **Re-rank:** uma chamada Ollama listwise (“ordene estes IDs por relevância à query”); parse defensivo; se falhar → ordem RRF.
- **Filtros depois do re-rank:** evita matar candidatos lexicalmente bons antes do modelo ver o conjunto; se filtro zerar, opcional relax: devolver top RRF filtrado sem exigir re-rank (ponytail: documentar no código).

### 3.2 Componentes (mínimos)

| Peça | Onde | Responsabilidade |
|------|------|------------------|
| `rrfMerge` | helper puro em `modules/chat/useCase/` (ou `lib/`) | Fundir listas por id com \(1/(k+\mathrm{rank})\) |
| `rerankProductsWithOllama` | use case fino ou método em `OllamaService` + parse | Prompt + parse de IDs |
| `SearchProductsByTextUseCase` | orquestra | Paralelo → RRF → re-rank → filtros → topK |

Sem novo pacote npm se o parse for JSON simples + Zod (já no projeto via LangChain tool schemas; pode reutilizar `zod` se já estiver na api).

### 3.3 Config (env)

Estender `CHAT` em `api/config/config.ts` + `.env.example`:

| Var | Default sugerido | Papel |
|-----|------------------|--------|
| `CHAT_TOP_K` | `5` (já existe) | Saída final para o agent |
| `CHAT_RETRIEVE_K` | `15` | topK por braço (semantic / keyword) |
| `CHAT_RERANK_N` | `10` | quantos pós-RRF vão ao LLM |
| `CHAT_RRF_K` | `60` | constante RRF |
| `CHAT_RERANK_ENABLED` | `true` | feature flag (desliga → só hybrid+RRF) |
| `CHAT_SIMILARITY_THRESHOLD` | `0.65` | **reavaliar:** no hybrid, threshold rígido no braço semantic pode descartar candidatos que o keyword salvaria; preferir threshold só como sinal opcional ou aplicar após fusão |

Decisão de threshold: **não cortar o braço semantic antes do RRF** com o mesmo rigor de hoje; usar retrieve_K por distância e deixar RRF + re-rank + filtros decidirem. Threshold antigo pode virar gate opcional pós-RRF se ainda fizer sentido em eval.

### 3.4 Prompt de re-rank (contrato)

Entrada: query do usuário + lista `{ id, name, category, description? }` (truncar description).

Saída esperada: JSON `{"orderedIds":["..."]}` apenas com subset/permutação dos IDs enviados.

Regras de parse:

- Ignorar IDs desconhecidos.
- IDs omitidos vão ao fim na ordem RRF original.
- Falha de JSON / modelo → log + fallback RRF (não quebrar o chat).

Temperatura `0`. Pode reutilizar `OLLAMA_CHAT_MODEL` (mesmo do agent) para não exigir segundo modelo.

### 3.5 Multi-type query (já existe)

Quando `typeTerms.length > 1`, o use case hoje loopa queries. Manter: para cada subquery, hybrid+RRF(+rerank leve) **ou** um único hybrid na query agregada — preferência **lazy:** um hybrid na `buildProductSearchQuery(message)` + filtros de tipo no fim, e só manter o loop se eval mostrar regressão. Se o loop permanecer: RRF por subquery e `mergeByBestScore` / merge de ranks como hoje.

### 3.6 Fora de escopo (YAGNI)

- Serviço Python / cross-encoder
- Cohere ou API paga de rerank
- Migration FTS/`tsvector` (candidato a fase 2 se keyword ILIKE for o gargalo)
- Moderação híbrida
- Mudança de contrato HTTP do chat (reply / products)

---

## 4. Testes

- **Unit:** `rrfMerge` — ranks conhecidos → ordem esperada; doc só num braço; empate estável.
- **Unit:** parse do re-rank — JSON válido, ID inventado, JSON quebrado → fallback.
- **Unit/integration leve:** `SearchProductsByTextUseCase` com repo in-memory + Ollama mock — paralelo chamado; com `CHAT_RERANK_ENABLED=false` não chama rerank.

Um self-check pequeno basta (padrão ponytail); não montar framework novo.

---

## 5. Riscos

| Risco | Mitigação |
|-------|-----------|
| +latência (1 round Ollama) | Flag `CHAT_RERANK_ENABLED`; `RERANK_N` baixo |
| Modelo bagunça a ordem | Parse estrito + fallback RRF |
| Keyword `ILIKE` ruidoso | RRF dilui; filtros; fase 2 FTS se necessário |
| Filtro zera pós-rerank | Fallback para lista RRF filtrada |

---

## 6. Plano de aprendizagem (ligado ao design)

Implementar nesta ordem ajuda a migração de carreira:

1. Helper RRF + testes (conceito puro).
2. Parallel retrieve no use case (hybrid).
3. Re-rank Ollama + flag.
4. 15–30 queries manuais / tabela de eval.

Conceitos: doc de learning acima.
