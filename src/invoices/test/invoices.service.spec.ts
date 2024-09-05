import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from '../invoices.service';
import { LoggingService } from '../logging.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Invoice } from '../schemas/invoice.schema';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { FilterInvoicesDto } from '../dto/filter-invoices.dto';

import {
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let loggingService: LoggingService;
  let invoiceModel: Model<Invoice>;

  const mockInvoiceModel = {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    aggregate: jest.fn(),
  };

  const mockLoggingService = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceModel,
        },
        {
          provide: LoggingService,
          useValue: mockLoggingService,
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    loggingService = module.get<LoggingService>(LoggingService);
    invoiceModel = module.get<Model<Invoice>>(getModelToken(Invoice.name));
  });

  describe('create', () => {
    it('should successfully create an invoice', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        customer: 'Abdelrahman Shendy5',
        amount: 120,
        reference: 'XLM1234',
        items: [
          {
            sku: 'SKU:0001',
            qt: 70,
          },
          {
            sku: 'SKU:0002',
            qt: 13,
          },
        ],
      };

      const createdInvoice = new Invoice(); // Mock your Invoice schema object
      mockInvoiceModel.create.mockResolvedValue(createdInvoice);

      const result = await service.create(createInvoiceDto);
      expect(result).toBe(createdInvoice);
      expect(mockInvoiceModel.create).toHaveBeenCalledWith(createInvoiceDto);
    });

    it('should throw BadRequestException if no data provided', async () => {
      const createInvoiceDto: CreateInvoiceDto = null; // Invalid data

      await expect(service.create(createInvoiceDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockLoggingService.error).toHaveBeenCalledWith(
        'Invalid invoice data provided',
        'Invalid invoice data',
        'create',
      );
    });

    it('should throw InternalServerErrorException on service error', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        customer: 'Abdelrahman Shendy5',
        amount: 120,
        reference: 'XLM1234',
        items: [
          {
            sku: 'SKU:0001',
            qt: 70,
          },
          {
            sku: 'SKU:0002',
            qt: 13,
          },
        ],
      };
      mockInvoiceModel.create.mockRejectedValue(
        new InternalServerErrorException('Service error'),
      );

      await expect(service.create(createInvoiceDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLoggingService.error).toHaveBeenCalledWith(
        'Error occurred while creating invoice',
        expect.any(String),
      );
    });
  });

  describe('findOne', () => {
    it('should return an invoice if found', async () => {
      const invoiceId = 'id';
      const invoice = new Invoice(); // Mock your Invoice schema object
      mockInvoiceModel.findById.mockResolvedValue(invoice);

      const result = await service.findOne(invoiceId);
      expect(result).toBe(invoice);
      expect(mockInvoiceModel.findById).toHaveBeenCalledWith(invoiceId);
    });

    it('should throw NotFoundException if invoice not found', async () => {
      const invoiceId = 'invalidId';
      mockInvoiceModel.findById.mockResolvedValue(null);

      await expect(service.findOne(invoiceId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLoggingService.error).toHaveBeenCalledWith(
        `Invoice with ID ${invoiceId} not found`,
        `Invoice with ID ${invoiceId} not found`,
        'findOne',
      );
    });

    it('should throw InternalServerErrorException on service error', async () => {
      const invoiceId = 'validId';
      mockInvoiceModel.findById.mockRejectedValue(
        new InternalServerErrorException('Service error'),
      );

      await expect(service.findOne(invoiceId)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLoggingService.error).toHaveBeenCalledWith(
        `Error occurred while fetching invoice with ID ${invoiceId}`,
        expect.any(String),
        'findOne',
      );
    });
  });

  describe('findAll', () => {
    it('should fetch all invoices without filters', async () => {
      const invoices = [{ id: '1' }, { id: '2' }];
      mockInvoiceModel.exec.mockResolvedValue(invoices);

      const result = await service.findAll({});

      expect(result).toEqual(invoices);
      expect(mockInvoiceModel.find).toHaveBeenCalled();
      expect(mockInvoiceModel.where).not.toHaveBeenCalled();
      expect(mockLoggingService.log).toHaveBeenCalledWith(
        'Fetching all invoices with filters',
        'findAll',
      );
    });

    it('should fetch invoices with date filters', async () => {
      const invoices = [{ id: '1' }, { id: '2' }];
      const filterInvoicesDto = {
        startDate: '2024-09-01',
        endDate: '2024-09-15',
      };

      mockInvoiceModel.exec.mockResolvedValue(invoices);

      const result = await service.findAll(filterInvoicesDto);

      expect(result).toEqual(invoices);
      expect(mockInvoiceModel.find).toHaveBeenCalled();
      expect(mockInvoiceModel.where).toHaveBeenCalledWith('date');
      expect(mockInvoiceModel.gte).toHaveBeenCalledWith(
        new Date(filterInvoicesDto.startDate),
      );
      expect(mockInvoiceModel.lte).toHaveBeenCalledWith(
        new Date(filterInvoicesDto.endDate),
      );
      expect(mockLoggingService.log).toHaveBeenCalledWith(
        'Fetching all invoices with filters',
        'findAll',
      );
    });
  });
});
