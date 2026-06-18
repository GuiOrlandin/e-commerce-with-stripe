# Chat com IA — Busca de Produtos por Texto e Imagem

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que o usuário descreva um produto ou envie uma imagem em um chat no front-end e receba sugestões com link/ação para compra, usando Ollama local (Gemma + embeddings) e busca vetorial no PostgreSQL.

**Architecture:** RAG em duas camadas — (1) busca vetorial retorna top-K produtos candidatos via `pgvector`; (2) Gemma formata a resposta conversacional restrita aos candidatos. Embeddings de texto via Ollama (`nomic-embed-text`); embeddings de imagem via microserviço Python com CLIP (Fase 2). Indexação automática ao cadastrar produto.

**Tech Stack:** NestJS 10, Prisma 7, PostgreSQL + pgvector, Ollama (`gemma3:4b`, `nomic-embed-text`), FastAPI + `sentence-transformers` (CLIP), React + TanStack Query + Zustand.

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---------|------------------|
| `api/docker-compose.yml` | Postgres com extensão pgvector |
| `api/prisma/schema.prisma` | Colunas de embedding no `Product` |
| `api/.env.example` | Variáveis Ollama e embedding service |
| `api/config/config.ts` | Config tipada para serviços de IA |
| `api/src/modules/chat/` | Domínio: use cases e interfaces |
| `api/src/infra/ai/ollama.service.ts` | Cliente HTTP Ollama (embed + chat) |
| `api/src/infra/ai/embedding-index.service.ts` | Gera e persiste embeddings de produto |
| `api/src/infra/ai/cosine-similarity.ts` | Utilitário de similaridade (fallback/testes) |
| `api/src/infra/database/prisma/respositories/prismaProductRepository.ts` | Queries vetoriais com `$queryRaw` |
| `api/src/infra/http/modules/chat/` | Controller, DTOs, module NestJS |
| `api/scripts/reindex-products.ts` | Reindexa produtos existentes |
| `embedding-service/main.py` | FastAPI + CLIP (Fase 2) |
| `web/src/routes/chat/` | Página do chat |
| `web/src/components/chatWidget/` | UI reutilizável (opcional: widget flutuante) |
| `web/src/hooks/useChat.ts` | Hook de envio de mensagem/imagem |

---

## Fase 0 — Infraestrutura local

### Task 0: Postgres com pgvector

**Files:**
- Modify: `api/docker-compose.yml`
- Create: `api/prisma/migrations/.../migration.sql` (via Prisma)

- [ ] **Step 1: Trocar imagem do Postgres**

Em `api/docker-compose.yml`, substituir `postgres:16-alpine` por `pgvector/pgvector:pg16`:

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    container_name: postgres
    # ... resto igual
```

- [ ] **Step 2: Recriar container**

```bash
cd api
docker compose down
docker volume rm api_postgres_data  # só se puder perder dados locais
docker compose up -d
```

Expected: container `postgres` healthy na porta `5433`.

- [ ] **Step 3: Habilitar extensão vector**

Criar migration SQL manual ou rodar após migrate:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Via Prisma, adicionar em uma migration vazia ou `prisma db execute`:

```bash
cd api
npx prisma db execute --stdin <<'SQL'
CREATE EXTENSION IF NOT EXISTS vector;
SQL
```

Expected: sem erro.

- [ ] **Step 4: Instalar Ollama e modelos**

```bash
curl -fsSL https://ollama.com/install.sh | sh  # se ainda não instalado
ollama pull gemma3:4b
ollama pull nomic-embed-text
ollama list
```

Expected: ambos os modelos listados.

- [ ] **Step 5: Commit**

```bash
git add api/docker-compose.yml
git commit -m "chore: use pgvector image for postgres"
```

---

### Task 1: Variáveis de ambiente e config

**Files:**
- Modify: `api/.env.example`
- Modify: `api/.env` (local, não commitar)
- Modify: `api/config/config.ts`

- [ ] **Step 1: Adicionar variáveis em `.env.example`**

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=gemma3:4b
OLLAMA_EMBED_MODEL=nomic-embed-text
EMBEDDING_SERVICE_URL=http://localhost:8000
CHAT_SIMILARITY_THRESHOLD=0.65
CHAT_TOP_K=5
```

