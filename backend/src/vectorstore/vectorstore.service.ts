import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class VectorStoreService {
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService
  ) {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  async createEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data[0].embedding;
  }

  async searchSimilar(projectId: string, query: string, limit = 5) {
    const queryEmbedding = await this.createEmbedding(query);
    
    // Using raw query with pgvector
    const result = await this.prisma.$queryRaw`
      SELECT n.*, n.embedding <-> ${queryEmbedding}::vector AS distance
      FROM "Note" n
      WHERE n."projectId" = ${projectId}
      ORDER BY distance
      LIMIT ${limit};
    `;

    return result;
  }
}
