import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { GenerateChatV2ReplyUseCase } from 'src/modules/chat/useCase/generateChatV2ReplyUseCase';
import { normalize } from 'src/modules/chat/useCase/productAttributeGroups';
import { SearchProductsByTextUseCase } from 'src/modules/chat/useCase/searchProductsByTextUseCase';
import { endToEndCorrect, EvalCase, hitAtK, mean, recallAtK } from './scoring';

const EVAL_USER_ID = 'eval-user';

// Usage: npm run eval -- [--min-hit=0.8] [--min-e2e=0.8]
// Runs with NODE_PATH=. instead of tsconfig-paths: its langgraph/prebuilt path maps to a .d.ts and crashes at runtime.
function flag(name: string) {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? Number(arg.split('=')[1]) : null;
}

async function main() {
  const cases: EvalCase[] = JSON.parse(
    readFileSync(join(__dirname, 'cases.json'), 'utf8'),
  );
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
    abortOnError: false,
  });
  const search = app.get(SearchProductsByTextUseCase);
  const chatV2 = app.get(GenerateChatV2ReplyUseCase);
  const k = app.get(ConfigService).get<number>('CHAT.topK')!;

  // A stale golden set looks like a model regression; flag names missing from the catalog.
  const catalog = new Set(
    (
      await app.get(PrismaService).product.findMany({ select: { name: true } })
    ).map((p) => normalize(p.name.trim())),
  );
  for (const c of cases) {
    const missing = (c.expectedNames ?? []).filter(
      (n) => !catalog.has(normalize(n.trim())),
    );
    if (missing.length) console.warn(`[${c.id}] not in catalog: ${missing}`);
  }

  const results = [];
  for (const c of cases) {
    let t = Date.now();
    const { matches } = await search.execute(c.query);
    const retrievalMs = Date.now() - t;
    const retrieved = matches.map((m) => m.name);

    t = Date.now();
    const { reply, products } = await chatV2.execute({
      userId: EVAL_USER_ID,
      message: c.query,
      conversationId: randomUUID(),
    });
    const e2eMs = Date.now() - t;
    const productNames = products.map((p) => p.name);

    const result = {
      id: c.id,
      query: c.query,
      shouldRefuse: !!c.shouldRefuse,
      hit: c.shouldRefuse ? null : hitAtK(c.expectedNames, retrieved, k),
      recall: c.shouldRefuse ? null : recallAtK(c.expectedNames, retrieved, k),
      e2eOk: endToEndCorrect(c, productNames),
      retrievalMs,
      e2eMs,
      retrieved,
      productNames,
      reply,
    };
    results.push(result);
    console.log(
      [
        c.id.padEnd(28),
        `hit=${result.hit ?? '-'}`.padEnd(10),
        `recall=${result.recall?.toFixed(2) ?? '-'}`.padEnd(12),
        `e2e=${result.e2eOk ? 'ok' : 'FAIL'}`.padEnd(9),
        `${retrievalMs}ms/${e2eMs}ms`,
      ].join(' '),
    );
  }
  await app.close();

  const retrievalCases = results.filter((r) => !r.shouldRefuse);
  const refuseCases = results.filter((r) => r.shouldRefuse);
  const summary = {
    k,
    cases: results.length,
    hitAtK: mean(retrievalCases.map((r) => (r.hit ? 1 : 0))),
    recallAtK: mean(retrievalCases.map((r) => r.recall)),
    e2eAccuracy: mean(results.map((r) => (r.e2eOk ? 1 : 0))),
    e2eRecommendAccuracy: mean(retrievalCases.map((r) => (r.e2eOk ? 1 : 0))),
    refusalAccuracy: mean(refuseCases.map((r) => (r.e2eOk ? 1 : 0))),
    avgRetrievalMs: Math.round(mean(results.map((r) => r.retrievalMs))),
    avgE2eMs: Math.round(mean(results.map((r) => r.e2eMs))),
  };
  console.log('\nSummary:', JSON.stringify(summary, null, 2));

  const dir = join(__dirname, 'results');
  mkdirSync(dir, { recursive: true });
  const file = join(
    dir,
    `${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  );
  writeFileSync(file, JSON.stringify({ summary, results }, null, 2));
  console.log(`Results: ${file}`);

  const minHit = flag('min-hit');
  const minE2e = flag('min-e2e');
  if (
    (minHit !== null && summary.hitAtK < minHit) ||
    (minE2e !== null && summary.e2eAccuracy < minE2e)
  ) {
    console.error('Below threshold');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Eval failed:', error);
  process.exit(1);
});
