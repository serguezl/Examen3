import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createHeader } from './header';

vi.mock('../../src/components/base', () => ({
    render: (selector: string, position: InsertPosition, template: string) => {
        const container = document.querySelector(selector) || document.body;
        container.insertAdjacentHTML(position, template);
        return container.firstElementChild;
    },
}));

describe('createHeader', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('should render header into body', () => {
        createHeader();

        const header = document.querySelector('header');
        const logo = document.querySelector('img.header__logo');
        const title = document.querySelector('h1.header__title');
        const addButton = document.querySelector('button.header__nav-button');

        expect(header).not.toBeNull();
        expect(logo).not.toBeNull();
        expect(logo?.getAttribute('alt')).toBe('Logo de la empresa');
        expect(title).not.toBeNull();
        expect(title?.textContent).toBe('Productos');
        expect(addButton).not.toBeNull();
        expect(addButton?.textContent).toBe('Add');
    });

    test('should insert header into a custom selector', () => {
        const customDiv = document.createElement('div');
        customDiv.id = 'app';
        document.body.appendChild(customDiv);

        const element = createHeader('#app');
        expect(customDiv.contains(element)).toBe(true);
    });

    test('should return an HTMLElement', () => {
        const result = createHeader();
        expect(result).toBeInstanceOf(HTMLElement);
    });
});
