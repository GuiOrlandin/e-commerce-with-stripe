import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/isPublic';
import { ChatMessageBody, ChatV2MessageBody } from './dtos/chatMessageBody';
import { SearchProductsByTextUseCase } from 'src/modules/chat/useCase/searchProductsByTextUseCase';
import { GenerateChatReplyUseCase } from 'src/modules/chat/useCase/generateChatReplyUseCase';
import { GenerateChatV2ReplyUseCase } from 'src/modules/chat/useCase/generateChatV2ReplyUseCase';

@Controller('chat')
export class ChatController {
  constructor(
    private searchProducts: SearchProductsByTextUseCase,
    private generateReply: GenerateChatReplyUseCase,
    private generateV2Reply: GenerateChatV2ReplyUseCase,
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

  /** LangChain agent path (multi-turn + tools). See docs/adr/chat-langchain-v1.md */
  @Post('v2')
  @Public()
  async chatV2(@Body() body: ChatV2MessageBody) {
    const result = await this.generateV2Reply.execute({
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
