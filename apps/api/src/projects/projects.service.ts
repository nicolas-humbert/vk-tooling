import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';

const include = { pipeline: true, currentStage: true };

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({ include, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id }, include });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  create(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto, include });
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.findOne(id);
    return this.prisma.project.update({ where: { id }, data: dto, include });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.project.delete({ where: { id } });
  }

  async createFromQuote(params: { odooQuoteId: string; odooQuoteName: string; odooPartnerId: string }) {
    // Find first stage of the video production pipeline by default
    const pipeline = await this.prisma.pipeline.findFirst({
      where: { name: { contains: 'Vidéo' } },
      include: { stages: { orderBy: { order: 'asc' }, take: 1 } },
    });
    if (!pipeline || pipeline.stages.length === 0) {
      throw new NotFoundException('Production Vidéo pipeline not found or has no stages');
    }
    return this.prisma.project.create({
      data: {
        title: params.odooQuoteName || `Projet ${params.odooQuoteId}`,
        pipelineId: pipeline.id,
        currentStageId: pipeline.stages[0].id,
        odooQuoteId: params.odooQuoteId,
        odooQuoteName: params.odooQuoteName,
        odooPartnerId: params.odooPartnerId,
      },
      include,
    });
  }
}
