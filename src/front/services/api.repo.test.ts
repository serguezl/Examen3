import { describe, test, expect, vi } from 'vitest';
import { ApiRepo } from '../services/api.repo';
import { Product } from '../types/product';
import { Category } from '../types/category';
const mockProducts: Product[] = [
    {
        id: 1,
        name: 'Mock product',
        description: 'Mock description',
        category: 'computer',
        price: 1500,
        hasPromo: false,
    },
    {
        id: 2,
        name: 'Mock product 2',
        description: 'Mock description 2',
        category: 'mobile',
        price: 400,
        hasPromo: true,
    },
];

global.fetch = vi.fn();

describe('Test for API methods', () => {
    const apiRepo = new ApiRepo();

    test('should get products', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => mockProducts,
        } as Response);

        const products = await apiRepo.getProducts();
        expect(products).toEqual(mockProducts);
    });

    test('should manage errors', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Server Error',
        } as Response);

        await expect(apiRepo.getProducts()).rejects.toThrow('500 Server Error');
    });

    test('should create a product', async () => {
        const newProduct = {
            name: 'Tablet',
            category: 'mobile' as Category,
            price: 600,
            hasPromo: false,
        };

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({ id: 3, ...newProduct }),
        } as Response);

        const createdProduct = await apiRepo.createProduct(newProduct);
        expect(createdProduct).toEqual({ id: 3, ...newProduct });
    });

    test('should update a product', async () => {
        const updatedProduct = { price: 1000 };

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({ ...mockProducts[0], ...updatedProduct }),
        } as Response);

        const result = await apiRepo.updateProduct(1, updatedProduct);
        expect(result.price).toBe(1000);
    });

    test('should delete a product', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => mockProducts.filter((p) => p.id !== 1),
        } as Response);

        const remainingProducts = await apiRepo.deleteProduct(1);
        expect(remainingProducts).toHaveLength(1);
        expect(remainingProducts[0].id).toBe(2);
    });
});
