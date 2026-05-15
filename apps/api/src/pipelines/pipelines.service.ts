import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const include = {
  stages: { orderBy: { order: 'asc' as const } },
};

@Injectable()
export class PipelinesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.pipeline.findMany({ include });
  }

  async findOne(id: number) {
    const pipeline = await this.prisma.pipeline.findUnique({ where: { id }, include });
    if (!pipeline) throw new NotFoundException(`Pipeline ${id} not found`);
    return pipeline;
  }
}
