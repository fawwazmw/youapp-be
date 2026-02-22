import { Controller, Post, Get, Body, Query, UseGuards, Request, ValidationPipe, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('api')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('sendMessage')
  @ApiOperation({ summary: 'Send a chat message to another user' })
  @ApiResponse({ status: 201, description: 'Message sent successfully.' })
  async sendMessage(@Request() req: any, @Body(ValidationPipe) sendMessageDto: SendMessageDto) {
    return this.chatService.enqueueAndProcessMessage(
      req.user.userId,
      sendMessageDto.receiverId,
      sendMessageDto.content,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('viewMessages')
  @ApiOperation({ summary: 'View messages between current user and a target user' })
  @ApiQuery({ name: 'targetUserId', required: true, description: 'The MongoDB ObjectId of the user you want to chat with' })
  @ApiResponse({ status: 200, description: 'List of messages.' })
  async viewMessages(@Request() req: any, @Query('targetUserId') targetUserId: string) {
    return this.chatService.getMessagesBetweenUsers(req.user.userId, targetUserId);
  }

  // --- RABBITMQ CONSUMER (Microservice Feature) ---
  @MessagePattern('message.created')
  async handleMessageCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    // Acknowledge the message if using manual acks (we set durable: false by default, but good practice)
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    
    this.logger.log(`🔔 NOTIFICATION SERVICE TRIGGERED: New message received!`);
    this.logger.log(`Sender: ${data.senderId} | Receiver: ${data.receiverId}`);
    this.logger.log(`Content: "${data.content}"`);
    
    // In a real microservice, you would send an email, push notification, or SMS here.
    
    // Optional: Acknowledge message if needed
    // channel.ack(originalMsg);
  }
}