- [ ] **Step 2: Estender `config/config.ts`**

```typescript
const configs = () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  GLOBAL: {
    PORT: process.env.PORT || 3000,
  },
  OLLAMA: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    chatModel: process.env.OLLAMA_CHAT_MODEL || 'gemma3:4b',
    embedModel: process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text',
  },
  EMBEDDING_SERVICE: {
    baseUrl: process.env.EMBEDDING_SERVICE_URL || 'http://localhost:8000',
  },
  CHAT: {
    similarityThreshold: parseFloat(process.env.CHAT_SIMILARITY_THRESHOLD || '0.65'),
    topK: parseInt(process.env.CHAT_TOP_K || '5', 10),
  },
  STRIPE_CONFIG: {
    // ... existente
  },
});
```

- [ ] **Step 3: Copiar valores para `.env` local**

- [ ] **Step 4: Commit**

```bash
git add api/.env.example api/config/config.ts
git commit -m "chore: add ollama and chat config"
```

---

## Fase 1 — MVP: busca por texto

### Task 2: Schema Prisma com embeddings

**Files:**
- Modify: `api/prisma/schema.prisma`

Dimensão do `nomic-embed-text`: **768**.

- [ ] **Step 1: Adicionar campos ao model Product**

```prisma
model Product {
    id               String   @id @default(cuid())
    created_at       DateTime @default(now())
    name             String
    description      String?
    image_url        String
    user             User     @relation(fields: [user_id], references: [id])
    user_id          String
    unit_value       Float
    stock            Float
    category         String
    text_embedding   Unsupported("vector(768)")?
    image_embedding  Unsupported("vector(512)")?  // CLIP ViT-B/32 = 512 dims (Fase 2)

    @@index([user_id])
    @@map("products")
}
```

- [ ] **Step 2: Rodar migration**

```bash
cd api
npm run db:migrate
# nome sugerido: add_product_embeddings
```

- [ ] **Step 3: Gerar client**

```bash
npm run db:generate
```

Expected: migration aplicada, client gerado sem erro.

- [ ] **Step 4: Commit**

```bash
git add api/prisma/
git commit -m "feat: add text and image embedding columns to products"
```

---

### Task 3: OllamaService

**Files:**
- Create: `api/src/infra/ai/ollama.service.ts`
- Create: `api/src/infra/ai/ai.module.ts`
- Test: `api/src/infra/ai/ollama.service.spec.ts`

- [ ] **Step 1: Escrever teste unitário (mock fetch)**

```typescript
// api/src/infra/ai/ollama.service.spec.ts
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configs from 'config/config';
import { OllamaService } from './ollama.service';

describe('OllamaService', () => {
  it('embed returns float array from ollama response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ embedding: [0.1, 0.2, 0.3] }),
    }) as jest.Mock;

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configs], isGlobal: true })],
      providers: [OllamaService],
    }).compile();

    const service = moduleRef.get(OllamaService);
    const result = await service.embed('tênis vermelho');

    expect(result).toEqual([0.1, 0.2, 0.3]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/embeddings'),
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
```

- [ ] **Step 2: Rodar teste — deve falhar**

```bash
cd api
npm test -- ollama.service.spec.ts
```

Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar `OllamaService`**

```typescript
// api/src/infra/ai/ollama.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface OllamaEmbedResponse {
  embedding: number[];
}

interface OllamaChatResponse {
  message: { role: string; content: string };
}

@Injectable()
export class OllamaService {
  constructor(private config: ConfigService) {}

  private get baseUrl(): string {
    return this.config.get<string>('OLLAMA.baseUrl')!;
  }

  async embed(text: string): Promise<number[]> {
    const model = this.config.get<string>('OLLAMA.embedModel')!;
    const response = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt: text }),
    });

    if (!response.ok) {
      throw new Error(`Ollama embed failed: ${response.statusText}`);
    }

    const data = (await response.json()) as OllamaEmbedResponse;
    return data.embedding;
  }

  async chat(systemPrompt: string, userMessage: string): Promise<string> {
    const model = this.config.get<string>('OLLAMA.chatModel')!;
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama chat failed: ${response.statusText}`);
    }

    const data = (await response.json()) as OllamaChatResponse;
    return data.message.content;
  }
}
```

```typescript
// api/src/infra/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { EmbeddingIndexService } from './embedding-index.service';

