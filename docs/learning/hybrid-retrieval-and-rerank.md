# Hybrid Retrieval, RRF e Re-Rank — guia de estudo (AI Engineer)

Documento de estudo ligado a este e-commerce. Explica **o que é**, **quando usar**, **quando não usar**, e **como isso aparece no código**.

Relacionado:

- [Glossário de IA](../ai-glossary.md)
- [ADR chat LangChain v1](../adr/chat-langchain-v1.md)
- [Design: hybrid search + re-rank local](../superpowers/specs/2026-11-04-hybrid-search-rerank-design.md)

---

## 1. Por que isso importa na migração para AI Engineer

AI Engineer não é “só prompt”. No produto, o trabalho típico é:

| Camada | Pergunta que você responde |
|--------|----------------------------|
| **Retrieval** | O modelo viu o documento/produto certo? |
| **Ranking** | O top-K que chegou no prompt é o mais relevante? |
| **Generation** | A resposta está grounded (sem alucinar)? |
| **Ops** | Latência, custo, falha do modelo local, eval |

As imagens de **Hybrid Retrieval** e **Re-Ranker** cobrem as duas primeiras camadas. O chat deste repo já é um RAG de catálogo; melhorar busca = melhorar o agent sem trocar de LLM.

**Python:** o ecossistema de paper/notebook (sentence-transformers, BM25, cross-encoder) é ótimo para **aprender e medir**. A **produção neste projeto** continua Nest + TypeScript + Ollama + pgvector — não precisa de serviço Python para a abordagem escolhida.

---

## 2. Mapa mental do pipeline (alvo)

```text
User query
    │
    ├─► Semantic retrieval (embedding → pgvector)  ─┐
    │                                                 ├─► RRF (fuse ranks) ─► candidatos
    └─► Keyword retrieval (termos → ILIKE/FTS)     ─┘         │
                                                              ▼
                                                    Re-rank LLM local (Ollama)
                                                    top-N → top-K ordenado
                                                              │
                                                              ▼
                                                    Filtros de domínio (cor, tipo, preço)
                                                              │
                                                              ▼
                                                    Tool search_products / fallback chat
```

Hoje (antes do design):

```text
query → embed → pgvector → filtro atributos
              └─(se vazio)→ keyword ILIKE → filtro
```

Ou seja: keyword é **fallback**, não hybrid. Não há fusão de ranks nem re-rank dedicado.

---

## 3. Conceitos — o que é e quando usar

### 3.1 Embedding

**O que é:** vetor denso que representa significado do texto.

**Aqui:** `OllamaService.embed` + `nomic-embed-text`; produto em `text_embedding` (pgvector).

**Quando usar**

- Busca por significado (“tênis confortável para correr” ≈ produto com descrição parecida)
- RAG, clustering semântico, deduplicação aproximada

**Quando não usar (sozinho)**

- Match exato de SKU, código, nome raro, typo extremo
- Catálogo minúsculo onde `ILIKE` já resolve (overkill)

**Métrica mental:** recall semântico sobe; precision em queries lexicais pode cair.

---

### 3.2 Semantic retrieval (busca vetorial)

**O que é:** converter a query em embedding e buscar vizinhos no índice vetorial (cosine / distância `<=>`).

**Aqui:** `ProductRepository.searchByTextEmbedding`.

**Quando usar**

- Linguagem natural, sinônimos, paraphrases
- Usuário não sabe o nome exato do produto

**Quando não usar**

- Precisa de palavra-chave obrigatória (“modelo XYZ-123”)
- Threshold mal calibrado → lixo no top-K ou zero hits

**Knobs:** `CHAT_TOP_K`, `CHAT_SIMILARITY_THRESHOLD`, qualidade do texto indexado (`EmbeddingIndexService.buildProductText`).

---

### 3.3 Keyword retrieval (busca lexical)

**O que é:** casar termos da query com texto do documento (BM25, Postgres FTS, ou `ILIKE` simples).

**Aqui hoje:** `searchByKeywords` com `ILIKE` — útil, mas frágil (sem stemming, sem ranking real).

**Quando usar**

- Nome de marca, modelo, cor explícita, categoria digitada igual ao cadastro
- Complementar o vetorial (hybrid)

**Quando não usar (sozinho)**

- Usuário descreve por uso/benefício sem palavras do catálogo
- Só `ILIKE` em catálogo grande → ruído e scores falsos (`1.0` flat hoje)

**Evolução típica (estudo):** BM25 / `tsvector` + `ts_rank` > `ILIKE`. Ainda é keyword; só melhora o lado lexical.

---

### 3.4 Hybrid retrieval

**O que é:** rodar **semantic + keyword** (em paralelo), depois **combinar** resultados.

**Não é hybrid:** “tento vetorial; se falhar, keyword” ← estado atual.

**Quando usar**

- Catálogo real com queries mistas (nome + intenção)
- Quer recall alto sem desistir do match lexical

**Quando não usar**

- Um dos canais é inútil (ex.: embeddings nunca indexados)
- Orçamento de latência não cabe duas buscas (raro se forem paralelas no mesmo DB)

**Regra de ouro:** hybrid melhora **candidatos**; não substitui bom re-rank no top-K.

---

### 3.5 Reciprocal Rank Fusion (RRF)

**O que é:** fundir listas ranqueadas **sem** precisar calibrar scores incompatíveis (cosine ≠ score ILIKE).

Fórmula clássica para um documento \(d\):

\[
\mathrm{RRF}(d) = \sum_{r \in \text{rankers}} \frac{1}{k + \mathrm{rank}_r(d)}
\]

- \(\mathrm{rank}_r(d)\): posição 1-based na lista do ranker \(r\) (ausente → não soma)
- \(k\): constante (comum: **60**); suaviza diferença entre “1º” e “2º”

