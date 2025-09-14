import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Here we can setup any worker-specific configuration
  // For example, we can start listening to queues
  
  await app.init();
}

bootstrap();
