import { Event } from '../types';
import { mockEvents } from '../data/mockEvents';

export const MockEventsService = {
    getEvents: async (filters?: any): Promise<Event[]> => {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let filtered = [...mockEvents];
        if (filters) {
            if (filters.event_type) filtered = filtered.filter(e => e.event_type === filters.event_type);
            if (filters.is_online !== undefined) filtered = filtered.filter(e => e.is_online === filters.is_online);
        }
        return filtered;
    },

    getUpcomingEvents: async (limit = 10): Promise<{ data: Event[], error: any }> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const sorted = [...mockEvents]
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
            .slice(0, limit);
        return { data: sorted, error: null };
    },

    getEvent: async (id: string): Promise<Event | null> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const event = mockEvents.find(e => e.id === id);
        return event || null;
    }
};

export const getEvents = MockEventsService.getEvents;
export const getUpcomingEvents = MockEventsService.getUpcomingEvents;
export const getEvent = MockEventsService.getEvent;
