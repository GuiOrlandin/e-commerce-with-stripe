import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatMessageBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}
