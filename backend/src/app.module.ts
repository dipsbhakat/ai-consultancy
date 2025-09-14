import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { VectorStoreModule } from './vectorstore/vectorstore.module';
import { WorkersModule } from './workers/workers.module';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        redis: config.redisUrl,
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    VectorStoreModule,
    WorkersModule,
  ],
})
export class AppModule {}
