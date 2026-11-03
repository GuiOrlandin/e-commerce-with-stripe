import { Module } from '@nestjs/common';
import { AiModule } from 'src/infra/ai/ai.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { LangChainChatAgentService } from 'src/infra/ai/langchainChatAgent.service';
import { GenerateChatReplyUseCase } from 'src/modules/chat/useCase/generateChatReplyUseCase';
import { GenerateChatV2ReplyUseCase } from 'src/modules/chat/useCase/generateChatV2ReplyUseCase';
import { SearchProductsByTextUseCase } from 'src/modules/chat/useCase/searchProductsByTextUseCase';
import { ChatController } from './chat.controller';

@Module({
  imports: [DatabaseModule, AiModule],
  controllers: [ChatController],
  providers: [
    SearchProductsByTextUseCase,
    GenerateChatReplyUseCase,
    LangChainChatAgentService,
    GenerateChatV2ReplyUseCase,
  ],
})
export class ChatModule {}