@Module({
  providers: [OllamaService, EmbeddingIndexService],
  exports: [OllamaService, EmbeddingIndexService],
})
export class AiModule {}
```

- [ ] **Step 4: Rodar teste — deve passar**

```bash
npm test -- ollama.service.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add api/src/infra/ai/
git commit -m "feat: add ollama service for embed and chat"
```

---

### Task 4: EmbeddingIndexService + indexação no cadastro

**Files:**
- Create: `api/src/infra/ai/embedding-index.service.ts`
- Modify: `api/src/infra/database/prisma/respositories/prismaProductRepository.ts`
- Modify: `api/src/modules/products/useCase/createProductUseCase.ts`
- Modify: `api/src/infra/http/modules/product/product.module.ts`

- [ ] **Step 1: Adicionar método `updateTextEmbedding` no repositório**

Em `prismaProductRepository.ts`:

```typescript
async updateTextEmbedding(productId: string, embedding: number[]): Promise<void> {
  const vectorLiteral = `[${embedding.join(',')}]`;
  await this.prisma.$executeRawUnsafe(
    `UPDATE products SET text_embedding = $1::vector WHERE id = $2`,
    vectorLiteral,
    productId,
  );
}

async searchByTextEmbedding(
  embedding: number[],
  topK: number,
): Promise<Array<{ id: string; name: string; description: string | null; image_url: string; unit_value: number; stock: number; category: string; score: number }>> {
  const vectorLiteral = `[${embedding.join(',')}]`;
  return this.prisma.$queryRawUnsafe(
    `
    SELECT
      id, name, description, image_url, unit_value, stock, category,
      1 - (text_embedding <=> $1::vector) AS score
    FROM products
    WHERE text_embedding IS NOT NULL AND stock >= 1
    ORDER BY text_embedding <=> $1::vector
    LIMIT $2
    `,
    vectorLiteral,
    topK,
  );
}
```

- [ ] **Step 2: Estender interface abstrata `ProductRepository`**

```typescript
// api/src/modules/products/repositories/productRepository.ts
abstract updateTextEmbedding(productId: string, embedding: number[]): Promise<void>;
abstract searchByTextEmbedding(
  embedding: number[],
  topK: number,
): Promise<Array<{
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  unit_value: number;
  stock: number;
  category: string;
  score: number;
}>>;
```

- [ ] **Step 3: Criar `EmbeddingIndexService`**

```typescript
// api/src/infra/ai/embedding-index.service.ts
import { Injectable } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { ProductRepository } from 'src/modules/products/repositories/productRepository';

@Injectable()
export class EmbeddingIndexService {
  constructor(
    private ollama: OllamaService,
    private productRepository: ProductRepository,
  ) {}

  buildProductText(product: {
    name: string;
    description?: string | null;
    category: string;
  }): string {
    return [product.name, product.category, product.description ?? '']
      .filter(Boolean)
      .join(' | ');
  }

