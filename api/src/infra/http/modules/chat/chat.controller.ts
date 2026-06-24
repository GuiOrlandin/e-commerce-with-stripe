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
