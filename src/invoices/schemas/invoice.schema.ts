import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {
  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reference: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop([
    {
      sku: { type: String, required: true },
      qt: { type: Number, required: true },
    },
  ])
  items: { sku: string; qt: number }[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
