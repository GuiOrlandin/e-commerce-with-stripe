# Evidência — Task 0: Postgres com pgvector

**Plano:** [2026-06-17-chat-ai-product-search.md](../plans/2026-06-17-chat-ai-product-search.md)  
**Task:** 0 — Postgres com pgvector  
**Concluída em:** 2026-06-17

---

## Commit

| Campo | Valor |
|-------|-------|
| SHA | `3eaf081c4fdc015704b564ff915c8a0f5a2407f8` |
| Mensagem | `chore: use pgvector image for postgres` |
| Autor | GuiOrlandin |
| Data | 2026-06-17 23:53:18 -0300 |

---

## Arquivos alterados

| Arquivo | Mudança | Resumo |
|---------|---------|--------|
| `api/docker-compose.yml` | M | Substituição de MongoDB por Postgres com imagem `pgvector/pgvector:pg16`; porta `5433`, healthcheck e volume `postgres_data` |

**Diff stats:** 1 arquivo, +11 / −17 linhas

---

## Verificações

| Verificação | Resultado |
|-------------|-----------|
| Container `postgres` healthy na porta `5433` | ✅ |
| Extensão `vector` (v0.8.2) via `prisma db execute` | ✅ |
| Modelos Ollama `gemma3:4b` e `nomic-embed-text` | ✅ |
| `npx prisma migrate deploy` (pós volume wipe) | ✅ — migration `20260618004334_init_postgresql` aplicada |

### Ações manuais / runtime (não commitadas)

- Recriação do container e volume `api_postgres_data`
- `CREATE EXTENSION IF NOT EXISTS vector;` via Prisma
- Inicialização do servidor Ollama (`ollama serve`) para pull dos modelos

---

## Reviews

| Review | Veredito | Notas |
|--------|----------|-------|
| Spec compliance | ✅ (com ressalvas) | Objetivos funcionais atendidos; commit no git incluiu migração MongoDB→Postgres (HEAD anterior ainda tinha MongoDB) |
| Code quality | ✅ Aprovado | `docker-compose.yml` limpo e alinhado com `.env.example`; recomenda migration versionada para `CREATE EXTENSION vector` na Task 2 |

---

## Observações / follow-ups

1. Adicionar migration Prisma com `CREATE EXTENSION IF NOT EXISTS vector` antes da Task 2 (embeddings).
2. Configurar Ollama como serviço persistente (systemd) para sobreviver a reboots.
3. Commit mais amplo que o Step 1 literal do plano — justificado pelo estado do repositório (Postgres já em uso no working tree, MongoDB ainda no HEAD).