**Quando usar**

- Combinar vetorial + lexical (ou + mais fontes)
- Scores em escalas diferentes / não calibrados

**Quando não usar**

- Você já tem um score único bem calibrado
- Só uma lista de resultados

**Por que AI Engineers gostam:** simples, robusto, pouco hyperparam, fácil de testar.

---

### 3.6 Re-ranking

**O que é:** segunda passagem **mais cara e mais precisa** só no top-N recuperado.

Tipos comuns:

| Tipo | Ideia | Custo | Precision |
|------|--------|-------|-----------|
| **Cross-encoder** | Modelo vê (query, doc) juntos | Médio/alto | Alta |
| **API rerank** (Cohere etc.) | Serviço gerenciado | $$ + rede | Alta |
| **LLM listwise** (escolhido aqui) | LLM ordena IDs do top-N | 1 chamada local | Boa se o modelo cooperar |
| **Heurística** | boost por atributos | Baixo | Limitada |

**Quando usar**

- Precision no top-K do agent/prompt importa (nosso caso **C**)
- Retrieval devolve 10–50 candidatos “ok” e você precisa do melhor primeiro

**Quando não usar**

- N ≤ K e a primeira lista já é ótima
- Latência rígida e modelo local lento
- Catálogo tão pequeno que ranking é irrelevante

**Padrão de produção:** retrieve largo (recall) → re-rank estreito (precision).

---

### 3.7 Filtros de domínio (não são ML, mas são retrieval)

**O que é:** regras determinísticas (cor, tipo, preço máximo) depois ou durante a busca.

**Aqui:** `filterProductMatchesByMessage`, `extractMaxPrice`, grupos em `productAttributeGroups`.

**Quando usar**

- Constraints explícitas do usuário (“vermelho”, “até 100”)
- Evitar mostrar produto semanticamente próximo mas semanticamente “errado” no atributo

**Quando não usar**

- Filtro rígido demais com cadastro sujo (cor não está no texto → falso negativo)

No design alvo: filtros **depois** do RRF/re-rank (ou em ambos os braços, com cuidado) para não matar recall cedo demais — ver spec.

---

### 3.8 RAG, grounding, agent (contexto do produto)

Já cobertos no [glossário](../ai-glossary.md). Ligação com retrieval:

- **RAG ruim** quase sempre é retrieval/ranking ruim, não “o LLM é burro”.
- **Tool `search_products`:** o agent só recomenda o que a tool devolve → ranking da tool = qualidade dos cards.
- **Grounding:** cards vêm da tool; texto do LLM não inventa catálogo.

---

### 3.9 Moderação híbrida (imagem irmã — fora do escopo atual)

Funil: **Rules → ML classifier → LLM** (barato → caro).

**Quando usar no e-commerce:** input do chat, reviews, uploads de texto.

**Por que não misturar com retrieval agora:** problema diferente (safety vs relevância). Mesma intuição de **cascata por custo**.

---

## 4. Decisão deste projeto (resumo)

| Escolha | Valor |
|---------|--------|
| Objetivo | Recall + precision, prioridade no **top-K do agent** |
| Abordagem | Hybrid (paralelo) + **RRF** + **re-rank LLM via Ollama** |
| Restrição | Só local (sem Cohere/API paga de rerank) |
| Onde | `SearchProductsByTextUseCase` (tool v2 + fallback + `POST` de busca) |

Detalhe de implementação, configs e testes: [spec](../superpowers/specs/2026-11-04-hybrid-search-rerank-design.md).

---

## 5. Como estudar na prática (rota de carreira)

Ordem sugerida (cada item = 1 conceito consolidado):

1. **Rodar o chat v2** com queries boas e ruins; anotar quando o top-K falha (lexical? semântico? filtro?).
2. **Implementar/acompanhar hybrid + RRF** neste repo — ver fusão sem calibrar score.
3. **Ligar re-rank LLM local** — medir latência (+1 round Ollama) vs ganho no top-3.
4. **Montar 20–30 queries de eval** (esperado: ids de produto) — isso é trabalho de AI Engineer de verdade.
5. **Lab Python (opcional):** `rank_bm25` + `sentence-transformers` cross-encoder nos mesmos textos exportados do Postgres; comparar com o re-rank Ollama. Não precisa ir para produção.

Sinais de que você “entendeu”:

- Explica por que RRF existe (escalas de score).
- Sabe dizer se um bug é retrieval, ranking, filtro ou grounding.
- Escolhe **não** usar re-rank quando N é pequeno ou a latência não paga.

---

## 6. Cheat sheet — “qual peça eu uso?”

| Situação | Peça |
|----------|------|
| Usuário descreve com outras palavras | Semantic |
| Usuário digita nome/código parecido com o cadastro | Keyword |
| Quer o melhor dos dois mundos na candidatura | Hybrid + RRF |
| Top da lista ainda vem “quase certo” | Re-rank |
| “Barato e vermelho” | Filtro de domínio (+ retrieval) |
| Modelo inventa produto | Grounding / tools (não é ranking) |
| Conteúdo ofensivo no chat | Moderação em cascata (outro pipeline) |

---

## 7. Glossário rápido (termos novos)

| Termo | Uma linha |
|-------|-----------|
| **Hybrid retrieval** | Dois+ métodos de busca + fusão |
| **RRF** | Fusão por posição recíproca |
| **Candidate generation** | Fase de recall (listas largas) |
| **Re-rank** | Fase de precision no top-N |
| **Listwise rerank** | Modelo ordena a lista inteira de uma vez |
| **Cross-encoder** | Modelo que scoreia par (query, doc) |
| **BM25** | Ranking lexical clássico (probabilístico) |
| **k (RRF)** | Constante de suavização (ex.: 60) |
