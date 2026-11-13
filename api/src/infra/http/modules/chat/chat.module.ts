import { Module } from '@nestjs/common';
import { AiModule } from 'src/infra/ai/ai.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { LangChainChatAgentService } from 'src/infra/ai/langchainChatAgent.service';
import { ChatQuotaService } from 'src/modules/chat/quota/chatQuotaService';
import { GenerateChatReplyUseCase } from 'src/modules/chat/useCase/generateChatReplyUseCase';
import { GenerateChatV2ReplyUseCase } from 'src/modules/chat/useCase/generateChatV2ReplyUseCase';
import { SearchProductsByTextUseCase } from 'src/modules/chat/useCase/searchProductsByTextUseCase';
import { ChatController } from './chat.controller';
import { ChatQuotaGuard } from './guards/chatQuota.guard';
import { ChatUsageInterceptor } from './interceptors/chatUsage.interceptor';

@Module({
  imports: [DatabaseModule, AiModule],
  controllers: [ChatController],
  providers: [
    SearchProductsByTextUseCase,
    GenerateChatReplyUseCase,
    LangChainChatAgentService,
    GenerateChatV2ReplyUseCase,
    ChatQuotaService,
    ChatQuotaGuard,
    ChatUsageInterceptor,
  ],
})
export class ChatModule {}
