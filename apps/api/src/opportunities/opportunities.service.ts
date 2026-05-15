import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { MoveStageDto } from './dto/move-stage.dto';

const listInclude = {
  currentStage: true,
  contact: true,
  organization: true,
  pipeline: true,
};

const detailInclude = {
  ...listInclude,
  stageTransitions: {
    include: { fromStage: true, toStage: true, changedBy: { select: { id: true, name: true, email: true } } },
    orderBy: { changedAt: 'asc' as const },
  },
};

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.opportunity.findMany({ include: listInclude });
  }

  async findOne(id: number) {
    const opp = await this.prisma.opportunity.findUnique({ where: { id }, include: detailInclude });
    if (!opp) throw new NotFoundException(`Opportunity ${id} not found`);
    return opp;
  }

  async create(dto: CreateOpportunityDto, userId: number) {
    const stage = await this.prisma.pipelineStage.findUnique({ where: { id: dto.currentStageId } });
    if (!stage || stage.pipelineId !== dto.pipelineId) {
      throw new BadRequestException('Stage does not belong to the specified pipeline');
    }

    return this.prisma.$transaction(async (tx) => {
      const opp = await tx.opportunity.create({
        data: {
          title: dto.title,
          pipelineId: dto.pipelineId,
          currentStageId: dto.currentStageId,
          contactId: dto.contactId,
          organizationId: dto.organizationId,
          estimatedValue: dto.estimatedValue,
          currentStatus: dto.currentStatus,
        },
      });

      await tx.opportunityStageTransition.create({
        data: {
          opportunityId: opp.id,
          fromStageId: null,
          toStageId: dto.currentStageId,
          changedById: userId,
        },
      });

      return tx.opportunity.findUnique({ where: { id: opp.id }, include: detailInclude });
    });
  }

  async update(id: number, dto: UpdateOpportunityDto) {
    await this.findOne(id);
    return this.prisma.opportunity.update({ where: { id }, data: dto, include: listInclude });
  }

  async moveStage(id: number, dto: MoveStageDto, userId: number) {
    const opp = await this.findOne(id);

    const toStage = await this.prisma.pipelineStage.findUnique({ where: { id: dto.toStageId } });
    if (!toStage || toStage.pipelineId !== opp.pipelineId) {
      throw new BadRequestException('Target stage does not belong to the opportunity pipeline');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.opportunityStageTransition.create({
        data: {
          opportunityId: id,
          fromStageId: opp.currentStageId,
          toStageId: dto.toStageId,
          changedById: userId,
          reason: dto.reason,
        },
      });

      return tx.opportunity.update({
        where: { id },
        data: {
          currentStageId: dto.toStageId,
          ...(toStage.isFinal ? { closedAt: new Date(), currentStatus: 'COMPLETED' } : {}),
        },
        include: detailInclude,
      });
    });
  }
}
