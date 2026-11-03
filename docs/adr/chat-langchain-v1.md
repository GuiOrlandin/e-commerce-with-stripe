# ADR: Chat v2 com LangChain.js (agent + tools)

## Status

Accepted (spike → v1)

## Context

O chat atual (`POST /chat`) é um **pipeline fixo**: reescreve query → embed/pgvector → filtros → uma chamada Ollama. Não há histórico entre turnos nem o modelo decidindo chamar retrieval de novo.

Queremos:

- aprender LangChain/LangGraph na prática
- multi-turno + tool-calling loop
- manter pgvector + Prisma + filtros existentes como **tools**
- não quebrar o chat v1 (feature flag por rota)

## Decision

1. Adicionar `POST /chat/v2` (LangChain.js dentro do Nest), manter `POST /chat`.
2. **v1 spike:** `createReactAgent` + tool `search_products` (envolve `SearchProductsByTextUseCase`) + `MemorySaver` (in-memory) keyed por `conversationId`.
3. **Grounding:** `products` na response HTTP vêm **somente** do resultado da tool (não do texto do LLM). Validação de IDs citados no texto do reply fica para uma fatia seguinte; os cards da UI já não dependem do texto.
4. **Clarify soft:** 0 matches → pedir mais detalhes (sem estado “aguardando confirmação”).
5. **Depois:** persistir sessões no Postgres; fatiar tools; opcional LangGraph explícito + clarify.
6. Modelos Ollama sem tool-calling nativo podem ignorar a tool — o use case aplica **fallback**: uma busca determinística + reply grounded (mesmo contrato). Preferir modelo com tools (`qwen2.5`, `llama3.1`, etc.) para exercitar o agent loop.

## Consequences

- Dois caminhos de chat para manter até v2 estabilizar.
- Memória in-memory some no restart do processo Nest.
- Dependências: `@langchain/core`, `@langchain/langgraph`, `@langchain/ollama`, `zod`.
- Front passa a enviar/guardar `conversationId` em `/chat/v2`.
