import type { OpportunityStatus } from '@prisma/client';

export class CreateOpportunityDto {
  title: string;
  pipelineId: number;
  currentStageId: number;
  contactId?: number;
  organizationId?: number;
  estimatedValue?: number;
  currentStatus?: OpportunityStatus;
}
