import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmbeddingIndexService } from './embedding-index.service';
import { OllamaService } from './ollama.service';

@Module({
  imports: [DatabaseModule],
  providers: [OllamaService, EmbeddingIndexService],
  exports: [OllamaService, EmbeddingIndexService],
})
export class AiModule {}
