/**
 * Events Routes
 * Endpointy do zarządzania wydarzeniami medycznymi
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, validateApiKey } = require('../middleware/auth');

/**
 * GET /api/events - lista wydarzeń
 */
router.get('/', async (req, res) => {
  try {
    const { type, city, upcoming, limit = 20, offset = 0 } = req.query;

    let query = 'SELECT * FROM events WHERE is_active = true';
    const params = [];

    if (type) {
      params.push(type);
      query += ` AND event_type = $${params.length}`;
    }

    if (city) {
      params.push(city);
      query += ` AND city = $${params.length}`;
    }

    if (upcoming === 'true') {
      query += ` AND start_date > NOW()`;
    }

    query += ' ORDER BY start_date ASC';
    params.push(limit, offset);
    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      events: result.rows
    });
  } catch (error) {
    console.error('Błąd pobierania wydarzeń:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

/**
 * GET /api/events/:id - pojedyncze wydarzenie
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wydarzenie nie znalezione' });
    }

    res.json({ event: result.rows[0] });
  } catch (error) {
    console.error('Błąd pobierania wydarzenia:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

/**
 * POST /api/events - dodaj wydarzenie
 */
router.post('/', async (req, res) => {
  try {
    const {
      title, description, event_type, category,
      start_date, end_date, is_online,
      venue_name, venue_address, city,
      max_participants, price, currency,
      registration_url, education_points, status
    } = req.body;

    if (!title || !event_type || !start_date || !end_date) {
      return res.status(400).json({
        error: 'Brakuje wymaganych pól: title, event_type, start_date, end_date'
      });
    }

    const result = await db.query(
      `INSERT INTO events (
        title, description, event_type, category,
        start_date, end_date, is_online,
        venue_name, venue_address, city,
        max_participants, current_participants, price, currency,
        registration_url, education_points, status, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        title, description, event_type, category || event_type,
        start_date, end_date, is_online || false,
        venue_name, venue_address, city,
        max_participants, 0, price || 0, currency || 'PLN',
        registration_url, education_points || 0, status || 'upcoming', true
      ]
    );

    res.status(201).json({ success: true, event: result.rows[0] });
  } catch (error) {
    console.error('Błąd dodawania wydarzenia:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

/**
 * POST /api/events/seed - załaduj przykładowe wydarzenia
 * Endpoint do migracji danych z mockEvents
 */
router.post('/seed', validateApiKey, async (req, res) => {
  try {
    const mockEvents = [
      {
        title: 'Kardiologia 2025: Nowe Horyzonty',
        description: 'Coroczna konferencja poświęcona najnowszym osiągnięciom w kardiologii interwencyjnej i farmakoterapii.',
        event_type: 'conference',
        category: 'kardiologia',
        start_date: '2025-03-15T09:00:00Z',
        end_date: '2025-03-16T17:00:00Z',
        is_online: false,
        venue_name: 'Hotel Marriott',
        city: 'Warszawa',
        max_participants: 500,
        price: 499,
        status: 'upcoming'
      },
      {
        title: 'Webinar: Nowoczesne leczenie cukrzycy',
        description: 'Praktyczne aspekty wdrażania nowych leków przeciwcukrzycowych w praktyce lekarza POZ.',
        event_type: 'webinar',
        category: 'diabetologia',
        start_date: '2025-02-25T18:00:00Z',
        end_date: '2025-02-25T20:00:00Z',
        is_online: true,
        max_participants: 1000,
        price: 0,
        status: 'upcoming'
      },
      {
        title: 'Warsztaty USG jamy brzusznej',
        description: 'Intensywne warsztaty praktyczne z zakresu ultrasonografii jamy brzusznej dla początkujących.',
        event_type: 'workshop',
        category: 'diagnostyka',
        start_date: '2025-04-05T08:00:00Z',
        end_date: '2025-04-06T16:00:00Z',
        is_online: false,
        venue_name: 'Centrum Edukacji Medycznej',
        city: 'Kraków',
        max_participants: 20,
        price: 2500,
        status: 'upcoming'
      },
      {
        title: 'Ogólnopolska Konferencja Internistyczna',
        description: 'Przegląd najciekawszych przypadków klinicznych i wytycznych z ostatniego roku.',
        event_type: 'conference',
        category: 'interna',
        start_date: '2025-05-20T09:00:00Z',
        end_date: '2025-05-21T18:00:00Z',
        is_online: false,
        venue_name: 'Targi Poznańskie',
        city: 'Poznań',
        max_participants: 800,
        price: 350,
        status: 'upcoming'
      },
      {
        title: 'Sympozjum Onkologiczne 2025',
        description: 'Najnowsze osiągnięcia w immunoterapii i terapiach celowanych.',
        event_type: 'conference',
        category: 'onkologia',
        start_date: '2025-06-10T09:00:00Z',
        end_date: '2025-06-12T17:00:00Z',
        is_online: false,
        venue_name: 'Centrum Kongresowe ICE',
        city: 'Kraków',
        max_participants: 1200,
        price: 750,
        status: 'upcoming'
      }
    ];

    let inserted = 0;
    for (const event of mockEvents) {
      try {
        await db.query(
          `INSERT INTO events (
            title, description, event_type, category,
            start_date, end_date, is_online,
            venue_name, city, max_participants,
            current_participants, price, currency, status, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT DO NOTHING`,
          [
            event.title, event.description, event.event_type, event.category,
            event.start_date, event.end_date, event.is_online,
            event.venue_name || null, event.city || null, event.max_participants,
            0, event.price, 'PLN', event.status, true
          ]
        );
        inserted++;
      } catch (e) {
        console.log('Event already exists or error:', e.message);
      }
    }

    res.json({
      success: true,
      message: `Załadowano ${inserted} wydarzeń`,
      total: mockEvents.length
    });
  } catch (error) {
    console.error('Błąd seedowania wydarzeń:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

/**
 * POST /api/events/:id/register - zarejestruj się na wydarzenie
 */
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Sprawdź czy wydarzenie istnieje i ma wolne miejsca
    const event = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);

    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Wydarzenie nie znalezione' });
    }

    const eventData = event.rows[0];

    if (eventData.max_participants && eventData.current_participants >= eventData.max_participants) {
      return res.status(400).json({ error: 'Brak wolnych miejsc' });
    }

    // Sprawdź czy użytkownik już jest zarejestrowany
    const existing = await db.query(
      'SELECT * FROM event_participants WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Już jesteś zarejestrowany na to wydarzenie' });
    }

    // Zarejestruj użytkownika
    await db.query(
      'INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2)',
      [eventId, userId]
    );

    // Zwiększ licznik uczestników
    await db.query(
      'UPDATE events SET current_participants = current_participants + 1 WHERE id = $1',
      [eventId]
    );

    res.json({ success: true, message: 'Zarejestrowano na wydarzenie' });
  } catch (error) {
    console.error('Błąd rejestracji na wydarzenie:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;
