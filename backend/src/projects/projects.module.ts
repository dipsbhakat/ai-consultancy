import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { VectorStoreModule } from '../vectorstore/vectorstore.module';
import { WorkersModule } from '../workers/workers.module';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PrismaModule,
    VectorStoreModule,
    WorkersModule,
    BullModule.registerQueue({
      name: 'projects',
    }),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
