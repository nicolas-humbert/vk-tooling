export class CreateProjectDto {
  title!: string;
  pipelineId!: number;
  currentStageId!: number;
  odooPartnerId?: string;
  odooQuoteId?: string;
  odooQuoteName?: string;
}
