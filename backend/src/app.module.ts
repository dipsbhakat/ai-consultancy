import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { VectorStoreModule } from './vectorstore/vectorstore.module';
import { WorkersModule } from './workers/workers.module';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: process.env.REDIS_URL,
    }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    VectorStoreModule,
    WorkersModule,
  ],
})
export class AppModule {}
