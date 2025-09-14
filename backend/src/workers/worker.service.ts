import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class WorkerService {
  constructor(
    @InjectQueue('projects') private readonly projectsQueue: Queue,
  ) {}

  async addVectorizeJob(noteId: string) {
    await this.projectsQueue.add('vectorize', { noteId });
  }
}
