import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { OdooService } from './odoo.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ProjectsService } from '../projects/projects.service';

@Controller('odoo')
export class OdooController {
  private readonly logger = new Logger(OdooController.name);

  constructor(
    private readonly odooService: OdooService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get('partners')
  getPartners(@Query('search') search?: string) {
    return this.odooService.getPartners(search);
  }

  @Get('products')
  getProducts() {
    return this.odooService.getProducts();
  }

  @Post('quotations')
  createQuotation(@Body() dto: CreateQuotationDto) {
    return this.odooService.createQuotation(dto);
  }

  @Get('quotations/:id')
  getQuotation(@Param('id', ParseIntPipe) id: number) {
    return this.odooService.getQuotation(id);
  }

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Body() payload: Record<string, unknown>,
    @Headers('x-odoo-webhook-secret') secret: string,
  ) {
    const expected = process.env.ODOO_WEBHOOK_SECRET;
    if (!expected || secret !== expected) throw new UnauthorizedException('Invalid webhook secret');

    this.logger.log(`Webhook received: ${JSON.stringify(payload)}`);

    const data = payload['data'] as Record<string, unknown> | undefined;
    const state = data?.['state'];

    if (state === 'sale') {
      const odooQuoteId = String(payload['id'] ?? data?.['id'] ?? '');
      const odooQuoteName = String(data?.['name'] ?? '');
      const partnerId = data?.['partner_id'];
      const odooPartnerId = Array.isArray(partnerId) ? String(partnerId[0]) : String(partnerId ?? '');

      if (odooQuoteId) {
        await this.projectsService.createFromQuote({ odooQuoteId, odooQuoteName, odooPartnerId });
        this.logger.log(`Project created from quote ${odooQuoteName}`);
      }
    }

    return { ok: true };
  }
}
