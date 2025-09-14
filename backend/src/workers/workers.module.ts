import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'projects',
    }),
  ],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkersModule {}