  async indexProductText(productId: string, product: {
    name: string;
    description?: string | null;
    category: string;
  }): Promise<void> {
    const text = this.buildProductText(product);
    const embedding = await this.ollama.embed(text);
    await this.productRepository.updateTextEmbedding(productId, embedding);
  }
}
```

- [ ] **Step 4: Chamar indexação após criar produto**

`CreateProductUseCase` deve retornar o produto com `_id` e chamar indexação. Opção mais limpa: fazer no controller após `execute`, ou injetar `EmbeddingIndexService` no use case.

No `product.controller.ts`, após `createProductUseCase.execute`:

```typescript
await this.embeddingIndexService.indexProductText(product._id, {
  name: product.name,
  description: product.description,
  category: product.category,
});
```

Importar `AiModule` em `ProductModule`.

- [ ] **Step 5: Testar manualmente**

1. Subir API + Ollama
2. `POST /product` com produto de teste
3. Verificar no banco: `SELECT id, text_embedding IS NOT NULL FROM products;`

Expected: `text_embedding` preenchido.

- [ ] **Step 6: Commit**

```bash
git add api/src/
git commit -m "feat: index product text embeddings on create"
```

---

### Task 5: Script de reindexação

**Files:**
- Create: `api/scripts/reindex-products.ts`
- Modify: `api/package.json`

- [ ] **Step 1: Criar script**

```typescript
// api/scripts/reindex-products.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infra/database/prisma/prisma.service';
import { EmbeddingIndexService } from '../src/infra/ai/embedding-index.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const indexer = app.get(EmbeddingIndexService);

  const products = await prisma.product.findMany();
  for (const product of products) {
    await indexer.indexProductText(product.id, product);
    console.log(`Indexed: ${product.name}`);
  }

  await app.close();
}

main();
```

- [ ] **Step 2: Adicionar script no package.json**

```json
"db:reindex-products": "ts-node scripts/reindex-products.ts"
```

- [ ] **Step 3: Rodar para produtos existentes**

```bash
cd api
npm run db:reindex-products
```

Expected: log de cada produto indexado.

- [ ] **Step 4: Commit**

```bash
git add api/scripts/reindex-products.ts api/package.json
git commit -m "feat: add product reindex script"
```

---

### Task 6: Módulo Chat — busca + resposta Gemma

**Files:**
- Create: `api/src/modules/chat/useCase/searchProductsByTextUseCase.ts`
- Create: `api/src/modules/chat/useCase/generateChatReplyUseCase.ts`
- Create: `api/src/infra/http/modules/chat/chat.controller.ts`
- Create: `api/src/infra/http/modules/chat/dtos/chatMessageBody.ts`
- Create: `api/src/infra/http/modules/chat/chat.module.ts`
- Modify: `api/src/app.module.ts`

- [ ] **Step 1: `SearchProductsByTextUseCase`**

```typescript
// api/src/modules/chat/useCase/searchProductsByTextUseCase.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OllamaService } from 'src/infra/ai/ollama.service';
import { ProductRepository } from 'src/modules/products/repositories/productRepository';

@Injectable()
export class SearchProductsByTextUseCase {
  constructor(
    private ollama: OllamaService,
    private productRepository: ProductRepository,
    private config: ConfigService,
  ) {}

  async execute(message: string) {
    const topK = this.config.get<number>('CHAT.topK')!;
    const threshold = this.config.get<number>('CHAT.similarityThreshold')!;

    const embedding = await this.ollama.embed(message);
    const candidates = await this.productRepository.searchByTextEmbedding(
      embedding,
      topK,
    );

    const matches = candidates.filter((c) => c.score >= threshold);
    return { candidates, matches };
  }
}
```

- [ ] **Step 2: `GenerateChatReplyUseCase`**

```typescript
// api/src/modules/chat/useCase/generateChatReplyUseCase.ts
import { Injectable } from '@nestjs/common';
import { OllamaService } from 'src/infra/ai/ollama.service';

type Candidate = {
  id: string;
  name: string;
  description: string | null;
  unit_value: number;
  category: string;
  score: number;
};

@Injectable()
export class GenerateChatReplyUseCase {
  constructor(private ollama: OllamaService) {}

  async execute(userMessage: string, matches: Candidate[]): Promise<string> {
    if (matches.length === 0) {
      return 'Não encontrei um produto parecido na loja. Pode descrever com mais detalhes (cor, categoria, nome)?';
    }

    const catalog = matches
      .map(
        (p, i) =>
          `${i + 1}. id=${p.id} | ${p.name} | ${p.category} | R$ ${p.unit_value.toFixed(2)} | ${p.description ?? ''}`,
      )
      .join('\n');

    const systemPrompt = `Você é assistente de uma loja online em português do Brasil.
Regras:
- Só pode recomendar produtos da lista fornecida.
- Nunca invente produtos ou preços.
- Seja breve e amigável.
- Mencione o nome e preço do produto mais relevante.
- Convide o usuário a adicionar ao carrinho.

Produtos candidatos:
${catalog}`;

    return this.ollama.chat(systemPrompt, userMessage);
  }
}
```

- [ ] **Step 3: Controller**

```typescript
// api/src/infra/http/modules/chat/chat.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/isPublic';
import { ChatMessageBody } from './dtos/chatMessageBody';
import { SearchProductsByTextUseCase } from 'src/modules/chat/useCase/searchProductsByTextUseCase';
import { GenerateChatReplyUseCase } from 'src/modules/chat/useCase/generateChatReplyUseCase';

