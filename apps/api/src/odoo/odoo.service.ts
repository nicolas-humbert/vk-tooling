import { Injectable, OnModuleInit, Logger, UnauthorizedException } from '@nestjs/common';
import type { CreateQuotationDto } from './dto/create-quotation.dto';

export interface OdooPartner {
  id: number;
  name: string;
  email: string | false;
  phone: string | false;
}

export interface OdooProduct {
  id: number;
  name: string;
  list_price: number;
  categ_id: [number, string];
}

export interface OdooQuotation {
  id: number;
  name: string;
  state: string;
  partner_id: [number, string];
  amount_untaxed: number;
  amount_total: number;
}

@Injectable()
export class OdooService implements OnModuleInit {
  private readonly logger = new Logger(OdooService.name);
  private readonly url = process.env.ODOO_URL!;
  private readonly db = process.env.ODOO_DB!;
  private readonly login = process.env.ODOO_LOGIN!;
  private readonly password = process.env.ODOO_PASSWORD!;
  private sessionCookie = '';

  async onModuleInit() {
    await this.authenticate();
  }

  private async authenticate() {
    const res = await fetch(`${this.url}/web/session/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'call',
        params: { db: this.db, login: this.login, password: this.password },
      }),
    });
    const cookie = res.headers.get('set-cookie');
    if (!cookie) throw new UnauthorizedException('Odoo auth failed: no session cookie');
    this.sessionCookie = cookie.split(';')[0];
    const json = await res.json() as { result?: { uid: number } };
    if (!json.result?.uid) throw new UnauthorizedException('Odoo auth failed: invalid credentials');
    this.logger.log(`Authenticated to Odoo (uid=${json.result.uid})`);
  }

  private async _rpc<T>(model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}): Promise<T> {
    const res = await fetch(`${this.url}/web/dataset/call_kw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: this.sessionCookie },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'call', params: { model, method, args, kwargs } }),
    });
    const json = await res.json() as { result: T; error?: { message: string } };
    if (json.error) throw new Error(`Odoo RPC [${model}.${method}]: ${json.error.message}`);
    return json.result;
  }

  private async rpc<T>(model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}): Promise<T> {
    try {
      return await this._rpc<T>(model, method, args, kwargs);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('session') || msg.includes('auth') || msg.includes('Access Denied')) {
        this.logger.warn('Session expired, re-authenticating...');
        await this.authenticate();
        return this._rpc<T>(model, method, args, kwargs);
      }
      throw e;
    }
  }

  async getPartners(search?: string): Promise<OdooPartner[]> {
    const domain: unknown[] = [['customer_rank', '>', 0], ['active', '=', true]];
    if (search) domain.push(['name', 'ilike', search]);
    return this.rpc<OdooPartner[]>('res.partner', 'search_read', [domain], {
      fields: ['id', 'name', 'email', 'phone'],
      limit: 50,
      order: 'name asc',
    });
  }

  async getProducts(): Promise<OdooProduct[]> {
    return this.rpc<OdooProduct[]>('product.template', 'search_read',
      [[['type', '=', 'service'], ['active', '=', true]]],
      { fields: ['id', 'name', 'list_price', 'categ_id'], order: 'categ_id asc, name asc' },
    );
  }

  async createQuotation(dto: CreateQuotationDto): Promise<{ id: number; name: string }> {
    const orderId = await this.rpc<number>('sale.order', 'create', [{
      partner_id: dto.odooPartnerId,
      note: dto.note ?? '',
    }]);

    for (const line of dto.lines) {
      await this.rpc('sale.order.line', 'create', [{
        order_id: orderId,
        product_id: line.productId,
        product_uom_qty: line.quantity,
        ...(line.priceUnit !== undefined ? { price_unit: line.priceUnit } : {}),
        ...(line.description ? { name: line.description } : {}),
      }]);
    }

    const [order] = await this.rpc<{ id: number; name: string }[]>('sale.order', 'read', [[orderId]], {
      fields: ['id', 'name'],
    });
    this.logger.log(`Created Odoo quotation ${order.name} (id=${order.id})`);
    return order;
  }

  async getQuotation(id: number): Promise<OdooQuotation> {
    const [order] = await this.rpc<OdooQuotation[]>('sale.order', 'read', [[id]], {
      fields: ['id', 'name', 'state', 'partner_id', 'amount_untaxed', 'amount_total'],
    });
    return order;
  }

  async getConfirmedOrdersSince(since: Date): Promise<OdooQuotation[]> {
    const sinceStr = since.toISOString().replace('T', ' ').substring(0, 19);
    return this.rpc<OdooQuotation[]>('sale.order', 'search_read',
      [[['state', '=', 'sale'], ['write_date', '>=', sinceStr]]],
      { fields: ['id', 'name', 'state', 'partner_id', 'amount_untaxed', 'amount_total'], order: 'write_date asc' },
    );
  }
}
