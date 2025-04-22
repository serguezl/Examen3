import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { ProductsController } from './products.controller';

const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 9.99,
    stock: 100,
};

let controller: ProductsController;
let repoMock: any;
let res: Partial<Response>;
let jsonMock: any;
let statusMock: any;
const next: NextFunction = vi.fn();

beforeEach(() => {
    repoMock = {
        read: vi.fn().mockResolvedValue([mockProduct]),
        readById: vi.fn().mockResolvedValue(mockProduct),
        create: vi.fn().mockResolvedValue(mockProduct),
        update: vi.fn().mockResolvedValue(mockProduct),
        delete: vi.fn().mockResolvedValue(mockProduct),
    } as unknown as any;

    controller = new ProductsController(repoMock);

    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    res = {
        json: jsonMock,
        status: statusMock,
    };
});
const fakeError = new Error('Repo error');

describe('ProductsController', () => {
    test('should get all products', async () => {
        await controller.getAll({} as Request, res as Response, next);
        expect(repoMock.read).toHaveBeenCalled();
        expect(jsonMock).toHaveBeenCalledWith({
            results: [mockProduct],
            error: '',
        });
    });
    test('should call next on getAll error', async () => {
        repoMock.read = vi.fn().mockRejectedValue(fakeError);
        controller = new ProductsController(repoMock);

        await controller.getAll({} as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(fakeError);
    });

    test('should get a product by id', async () => {
        const req = { params: { id: '1' } } as unknown as Request;
        await controller.getById(req, res as Response, next);
        expect(repoMock.readById).toHaveBeenCalledWith('1');
        expect(jsonMock).toHaveBeenCalledWith({
            results: [mockProduct],
            error: '',
        });
    });
    test('should call next on getById error', async () => {
        repoMock.readById = vi.fn().mockRejectedValue(fakeError);
        controller = new ProductsController(repoMock);
    });

    test('should create a product', async () => {
        const req = { body: mockProduct } as Request;
        await controller.create(req, res as Response, next);
        expect(repoMock.create).toHaveBeenCalledWith(mockProduct);
        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith({
            results: [mockProduct],
            error: '',
        });
    });
    test('should call next on create error', async () => {
        repoMock.create = vi.fn().mockRejectedValue(fakeError);
        controller = new ProductsController(repoMock);

        const req = { body: mockProduct } as Request;
        await controller.create(req, res as Response, next);
        expect(next).toHaveBeenCalledWith(fakeError);
    });

    test('should update a product', async () => {
        const req = {
            params: { id: '1' },
            body: mockProduct,
        } as unknown as Request;
        await controller.update(req, res as Response, next);
        expect(repoMock.update).toHaveBeenCalledWith('1', mockProduct);
        expect(jsonMock).toHaveBeenCalledWith({
            results: [mockProduct],
            error: '',
        });
    });
    test('should call next on update error', async () => {
        repoMock.update = vi.fn().mockRejectedValue(fakeError);
        controller = new ProductsController(repoMock);

        const req = {
            params: { id: '1' },
            body: mockProduct,
        } as unknown as Request;
        await controller.update(req, res as Response, next);
        expect(next).toHaveBeenCalledWith(fakeError);
    });

    test('should delete a product', async () => {
        const req = { params: { id: '1' } } as unknown as Request;
        await controller.delete(req, res as Response, next);
        expect(repoMock.delete).toHaveBeenCalledWith('1');
        expect(jsonMock).toHaveBeenCalledWith({
            results: [mockProduct],
            error: '',
        });
    });
    test('should call next on delete error', async () => {
        repoMock.delete = vi.fn().mockRejectedValue(fakeError);
        controller = new ProductsController(repoMock);

        const req = { params: { id: '1' } } as unknown as Request;
        await controller.delete(req, res as Response, next);
        expect(next).toHaveBeenCalledWith(fakeError);
    });
});
