import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ description: 'The MongoDB ObjectId of the receiver', example: '60c72b2f9b1d8e001f8e4c1a' })
  @IsMongoId()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({ description: 'The content of the message', example: 'Hello, how are you?' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
