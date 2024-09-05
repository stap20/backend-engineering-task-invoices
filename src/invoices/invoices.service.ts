import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './schemas/invoice.schema';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FilterInvoicesDto } from './dto/filter-invoices.dto';
import { ReportDto } from './dto/report.dto';
import { LoggingService } from './logging.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    private readonly loggingService: LoggingService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    this.loggingService.log('Creating a new invoice');

    try {
      if (!createInvoiceDto) {
        this.loggingService.error(
          'Invalid invoice data provided',
          'Invalid invoice data',
          'create',
        );
        throw new BadRequestException('Invalid invoice data');
      }

      const createdInvoice = await this.invoiceModel.create(createInvoiceDto);
      return createdInvoice;
    } catch (error) {
      this.loggingService.error(
        'Error occurred while creating invoice',
        error.stack,
      );

      throw error;
    }
  }

  async findOne(id: string): Promise<Invoice> {
    this.loggingService.log(`Fetching invoice with ID ${id}`);

    try {
      const invoice = await this.invoiceModel.findById(id);

      if (!invoice) {
        this.loggingService.error(
          `Invoice with ID ${id} not found`,
          `Invoice with ID ${id} not found`,
          'findOne',
        );
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }

      this.loggingService.log(`Invoice with ID ${id} found`, 'findOne');
      return invoice;
    } catch (error) {
      this.loggingService.error(
        `Error occurred while fetching invoice with ID ${id}`,
        error.stack,
        'findOne',
      );
      throw error;
    }
  }

  async findAll(filterInvoicesDto: FilterInvoicesDto): Promise<Invoice[]> {
    this.loggingService.log('Fetching all invoices with filters', 'findAll');

    try {
      const { startDate, endDate } = filterInvoicesDto;

      const query = this.invoiceModel.find();

      if (startDate && endDate) {
        const dateFilter: any = {};
        if (startDate) {
          dateFilter.gte = new Date(startDate);
        }
        if (endDate) {
          dateFilter.lte = new Date(endDate);
        }

        query.where('date').gte(dateFilter.gte).lte(dateFilter.lte);
      }

      return query.exec();
    } catch (error) {
      this.loggingService.error(
        'Error occurred while fetching invoices',
        error.stack,
        'findAll',
      );
      throw error;
    }
  }

  async getSummary(filter: FilterInvoicesDto): Promise<ReportDto> {
    const { startDate, endDate } = filter;

    const results = await this.invoiceModel.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $facet: {
          totalSales: [
            {
              $group: {
                _id: null,
                totalSales: { $sum: '$amount' },
              },
            },
            {
              $project: {
                _id: 0,
                totalSales: 1,
              },
            },
          ],
          itemsSummary: [
            { $unwind: '$items' },
            {
              $group: {
                _id: '$items.sku',
                qt: { $sum: '$items.qt' },
              },
            },
            {
              $project: {
                _id: 0,
                sku: '$_id',
                qt: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          totalSales: { $arrayElemAt: ['$totalSales.totalSales', 0] },
          itemsSummary: '$itemsSummary',
        },
      },
    ]);

    const totalSales = results.length > 0 ? results[0].totalSales : 0;
    const itemsSummary = results.length > 0 ? results[0].itemsSummary : [];

    const summary: ReportDto = { totalSales, itemsSummary };

    return summary;
  }
}
