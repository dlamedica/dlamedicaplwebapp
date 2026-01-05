import { mockEbooks } from '../data/mockEbooks';
import { Ebook } from '../types/ebook';

export const MockShopService = {
    getEbooks: async (): Promise<Ebook[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...mockEbooks]);
            }, 600);
        });
    },

    getEbookById: async (id: string): Promise<Ebook | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockEbooks.find(e => e.id === id));
            }, 300);
        });
    }
};
