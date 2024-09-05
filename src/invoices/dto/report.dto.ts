export class ReportDto {
  totalSales: number;
  itemsSummary: { sku: string; qt: number }[]; // Array of objects with SKU and quantity
}
