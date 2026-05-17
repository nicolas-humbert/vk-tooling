import type { ProjectStatus } from '@prisma/client';

export class UpdateProjectDto {
  title?: string;
  currentStageId?: number;
  status?: ProjectStatus;
  odooPartnerId?: string;
  odooQuoteId?: string;
  odooQuoteName?: string;
}
