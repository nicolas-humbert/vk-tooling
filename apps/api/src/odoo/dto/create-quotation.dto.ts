export class QuotationLineDto {
  productId!: number;
  quantity!: number;
  priceUnit?: number;
  description?: string;
}

export class CreateQuotationDto {
  odooPartnerId!: number;
  lines!: QuotationLineDto[];
  note?: string;
}
