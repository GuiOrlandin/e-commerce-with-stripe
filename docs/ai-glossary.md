# Glossário de IA (neste repositório)

Vocabulário vivo para o chat + embeddings do e-commerce. Cada termo liga ao que o código faz hoje.

Relacionado: [ADR chat LangChain v1](./adr/chat-langchain-v1.md).

---

## Retrieval & embeddings

### Embedding
Vetor numérico que representa texto (ou imagem). Aqui: `OllamaService.embed` + modelo `OLLAMA_EMBED_MODEL` (`nomic-embed-text`). Produtos guardam `text_embedding` / `image_embedding` no Postgres.

### pgvector
Extensão Postgres para tipo `vector` e distância (ex.: `<=>` cosine). Usado em `searchByTextEmbedding`.

### Similarity / score
Quão perto dois embeddings estão. No chat, candidatos vêm ordenados por distância; `CHAT_SIMILARITY_THRESHOLD` corta os fracos.

### Retriever / retrieval
Passo que **busca** contexto (produtos) antes de o LLM falar. v1: use case de busca. v2: tool `search_products` (mesmo miolo).

### RAG (Retrieval-Augmented Generation)
Gerar resposta **com** documentos recuperados no prompt, em vez de só “memória” do modelo. Nosso chat é RAG de catálogo.

### Reindex
Recalcular embeddings dos produtos (`npm run db:reindex-products`). Sem isso, busca vetorial fica vazia/desatualizada.

---

## Grounding & qualidade

### Grounding
Resposta **ancorada** em evidência (lista da tool/DB). Regra v2: cards `products` = output da tool, não inventário do LLM.

### Hallucination (alucinação)
Modelo inventa produto, preço ou fato. Mitigação: prompt restrito + grounding por tools + validação de IDs.

### Eval
Como medir se o chat está bom (ex.: “não recomendou produto fora do match”). Ainda manual; evolui com casos fixos/testes.

---

## Agents & LangChain

### Tool
Função que o agente pode chamar (ex.: `search_products`). Tem nome, descrição e schema (Zod).

### Tool-calling
O modelo emite `tool_calls` estruturados; o runtime executa e devolve `ToolMessage`. Nem todo modelo Ollama faz isso bem (`gemma3:4b` pode falhar → fallback no ADR).

### Agent loop
Ciclo: modelo → (opcional) tool → modelo → … até resposta final. Diferente do pipeline fixo de `/chat`.

### ReAct
Padrão Reason + Act (pensar/agir com tools). `createReactAgent` no LangGraph implementa esse loop.

### LangChain
Biblioteca de blocos (LLM, tools, prompts, messages) para apps de LLM.

### LangGraph
Orquestração em grafo (estado, nós, memória/`checkpointer`). `createReactAgent` é um grafo pré-pronto; grafo custom vem depois (clarify, branches).

### Memory / session / thread
Histórico entre turnos. Spike: `MemorySaver` in-memory com `thread_id` = `conversationId`. v1 “de verdade”: Postgres.

### ConversationId
ID da conversa que o front guarda e reenvia em `/chat/v2` para continuar o mesmo thread.

### Structured output
Forçar JSON/schema na saída do modelo. Aqui priorizamos tools + parse; structured output é evolução.

### Checkpoint / MemorySaver
Snapshot do estado do grafo por `thread_id`. Reiniciar a API zera o saver in-memory.

---

## Papéis (carreira)

### AI Engineer (neste projeto)
Quem liga modelo + retrieval + produto: contratos de API, grounding, eval, custo/latência, falhas do Ollama, evolução de tools — não só “prompt bonito”.

### Pipeline vs agent
- **Pipeline:** passos fixos no código (`/chat`).
- **Agent:** modelo escolhe tools/próximo passo (`/chat/v2`), com guardrails de grounding.
