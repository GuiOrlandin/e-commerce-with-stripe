import { Module } from '@nestjs/common';
import { AiModule } from 'src/infra/ai/ai.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { GenerateChatReplyUseCase } from 'src/modules/chat/useCase/generateChatReplyUseCase';
import { SearchProductsByTextUseCase } from 'src/modules/chat/useCase/searchProductsByTextUseCase';
import { ChatController } from './chat.controller';

@Module({
  imports: [DatabaseModule, AiModule],
  controllers: [ChatController],
  providers: [SearchProductsByTextUseCase, GenerateChatReplyUseCase],
})
export class ChatModule {}
