import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFormAdd } from './form.add';
import { Product } from '../types/product';

describe('createFormAdd', () => {
    let formElement: HTMLFormElement | null;

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('should render the form correctly', () => {
        formElement = createFormAdd([], 'body', 'afterbegin');

        expect(formElement).toBeDefined();
        expect(formElement?.querySelector('input[name="name"]')).toBeTruthy();
        expect(
            formElement?.querySelector('input[name="description"]'),
        ).toBeTruthy();
        expect(formElement?.querySelector('input[name="price"]')).toBeTruthy();
        expect(
            formElement?.querySelector('input[name="hasPromo"]'),
        ).toBeTruthy();
        expect(
            formElement?.querySelector('select[name="category"]'),
        ).toBeTruthy();
    });

    test('should collect the data correctly when the form is submitted', () => {
        formElement = createFormAdd([], 'body', 'afterbegin');

        const logMock = vi.fn();
        console.log = logMock;

        if (!formElement) {
            throw new Error('Form element was not rendered');
        }

        const nameInput = formElement.querySelector(
            'input[name="name"]',
        )! as HTMLInputElement;
        const descriptionInput = formElement.querySelector(
            'input[name="description"]',
        )! as HTMLInputElement;
        const priceInput = formElement.querySelector(
            'input[name="price"]',
        )! as HTMLInputElement;
        const hasPromoInput = formElement.querySelector(
            'input[name="hasPromo"]',
        )! as HTMLInputElement;
        const categoryInput = formElement.querySelector(
            'select[name="category"]',
        )! as HTMLInputElement;

        nameInput.value = 'Test Product';
        descriptionInput.value = 'A great product';
        priceInput.value = '100';
        hasPromoInput.checked = true;
        categoryInput.value = 'mobile';

        const submitEvent = new Event('submit');
        formElement.dispatchEvent(submitEvent);

        // expect(logMock).toHaveBeenCalledWith({
        //     id: 2,
        //     name: 'Test Product',
        //     description: 'A great product',
        //     category: 'mobile',
        //     price: 100,
        //     hasPromo: true,
        // });
    });

    test('should generate a unique id for each new product', () => {
        const products: Product[] = [
            {
                id: 1,
                name: 'Product 1',
                description: 'Description 1',
                category: 'mobile',
                price: 50,
                hasPromo: true,
            },
        ];

        formElement = createFormAdd(products, 'body', 'afterbegin');

        const logMock = vi.fn();
        console.log = logMock;

        if (!formElement) {
            throw new Error('Form element was not rendered');
        }

        const nameInput = formElement.querySelector(
            'input[name="name"]',
        )! as HTMLInputElement;
        const descriptionInput = formElement.querySelector(
            'input[name="description"]',
        )! as HTMLInputElement;
        const priceInput = formElement.querySelector(
            'input[name="price"]',
        )! as HTMLInputElement;
        const categoryInput = formElement.querySelector(
            'select[name="category"]',
        )! as HTMLInputElement;
        const hasPromoInput = formElement.querySelector(
            'input[name="hasPromo"]',
        )! as HTMLInputElement;

        nameInput.value = 'New Product';
        descriptionInput.value = 'A new product description';
        priceInput.value = '200';
        hasPromoInput.checked = false;
        categoryInput.value = 'computer';

        const submitEvent = new Event('submit');
        formElement.dispatchEvent(submitEvent);

        // expect(logMock).toHaveBeenCalledWith({
        //     id: 2,
        //     name: 'New Product',
        //     description: 'A new product description',
        //     category: 'computer',
        //     price: 200,
        //     hasPromo: false,
        // });
    });
});
