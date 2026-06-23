import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { EmbeddingIndexService } from '../src/infra/ai/embedding-index.service';
import { PrismaService } from '../src/infra/database/prisma/prisma.service';

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

main().catch((error) => {
  console.error('Failed to reindex products:', error);
  process.exit(1);
});
