import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { ReportCron } from './report.cron';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggingService } from './logging.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    ClientsModule.register([
      {
        name: 'DAILY_REPORT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'daily_sales_report',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [InvoicesService, ReportCron, LoggingService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
