import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VectorStoreService } from '../vectorstore/vectorstore.service';
import { WorkerService } from '../workers/worker.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private vectorStore: VectorStoreService,
    private worker: WorkerService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(userId: string, data: { name: string; description?: string }) {
    return this.prisma.project.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async addNote(projectId: string, content: string) {
    const note = await this.prisma.note.create({
      data: {
        content,
        projectId,
      },
    });

    await this.worker.addVectorizeJob(note.id);
    return note;
  }

  async searchNotes(projectId: string, query: string) {
    return this.vectorStore.searchSimilar(projectId, query);
  }
}
