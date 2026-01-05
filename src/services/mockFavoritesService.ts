
import { Favorite, JobOffer } from '../types';
import { mockJobOffers } from './mockJobService';

/**
 * Mock Favorites Service
 */

let mockFavorites: any[] = [
    {
        id: 'fav_001',
        user_id: 'user_123',
        job_offer_id: '1', // Linked to mockJobOffers[0]
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        // Fake joined data
        job_offers: mockJobOffers[0]
    },
    {
        id: 'fav_002',
        user_id: 'user_123',
        job_offer_id: '2', // Linked to mockJobOffers[1]
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        job_offers: mockJobOffers[1]
    }
];

export const MockFavoritesService = {
    sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

    addToFavorites: async (userId: string, jobOfferId: string): Promise<Favorite> => {
        await MockFavoritesService.sleep(400);

        // Check if already exists
        const exists = mockFavorites.find(f => f.user_id === userId && f.job_offer_id === jobOfferId);
        if (exists) return exists;

        const offer = mockJobOffers.find(j => j.id === jobOfferId);

        const newFav = {
            id: `fav_${Math.random().toString(36).substring(7)}`,
            user_id: userId,
            job_offer_id: jobOfferId,
            created_at: new Date().toISOString(),
            job_offers: offer // Join for display
        };

        mockFavorites.unshift(newFav);
        return newFav as unknown as Favorite;
    },

    removeFromFavorites: async (userId: string, jobOfferId: string): Promise<void> => {
        await MockFavoritesService.sleep(300);
        mockFavorites = mockFavorites.filter(f => !(f.user_id === userId && f.job_offer_id === jobOfferId));
    },

    getUserFavorites: async (userId: string): Promise<any[]> => {
        await MockFavoritesService.sleep(500);
        // Return all for simplicity or filter
        return mockFavorites;
    },

    isFavorite: async (userId: string, jobOfferId: string): Promise<boolean> => {
        await MockFavoritesService.sleep(200);
        return mockFavorites.some(f => f.job_offer_id === jobOfferId);
    }
};
