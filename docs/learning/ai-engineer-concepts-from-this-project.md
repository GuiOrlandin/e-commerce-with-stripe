# AI Engineer — conceitos deste projeto (guia de estudo)

Base de estudo para quem está migrando para **AI Engineer**, ancorada no que **já existe** neste e-commerce (Nest + Ollama + pgvector + LangChain + chat autenticado).

Para cada conceito: **o que é** → **onde foi aplicado aqui** → **como a indústria costuma aplicar** → **por onde aprofundar**.

---

## Como usar este guia

1. Leia a [visão do sistema](#0-mapa-do-sistema) uma vez.
2. Estude na [ordem sugerida](#ordem-de-estudo-sugerida) (cada bloco constrói o próximo).
3. Abra o arquivo citado no “Aqui” e leia o fluxo de ponta a ponta.
4. Só depois vá aos links de aprofundamento / papers / libs.

Docs irmãos (mais profundos em um tema):

| Tema | Doc |
|------|-----|
| Hybrid + RRF + re-rank | [hybrid-retrieval-and-rerank.md](./hybrid-retrieval-and-rerank.md) |
| Throttle + cota de tokens | [throttle-and-token-quota.md](./throttle-and-token-quota.md) |
| Vocabulário curto | [../ai-glossary.md](../ai-glossary.md) |
| Decisão agent v2 | [../adr/chat-langchain-v1.md](../adr/chat-langchain-v1.md) |

---

## 0. Mapa do sistema

```text
Usuário (JWT)
    │
    ├─ Throttle (req/min) + cota tokens/dia
    │
    ▼
POST /chat/v2  ──► Agent (LangGraph ReAct)
                      │
                      ├─ tool search_products
                      │      │
                      │      ├─ embed query (Ollama)
                      │      ├─ semantic (pgvector) ─┐
                      │      ├─ keyword (ILIKE)     ─┼─► RRF ─► re-rank LLM ─► filtros
                      │      └─ top-K produtos
                      │
                      └─ reply grounded + cards = tool output

POST /chat (legado) ──► pipeline fixo (mesma busca, sem agent loop)
```

**Papel de AI Engineer aqui:** não “treinar GPT do zero”, e sim **ligar modelo + retrieval + produto** com contratos claros, custo, falha e qualidade mensurável.

---

## 1. LLM (Large Language Model)

**O que é:** modelo que gera/compreende texto a partir de um prompt (e, em agents, tool-calls).

**Aqui:** `OllamaService.chat` + `ChatOllama` (`OLLAMA_CHAT_MODEL`, ex. `qwen2.5:7b`). Também usado no **re-rank** listwise.

**Indústria:** API (OpenAI, Anthropic, Gemini) ou self-host (vLLM, Ollama, TGI). Escolha por latência, custo, qualidade de tool-calling e privacidade.

**Aprofundar:** prompting, temperature, context window, instruction-tuned vs base, quando *não* usar LLM (classificação barata, regex, SQL).

---

## 2. Embedding

**O que é:** vetor denso que representa significado de texto (ou imagem). Textos parecidos → vetores próximos.

**Aqui:** `OllamaService.embed` + `nomic-embed-text`; texto do produto montado em `EmbeddingIndexService.buildProductText`; coluna `text_embedding`.

**Indústria:** modelos dedicados (OpenAI `text-embedding-3`, Cohere, E5, BGE). Dimensão fixa; reindex obrigatório se mudar o modelo.

**Aprofundar:** cosine vs dot vs L2, chunking de documentos longos, embedding de query vs documento (às vezes assimétrico).

---

## 3. Vector database / pgvector

**O que é:** armazenamento + busca por similaridade de vetores (ANN ou exact).

**Aqui:** extensão **pgvector** no Postgres; `searchByTextEmbedding` com distância `<=>` (cosine).

**Indústria:** pgvector (MVP/simples), Pinecone, Weaviate, Qdrant, Milvus, OpenSearch k-NN. Trade-off: ops vs escala vs filtros híbridos SQL.

**Aprofundar:** HNSW/IVF, recall vs latência do índice, filtros metadata + vector.

---

## 4. Retrieval (retriever)

**O que é:** etapa que **busca** trechos/itens relevantes *antes* (ou durante) a geração.

**Aqui:** `SearchProductsByTextUseCase` — coração do “contexto” do chat.

**Indústria:** sempre o centro de RAG bom. “RAG ruim” quase sempre é retrieval ruim, não “LLM burro”.

**Aprofundar:** top-K, threshold, query rewriting, multi-query, HyDE.

---

## 5. Keyword / lexical search

**O que é:** casar palavras (BM25, FTS, `ILIKE`), não “sentido”.

**Aqui:** `searchByKeywords` (`ILIKE` em name/description/category). Forte em nome digitado parecido com o cadastro.

**Indústria:** Elasticsearch/OpenSearch BM25, Postgres `tsvector`/`ts_rank`, Typesense. Quase sempre o braço lexical do hybrid.

**Aprofundar:** stemming, stopwords, BM25, synonym lists (no projeto há `productAttributeGroups` como heurística de domínio).

---

## 6. Semantic search

**O que é:** retrieval via embedding + vizinhos no espaço vetorial.

**Aqui:** embed da query → `searchByTextEmbedding`.

**Indústria:** padrão em catálogo, docs, support. Fraco sozinho em SKU/código exato → hybrid.

**Aprofundar:** negative sampling, fine-tune de embedder no domínio (avançado).

---

## 7. Hybrid retrieval

**O que é:** semantic **e** keyword **em paralelo**, depois fusão.  
**Não é** “tento vetorial; se vazio, keyword” (isso é *fallback*).

**Aqui:** `Promise.all` semantic + keyword em `hybridRetrieve`, depois RRF.

**Indústria:** default moderno em search/RAG de produto (Elastic + vector, ou dois índices + fuse).

**Aprofundar:** [hybrid-retrieval-and-rerank.md](./hybrid-retrieval-and-rerank.md).

---

## 8. Reciprocal Rank Fusion (RRF)

**O que é:** fundir listas ranqueadas com \(1/(k + \mathrm{rank})\), sem calibrar scores incompatíveis (cosine ≠ ILIKE).

**Aqui:** `rrfMerge` (`CHAT_RRF_K`, default 60).

**Indústria:** truque barato e robusto (Azure Search, blogs de IR, pipelines LangChain/LlamaIndex).

**Aprofundar:** weighted RRF, CombSUM, aprendizado de rank fusion (raro no início).

---

## 9. Re-ranking

**O que é:** segunda passagem **mais cara/precisa** só no top-N (sobe precision).

**Aqui:** LLM Ollama listwise (`rerankWithOllama` + `parseRerankOrderedIds` / `applyRerankOrder`); flag `CHAT_RERANK_ENABLED`.

**Indústria:** cross-encoder (`ms-marco-*`), Cohere Rerank, Voyage, ou LLM listwise. Cross-encoder costuma ser o sweet spot custo/qualidade; LLM é prático self-host sem modelo extra.

**Aprofundar:** listwise vs pointwise vs pairwise; por que Python brilha no *lab* de cross-encoder (não porque “Nest é lento”).

---

## 10. RAG (Retrieval-Augmented Generation)

**O que é:** gerar resposta **com** evidência recuperada no contexto, em vez de só parâmetros do modelo.

**Aqui:** chat de catálogo — busca produtos → modelo recomenda com base nisso (v1 pipeline / v2 tool).

**Indústria:** docs internos, support, e-commerce, code assistants. Variantes: naive RAG, agentic RAG, GraphRAG.

**Aprofundar:** citation, chunk strategy, “lost in the middle”, grounding vs stuffing.

---

## 11. Grounding e hallucination

**O que é:**  
- **Grounding** — resposta ancorada em fonte confiável (DB/tool).  
- **Hallucination** — modelo inventa fato/produto/preço.

**Aqui:**  
- Prompt do agent: só recomendar o que a tool devolveu.  
- `extractProductsFromAgentMessages` + `groundProductsInReply` — cards da UI = tool, não texto livre.  
- Fallback se o modelo não chama a tool.

**Indústria:** tool-calling + schema, citation obrigatória, validators pós-geração, “never trust the model for money/IDs”.

**Aprofundar:** guardrails (NeMo, LlamaGuard), structured outputs, eval de faithfulness.

---

## 12. Pipeline vs Agent

**O que é:**  
- **Pipeline** — passos fixos no código.  
- **Agent** — modelo decide próximos passos (tools) em loop.

**Aqui:**  
- Pipeline: `POST /chat` (`GenerateChatReplyUseCase`).  
- Agent: `POST /chat/v2` (`LangChainChatAgentService` + `createReactAgent`).

**Indústria:** comece pipeline quando o fluxo é previsível; agent quando há multi-step / tools / clarificação. Agents custam mais e falham de formas novas (tool skip, loops).

**Aprofundar:** ADR [chat-langchain-v1.md](../adr/chat-langchain-v1.md); ReAct paper; quando *não* fazer agent.

---

## 13. Tools e tool-calling

**O que é:** funções que o modelo pode invocar com argumentos estruturados; o runtime executa e devolve resultado.

**Aqui:** tool `search_products` (Zod schema) em `langchainChatAgent.service.ts`.

**Indústria:** function calling OpenAI/Anthropic, MCP, LangChain tools. Descrição da tool **é** UX para o modelo — ruim = tool nunca chamada.

**Aprofundar:** tool routing, parallel tools, human-in-the-loop, idempotência.

---

## 14. ReAct / agent loop

**O que é:** ciclo Reason → Act (tool) → observar → repetir até resposta final.

**Aqui:** `createReactAgent` (LangGraph prebuilt).

**Indústria:** padrão dominante de agents “simples”. Evolui para grafos explícitos (LangGraph/StateGraph) com nós clarify/branch.

**Aprofundar:** LangGraph docs; timeouts; max iterations; circuit breakers.

---

## 15. Memory / session / checkpoint

**O que é:** estado entre turnos da conversa.

**Aqui:** `MemorySaver` + `thread_id` = `conversationId` (in-memory; some no restart).

**Indústria:** Redis/Postgres checkpointer, resumo de histórico, sliding window de mensagens, “memory” de longo prazo separada (user prefs).

**Aprofundar:** o que persistir (messages vs summary); LGPD/privacidade do histórico.

---

## 16. Prompt engineering (system prompt)

**O que é:** instruções fixas + formato que moldam comportamento.

**Aqui:** `SYSTEM_PROMPT` do agent (PT-BR, grounding, não inventar, UX do carrinho).

**Indústria:** system vs user vs developer; few-shot; templates versionados; eval de regressão de prompt.

**Aprofundar:** prompt injection; separar “instruções” de “dados do usuário”.

---

## 17. Structured output / parse defensivo

**O que é:** forçar ou extrair JSON/schema da saída do modelo.

**Aqui:** re-rank espera `{"orderedIds":[...]}` (`rerankOrder.ts`) — fence markdown, IDs inválidos ignorados, fallback RRF.

**Indústria:** `response_format`/JSON mode, Zod/Pydantic validators, retry on parse fail.

**Aprofundar:** never trust raw model string in critical path.

---

## 18. Indexação / reindex

**O que é:** materializar embeddings (e índices) a partir da fonte da verdade (DB).

**Aqui:** `EmbeddingIndexService` + `npm run db:reindex-products`; embeddings null = busca vazia.

**Indústria:** jobs async no create/update; backfill; versionamento de modelo de embed no metadata.

**Aprofundar:** incremental vs full reindex; drift quando descrição do produto muda e embed fica velho.

---

## 19. Filtros de domínio (heurísticas)

**O que é:** regras determinísticas (cor, tipo, preço) — não são ML, mas fazem parte do retrieval bom.

**Aqui:** `filterProductMatchesByMessage`, `productAttributeGroups`, `extractMaxPrice`.

**Indústria:** faceted search, hard filters no vector DB, “must” clauses no Elasticsearch.

**Aprofundar:** quando filtro rígido gera falso negativo (atributo não está no texto indexado).

---

## 20. Observabilidade de custo: throttle + token quota

**O que é:**  
- **Throttle** — limite de **taxa** (req/tempo).  
- **Quota** — limite de **consumo** (tokens/dia).

**Aqui:** `ChatQuotaGuard` + `SlidingWindowThrottle` + `UserAiUsage` (Postgres); chat exige JWT.

**Indústria:** API gateways, Redis rate limit, billing meters, “units” por plano. Self-host ainda precisa limitar CPU/GPU.

**Aprofundar:** [throttle-and-token-quota.md](./throttle-and-token-quota.md); estimativa vs tokens reais do provider.

---

## 21. Eval (avaliação) — ainda fraco no repo (sinal importante)

**O que é:** medir se o sistema está bom com casos fixos (golden set): retrieval hit@K, grounding, recusa correta.

**Aqui:** testes unitários de RRF/parse/grounding; **eval de produto** ainda majoritariamente manual.

**Indústria:** datasets de queries, LLM-as-judge (com cuidado), CI de regressão de RAG, dashboards de feedback thumbs.

**Aprofundar:** isso é o que separa “demo” de “AI Engineer em produção”. Próximo passo natural: 20–30 queries com `productId` esperado.

---

## 22. Local inference (Ollama) vs API cloud

**O que é:** rodar modelo na sua máquina/rede vs chamar SaaS.

**Aqui:** tudo via Ollama local (chat + embed + re-rank).

**Indústria:** local = privacidade + custo previsível + ops; cloud = qualidade/tooling. Híbrido comum (embed local, LLM cloud, etc.).

**Aprofundar:** quantização (Q4/Q8), VRAM, batching, vLLM em produção.

---

## Conceitos das imagens que **ainda não** estão no código

Úteis para o roadmap mental (não invente que já existem):

| Conceito | Status neste repo | Uso típico |
|----------|-------------------|------------|
| Moderação híbrida (rules → ML → LLM) | Não implementada | Safety de input/comentários |
| Cross-encoder re-rank | Não (só LLM listwise) | Precision barata no top-N |
| BM25 / FTS de verdade | `ILIKE` simplificado | Braço lexical forte |
| Redis rate limit | Memória + Postgres | Multi-réplica |
| Fine-tuning / training | Fora de escopo | Domínio muito específico |

---

## Ordem de estudo sugerida

| # | Conceito | Critério de “entendi” |
|---|----------|------------------------|
| 1 | Embedding + pgvector | Explica por que precisa reindex |
| 2 | Semantic vs keyword | Dá exemplo em que cada um falha |
| 3 | Hybrid + RRF | Explica por que não soma cosine com score 1.0 |
| 4 | Re-rank | Diz quando desligar (`CHAT_RERANK_ENABLED`) |
| 5 | RAG + grounding | Explica por que cards ≠ texto do LLM |
| 6 | Pipeline vs agent + tools | Desenha o loop ReAct deste chat |
| 7 | Memory/conversationId | Sabe o que some no restart |
| 8 | Throttle vs token quota | Diferencia 429 de rajada vs 429 de cota |
| 9 | Eval | Monta 10 queries golden na mão |

---

## Arquivos âncora (mapa rápido)

| Conceito | Arquivo principal |
|----------|-------------------|
| Embed / chat HTTP | `api/src/infra/ai/ollama.service.ts` |
| Index de produto | `api/src/infra/ai/embedding-index.service.ts` |
| Vector + keyword SQL | `api/src/infra/database/prisma/respositories/prismaProductRepository.ts` |
| Hybrid + RRF + re-rank | `api/src/modules/chat/useCase/searchProductsByTextUseCase.ts` |
| RRF puro | `api/src/modules/chat/useCase/rrfMerge.ts` |
| Parse re-rank | `api/src/modules/chat/useCase/rerankOrder.ts` |
| Agent + tool | `api/src/infra/ai/langchainChatAgent.service.ts` |
| Grounding cards | `api/src/modules/chat/useCase/groundProductsInReply.ts` |
| Chat v2 orquestra | `api/src/modules/chat/useCase/generateChatV2ReplyUseCase.ts` |
| Quota / throttle | `api/src/modules/chat/quota/chatQuotaService.ts` |
| Guard HTTP | `api/src/infra/http/modules/chat/guards/chatQuota.guard.ts` |

---

## O que AI Engineer *não* é (neste contexto)

- Só escrever prompts criativos sem retrieval/eval  
- Só treinar redes do zero (isso é mais Research / ML Engineer)  
- Trocar Nest por Python “porque IA” — o valor está no **pipeline de IR + guardrails + produto**

Python brilha em **lab** (cross-encoder, notebooks, treino). Este app mostra o caminho **produção de feature de IA** em TypeScript — skill igualmente pedida no mercado.

---

## Próximos passos de estudo (fora do repo)

1. Curso/livro curto de **Information Retrieval** (precision, recall, nDCG).  
2. Hands-on **cross-encoder** num notebook com 20 produtos exportados.  
3. Ler o ADR do chat e redesenhar mentalmente um **StateGraph** com nó “clarify”.  
4. Montar planilha de **eval** (query → ids esperados → hit@3).  
5. Skim: ReAct paper + docs LangGraph “persistence”.

Quando um termo do glossário parecer seco, volte a este guia na seção numerada correspondente — o “aqui” amarra o conceito ao código real.
