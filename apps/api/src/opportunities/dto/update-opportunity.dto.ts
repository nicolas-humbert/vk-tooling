import type { OpportunityStatus } from '@prisma/client';

export class UpdateOpportunityDto {
  title?: string;
  estimatedValue?: number;
  currentStatus?: OpportunityStatus;
  contactId?: number;
  organizationId?: number;
}
