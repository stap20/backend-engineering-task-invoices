// create-invoice.dto.ts
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemDto {
  @IsString()
  @IsNotEmpty()
  readonly sku: string;

  @IsNumber()
  @IsNotEmpty()
  readonly qt: number;
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  readonly customer: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsString()
  @IsNotEmpty()
  readonly reference: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto) // Transform plain objects to ItemDto instances
  @IsNotEmpty({ each: true }) // Ensure each item is not empty
  readonly items: ItemDto[];
}
