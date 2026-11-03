import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ChatMessageBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}

export class ChatV2MessageBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  conversationId?: string;
}
