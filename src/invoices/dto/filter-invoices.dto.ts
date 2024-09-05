import { IsOptional, IsDateString } from 'class-validator';

export class FilterInvoicesDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
