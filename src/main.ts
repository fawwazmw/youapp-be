import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get(ConfigService);
  
  // Connect RabbitMQ Microservice for consumers
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
      queue: 'chat_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  // Enable CORS
  app.enableCors({
    origin: [
      'https://youapp.wardaya.my.id',
      'http://localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Setup Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('YouApp API')
    .setDescription('The YouApp backend API with NestJS, MongoDB, and RabbitMQ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = configService.get<number>('PORT') || 3000;
  
  await app.startAllMicroservices();
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
  console.log(`RabbitMQ Microservice is listening...`);
}
bootstrap();
