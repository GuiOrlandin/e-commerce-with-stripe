import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthRequestModel } from '../auth/models/AuthRequestModel';
import { GenerateChatReplyUseCase } from 'src/modules/chat/useCase/generateChatReplyUseCase';
import { GenerateChatV2ReplyUseCase } from 'src/modules/chat/useCase/generateChatV2ReplyUseCase';
import { SearchProductsByTextUseCase } from 'src/modules/chat/useCase/searchProductsByTextUseCase';
import { ChatMessageBody, ChatV2MessageBody } from './dtos/chatMessageBody';
import { ChatQuotaGuard } from './guards/chatQuota.guard';

@Controller('chat')
@UseGuards(ChatQuotaGuard)
export class ChatController {
  constructor(
    private searchProducts: SearchProductsByTextUseCase,
    private generateReply: GenerateChatReplyUseCase,
    private generateV2Reply: GenerateChatV2ReplyUseCase,
  ) {}

  @Post()
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

  /** LangChain agent path (multi-turn + tools). See docs/adr/chat-langchain-v1.md */
  @Post('v2')
  async chatV2(
    @Body() body: ChatV2MessageBody,
    @Request() request: AuthRequestModel,
  ) {
    const result = await this.generateV2Reply.execute({
      userId: request.user.id,
      message: body.message,
      conversationId: body.conversationId,
    });

    return {
      conversationId: result.conversationId,
      reply: result.reply,
      products: result.products,
      meta: { matchCount: result.products.length },
    };
  }
}
