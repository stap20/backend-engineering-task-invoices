import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { InvoicesModule } from '../src/invoices/invoices.module';

let mongod: MongoMemoryServer;

describe('InvoicesController (e2e)', () => {
  let app: INestApplication;
  let createdInvoice: any;
  const invoicesService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  };

  beforeAll(async () => {
    // Create a new in-memory MongoDB instance
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongoUri), InvoicesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    if (mongod) {
      await mongod.stop();
    }
  });

  describe('/POST invoices', () => {
    it('/POST invoices', async () => {
      const mockInvoice = {
        customer: 'Abdelrahman Shendy5',
        amount: 120,
        reference: 'XLM1234',
        items: [
          { sku: 'SKU:0001', qt: 70 },
          { sku: 'SKU:0002', qt: 13 },
        ],
      };

      return request(app.getHttpServer())
        .post('/invoices')
        .send(mockInvoice)
        .expect(201)
        .expect((res) => {
          createdInvoice = res.body;

          expect(res.body).toEqual(
            expect.objectContaining({
              customer: mockInvoice.customer,
              amount: mockInvoice.amount,
              reference: mockInvoice.reference,
              items: expect.arrayContaining([
                expect.objectContaining({ sku: 'SKU:0001', qt: 70 }),
                expect.objectContaining({ sku: 'SKU:0002', qt: 13 }),
              ]),
            }),
          );
        });
    });

    it('should return 500 if create fails', () => {
      invoicesService.create.mockRejectedValue(new Error('Database error'));

      return request(app.getHttpServer())
        .post('/invoices')
        .send({ amount: 120 })
        .expect(500)
        .expect({
          statusCode: 500,
          message: 'Failed to create invoice',
        });
    });
  });

  describe('/GET invoices/:id', () => {
    it('should return an invoice by id', () => {
      const mockInvoice = createdInvoice;

      invoicesService.findOne.mockResolvedValue(mockInvoice);

      return request(app.getHttpServer())
        .get(`/invoices/${createdInvoice._id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockInvoice);
        });
    });

    it('should return 404 if the invoice is not found', () => {
      invoicesService.findOne.mockRejectedValue(new Error('Invoice not found'));

      return request(app.getHttpServer())
        .get('/invoices/999')
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Invoice not found',
        });
    });
  });

  describe('/GET invoices', () => {
    it('should return all invoices', () => {
      const mockInvoices = [createdInvoice];
      invoicesService.findAll.mockResolvedValue(mockInvoices);

      return request(app.getHttpServer())
        .get('/invoices')
        .expect(200)
        .expect(mockInvoices);
    });
  });
});
