import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FilterInvoicesDto } from './dto/filter-invoices.dto';
import { Invoice } from './schemas/invoice.schema';
import { LoggingService } from './logging.service';

@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly loggingService: LoggingService,
  ) {}

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      this.loggingService.log('Creating a new invoice');
      return await this.invoicesService.create(createInvoiceDto);
    } catch (error) {
      this.loggingService.error('Failed to create invoice', error.stack);
      throw new HttpException(
        'Failed to create invoice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Invoice> {
    try {
      this.loggingService.log(`Fetching invoice with ID ${id}`);
      return await this.invoicesService.findOne(id);
    } catch (error) {
      this.loggingService.error(
        `Failed to fetch invoice with ID ${id}`,
        error.stack,
      );
      throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  async findAll(
    @Query() filterInvoicesDto: FilterInvoicesDto,
  ): Promise<Invoice[]> {
    try {
      this.loggingService.log('Fetching all invoices with filters');
      return await this.invoicesService.findAll(filterInvoicesDto);
    } catch (error) {
      this.loggingService.error('Failed to fetch invoices', error.stack);
      throw new HttpException(
        'Failed to fetch invoices',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
