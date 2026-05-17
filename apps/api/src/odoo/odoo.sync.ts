import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OdooService } from './odoo.service';
import { ProjectsService } from '../projects/projects.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OdooSyncService {
  private readonly logger = new Logger(OdooSyncService.name);
  private lastSyncAt: Date = new Date(Date.now() - 60_000 * 10); // démarre 10 min en arrière

  constructor(
    private readonly odoo: OdooService,
    private readonly projects: ProjectsService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncConfirmedOrders() {
    this.logger.debug(`Syncing confirmed orders since ${this.lastSyncAt.toISOString()}`);
    const syncFrom = this.lastSyncAt;
    this.lastSyncAt = new Date();

    let orders;
    try {
      orders = await this.odoo.getConfirmedOrdersSince(syncFrom);
    } catch (e) {
      this.logger.error('Failed to fetch orders from Odoo', e);
      return;
    }

    if (orders.length === 0) return;
    this.logger.log(`Found ${orders.length} confirmed order(s) to process`);

    for (const order of orders) {
      const existing = await this.prisma.project.findFirst({
        where: { odooQuoteId: String(order.id) },
      });
      if (existing) continue;

      try {
        const partnerId = Array.isArray(order.partner_id) ? String(order.partner_id[0]) : '';
        const project = await this.projects.createFromQuote({
          odooQuoteId: String(order.id),
          odooQuoteName: order.name,
          odooPartnerId: partnerId,
        });
        this.logger.log(`Created project "${project.title}" from Odoo order ${order.name}`);
      } catch (e) {
        this.logger.error(`Failed to create project for order ${order.name}`, e);
      }
    }
  }
}
