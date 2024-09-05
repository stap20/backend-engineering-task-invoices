import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvoicesService } from './invoices.service';
import { FilterInvoicesDto } from './dto/filter-invoices.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportCron {
  constructor(
    private readonly invoicesService: InvoicesService,
    @Inject('DAILY_REPORT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const endOfDay = new Date();
    endOfDay.setHours(12, 0, 0, 0);

    const startOfDay = new Date(endOfDay); // Set it to yesterday's 12 PM
    startOfDay.setDate(endOfDay.getDate() - 1);

    const filter: FilterInvoicesDto = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    const reportDto: ReportDto = await this.invoicesService.getSummary(filter);

    console.log(reportDto);
    // Emit the report via RabbitMQ
    this.client.emit('report.generated', reportDto).subscribe({
      next: () => console.log('Report emitted successfully'),
      error: (err) => console.error('Error emitting report:', err),
    });
  }
}
