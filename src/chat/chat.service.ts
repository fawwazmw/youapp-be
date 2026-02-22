import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { MessageQueue } from './data-structures/message-queue';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  
  // Using a custom Data Structure (Queue) to process messages before saving
  private messageQueue: MessageQueue<{ senderId: string; receiverId: string; content: string }> = new MessageQueue();

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
  ) {}

  // Process sending a message using the Queue
  async enqueueAndProcessMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    // 1. Enqueue the incoming message into our custom data structure
    this.messageQueue.enqueue({ senderId, receiverId, content });
    this.logger.log(`Message enqueued. Queue size: ${this.messageQueue.size()}`);

    // 2. Dequeue and save to MongoDB
    const queuedMessage = this.messageQueue.dequeue();
    
    if (queuedMessage) {
      const message = new this.messageModel({
        senderId: queuedMessage.senderId,
        receiverId: queuedMessage.receiverId,
        content: queuedMessage.content,
      });
      
      const savedMessage = await message.save();
      
      // 3. Publish event to RabbitMQ for notification service
      this.client.emit('message.created', savedMessage);
      
      return savedMessage;
    }
    
    throw new Error('Failed to process message from queue');
  }

  // Get messages between two users (for REST API)
  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();
  }
}