@Controller('chat')
export class ChatController {
  constructor(
    private searchProducts: SearchProductsByTextUseCase,
    private generateReply: GenerateChatReplyUseCase,
  ) {}

  @Post()
  @Public()
  async chat(@Body() body: ChatMessageBody) {
    const { candidates, matches } = await this.searchProducts.execute(
      body.message,
    );
    const reply = await this.generateReply.execute(body.message, matches);

    return {
      reply,
      products: matches.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        image_url: `/files/${p.image_url}`,
        unit_value: p.unit_value,
        stock: p.stock,
        category: p.category,
        score: p.score,
      })),
      meta: { candidateCount: candidates.length, matchCount: matches.length },
    };
  }
}
```

```typescript
// api/src/infra/http/modules/chat/dtos/chatMessageBody.ts
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatMessageBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}
```

- [ ] **Step 4: Registrar `ChatModule` em `app.module.ts`**

- [ ] **Step 5: Testar com curl**

```bash
curl -X POST http://localhost:3333/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"tênis de corrida"}'
```

Expected: JSON com `reply` em português e array `products`.

- [ ] **Step 6: Commit**

```bash
git add api/src/
git commit -m "feat: add chat endpoint with text vector search"
```

---

### Task 7: Front-end — página de chat

**Files:**
- Create: `web/src/routes/chat/index.tsx`
- Create: `web/src/routes/chat/styles.ts`
- Create: `web/src/hooks/useChat.ts`
- Modify: `web/src/App.tsx`
- Modify: `web/src/components/sidebar/index.tsx` (link de navegação)

- [ ] **Step 1: Hook `useChat`**

```typescript
// web/src/hooks/useChat.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface ChatProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  unit_value: number;
  stock: number;
  category: string;
  score: number;
}

export interface ChatResponse {
  reply: string;
  products: ChatProduct[];
}

export function useChat() {
  return useMutation({
    mutationFn: async (message: string) => {
      const { data } = await axios.post<ChatResponse>(
        "http://localhost:3333/chat",
        { message },
      );
      return data;
    },
  });
}
```

- [ ] **Step 2: Página de chat**

Componente com:
- Lista de mensagens (`user` | `assistant`)
- Input + botão enviar
- Cards de produto retornados com botão **Adicionar ao carrinho** usando `productStore.setProduct`
- Link **Ir ao carrinho** → `/cart`

Mapear `ChatProduct` para o tipo `Product` do store (`_id`, `quantity: 1`).

- [ ] **Step 3: Registrar rota em `App.tsx`**

```typescript
{
  path: "/chat",
  element: <Chat />,
},
```

Dentro dos `children` do `Layout`.

- [ ] **Step 4: Adicionar item no sidebar**

Link "Assistente" ou "Chat" apontando para `/chat`.

- [ ] **Step 5: Testar fluxo manual**

1. Abrir `/chat`
2. Digitar descrição de produto existente
3. Clicar "Adicionar ao carrinho"
4. Verificar `/cart`

- [ ] **Step 6: Commit**

```bash
git add web/src/
git commit -m "feat: add chat page with product suggestions"
```

---

### Task 8: Testes e critérios de aceite — Fase 1

**Files:**
- Create: `web/src/routes/chat/index.spec.tsx`

- [ ] **Step 1: Teste front — renderiza input**

Testar que a página renderiza campo de mensagem e botão enviar.

- [ ] **Step 2: Checklist de aceite Fase 1**

| Cenário | Esperado |
|---------|----------|
| Mensagem descreve produto existente | Retorna 1+ produtos com score ≥ 0.65 |
| Mensagem sem match | `products: []`, reply pede mais detalhes |
| Ollama offline | API retorna 500 com mensagem clara |
| Novo produto cadastrado | Embedding gerado automaticamente |
| Adicionar ao carrinho | Produto aparece em `/cart` |

- [ ] **Step 3: Commit**

```bash
git add web/src/routes/chat/index.spec.tsx
git commit -m "test: add chat page smoke test"
```

**Entregável Fase 1:** chat funcional só com texto, 100% local, sem custo de API.

---

## Fase 2 — Busca por imagem (CLIP)

### Task 9: Microserviço Python de embedding

**Files:**
- Create: `embedding-service/main.py`
- Create: `embedding-service/requirements.txt`
- Create: `embedding-service/README.md`

- [ ] **Step 1: `requirements.txt`**

```text
fastapi==0.115.6
uvicorn==0.34.0
python-multipart==0.0.20
sentence-transformers==3.4.1
Pillow==11.1.0
```

- [ ] **Step 2: `main.py`**

```python
from fastapi import FastAPI, File, UploadFile, HTTPException
from sentence_transformers import SentenceTransformer
from PIL import Image
import io

app = FastAPI()
model = SentenceTransformer("clip-ViT-B-32")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/embed/image")
async def embed_image(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo deve ser imagem")

    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    embedding = model.encode(image).tolist()
    return {"embedding": embedding, "dimensions": len(embedding)}
```

- [ ] **Step 3: Subir serviço**

```bash
cd embedding-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

- [ ] **Step 4: Testar**

```bash
curl -X POST http://localhost:8000/embed/image \
  -F "file=@/caminho/para/imagem.jpg"
```

Expected: `{ "embedding": [...], "dimensions": 512 }`

- [ ] **Step 5: Commit**

```bash
git add embedding-service/
git commit -m "feat: add local CLIP embedding service"
```

---

### Task 10: Indexação de imagem no cadastro

**Files:**
- Create: `api/src/infra/ai/clip-embedding.service.ts`
- Modify: `api/src/infra/ai/embedding-index.service.ts`
- Modify: `api/src/infra/database/prisma/respositories/prismaProductRepository.ts`

- [ ] **Step 1: `ClipEmbeddingService`**

```typescript
// api/src/infra/ai/clip-embedding.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as FormData from 'form-data';
import fetch from 'node-fetch';

@Injectable()
export class ClipEmbeddingService {
  constructor(private config: ConfigService) {}

  async embedImageFile(absolutePath: string): Promise<number[]> {
    const baseUrl = this.config.get<string>('EMBEDDING_SERVICE.baseUrl')!;
    const form = new FormData();
    form.append('file', fs.createReadStream(absolutePath));

    const response = await fetch(`${baseUrl}/embed/image`, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      throw new Error(`CLIP embed failed: ${response.statusText}`);
    }

    const data = (await response.json()) as { embedding: number[] };
    return data.embedding;
  }
}
```

Instalar dependências se necessário: `form-data`, `node-fetch` (ou usar `axios` + `form-data`).

- [ ] **Step 2: `updateImageEmbedding` no repositório** (mesmo padrão de `updateTextEmbedding`, coluna `image_embedding`)

- [ ] **Step 3: `indexProductImage` no `EmbeddingIndexService`**

Ler arquivo de `api/uploads/{image_url}` e persistir vetor.

- [ ] **Step 4: Chamar no fluxo de criação de produto** (junto com indexação de texto)

- [ ] **Step 5: Atualizar `reindex-products.ts`** para indexar texto + imagem

- [ ] **Step 6: Commit**

```bash
git commit -m "feat: index product image embeddings via CLIP service"
```

---

### Task 11: Chat com upload de imagem

**Files:**
- Modify: `api/src/infra/http/modules/chat/chat.controller.ts`
- Create: `api/src/modules/chat/useCase/searchProductsByImageUseCase.ts`
- Create: `api/src/modules/chat/useCase/searchProductsHybridUseCase.ts`
- Modify: `web/src/hooks/useChat.ts`
- Modify: `web/src/routes/chat/index.tsx`

- [ ] **Step 1: Endpoint multipart**

```typescript
@Post()
@Public()
@UseInterceptors(FileInterceptor('image'))
async chat(
  @Body() body: ChatMessageBody,
  @UploadedFile() image?: Express.Multer.File,
) { ... }
```

- [ ] **Step 2: Lógica de roteamento**

| Entrada | Use case |
|---------|----------|
| Só `message` | `SearchProductsByTextUseCase` |
| Só `image` | `SearchProductsByImageUseCase` |
| Ambos | `SearchProductsHybridUseCase` (score = 0.4 texto + 0.6 imagem) |

- [ ] **Step 3: Query SQL imagem** (operador `<=>` em `image_embedding`)

- [ ] **Step 4: Front — input file + preview**

`FormData` com `message` e `image`.

- [ ] **Step 5: Testar com foto de produto do catálogo**

- [ ] **Step 6: Commit**

```bash
git commit -m "feat: support image upload in chat search"
```

**Entregável Fase 2:** chat aceita texto, imagem ou ambos.

---

## Fase 3 — Robustez e polish

### Task 12: Fallback e resiliência

**Files:**
- Modify: `api/src/modules/chat/useCase/searchProductsByTextUseCase.ts`
- Create: `api/src/modules/chat/useCase/fallbackKeywordSearchUseCase.ts`

- [ ] **Step 1: Se Ollama embed falhar, buscar com `ILIKE` em name/description/category**

- [ ] **Step 2: Timeout de 30s nas chamadas Ollama/CLIP**

- [ ] **Step 3: Health check endpoint `GET /chat/health`**

Retorna status de Ollama, CLIP e contagem de produtos indexados.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add chat fallback search and health check"
```

---

### Task 13: UX final no front

**Files:**
- Modify: `web/src/routes/chat/index.tsx`
- Create: `web/src/components/chatWidget/index.tsx` (opcional)

- [ ] **Step 1: Estados de loading e erro**

- [ ] **Step 2: Exibir score/confiança discreto (opcional)**

- [ ] **Step 3: Botão "Comprar agora" → adiciona ao carrinho e navega `/cart`**

- [ ] **Step 4: (Opcional) Widget flutuante em todas as páginas do Layout**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: improve chat UX with loading and cart actions"
```

---

## Ordem de execução resumida

```
Fase 0:  Task 0 → Task 1
Fase 1:  Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7 → Task 8
Fase 2:  Task 9 → Task 10 → Task 11
Fase 3:  Task 12 → Task 13
```

Cada fase entrega software utilizável. **Não iniciar Fase 2 antes de Fase 1 estar validada manualmente.**

---

## Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| Prisma não tipa `vector` | Usar `$queryRawUnsafe` / `Unsupported` — já previsto no plano |
| Ollama lento em CPU | Limitar `topK`, respostas curtas no prompt, cache de embeddings |
| Gemma inventa produto | Restringir prompt aos candidatos; nunca passar catálogo inteiro |
| Perda de dados ao trocar imagem Docker | Backup antes de `docker volume rm` |
| CLIP offline na Fase 2 | Fase 1 continua funcionando só com texto |

---

## Verificação final (antes de considerar concluído)

- [ ] `npm run db:reindex-products` indexa todos os produtos
- [ ] `GET /chat/health` retorna todos os serviços ok
- [ ] Chat texto encontra produto correto em ≥ 80% dos testes manuais
- [ ] Chat imagem encontra produto correto em ≥ 70% dos testes manuais
- [ ] Fluxo carrinho → checkout Stripe continua funcionando
- [ ] Nenhuma chave de API paga necessária em desenvolvimento

---

## Self-review (cobertura do spec)

| Requisito | Task |
|-----------|------|
| Chat no front-end | Task 7, 13 |
| Descrição de item | Task 6, 7 |
| Upload de imagem | Task 11 |
| Link/ação de compra | Task 7 (carrinho) |
| Ollama local + Gemma | Task 3, 6 |
| Embedding de texto | Task 4 |
| Embedding de imagem | Task 9, 10 |
| pgvector | Task 0, 2 |
| Custo zero | Arquitetura inteira local |
| Indexação no cadastro | Task 4, 10 |
