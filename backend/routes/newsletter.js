/**
 * Newsletter Routes
 * Endpointy do zarządzania subskrypcjami newslettera
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

/**
 * POST /api/newsletter/subscribe
 * Zapisz się do newslettera
 */
router.post('/subscribe', async (req, res) => {
  try {
    const { email, preferences } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email jest wymagany' });
    }

    // Walidacja email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Nieprawidłowy format email' });
    }

    // Domyślne preferencje
    const defaultPreferences = {
      promotions: true,
      new_products: true,
      price_drops: false,
      weekly_digest: true,
      ...preferences,
    };

    // Sprawdź czy email już istnieje
    const existing = await db.findOne('newsletter_subscriptions', { email: email.toLowerCase() });

    let result;
    if (existing) {
      // Aktualizuj istniejącą subskrypcję
      result = await db.update(
        'newsletter_subscriptions',
        { email: email.toLowerCase() },
        {
          subscribed: true,
          preferences: JSON.stringify(defaultPreferences),
          updated_at: new Date().toISOString(),
        }
      );
    } else {
      // Nowa subskrypcja
      result = await db.insert('newsletter_subscriptions', {
        email: email.toLowerCase(),
        subscribed: true,
        preferences: JSON.stringify(defaultPreferences),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    console.log(`📧 Newsletter: ${existing ? 'Reaktywowano' : 'Nowa'} subskrypcja - ${email}`);

    res.json({
      success: true,
      message: 'Zapisano do newslettera',
      data: result,
    });
  } catch (error) {
    console.error('❌ Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Nie udało się zapisać do newslettera' });
  }
});

/**
 * POST /api/newsletter/unsubscribe
 * Wypisz się z newslettera
 */
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email jest wymagany' });
    }

    const result = await db.update(
      'newsletter_subscriptions',
      { email: email.toLowerCase() },
      {
        subscribed: false,
        updated_at: new Date().toISOString(),
      }
    );

    if (!result) {
      return res.status(404).json({ error: 'Subskrypcja nie znaleziona' });
    }

    console.log(`📧 Newsletter: Wypisano - ${email}`);

    res.json({
      success: true,
      message: 'Wypisano z newslettera',
    });
  } catch (error) {
    console.error('❌ Newsletter unsubscribe error:', error);
    res.status(500).json({ error: 'Nie udało się wypisać z newslettera' });
  }
});

/**
 * GET /api/newsletter/status
 * Sprawdź status subskrypcji (wymaga auth)
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;

    const subscription = await db.findOne('newsletter_subscriptions', { email: userEmail.toLowerCase() });

    res.json({
      subscribed: subscription?.subscribed || false,
      preferences: subscription?.preferences || null,
    });
  } catch (error) {
    console.error('❌ Newsletter status error:', error);
    res.status(500).json({ error: 'Nie udało się pobrać statusu' });
  }
});

/**
 * PUT /api/newsletter/preferences
 * Aktualizuj preferencje (wymaga auth)
 */
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ error: 'Preferencje są wymagane' });
    }

    const result = await db.update(
      'newsletter_subscriptions',
      { email: userEmail.toLowerCase() },
      {
        preferences: JSON.stringify(preferences),
        updated_at: new Date().toISOString(),
      }
    );

    if (!result) {
      return res.status(404).json({ error: 'Subskrypcja nie znaleziona' });
    }

    res.json({
      success: true,
      message: 'Preferencje zaktualizowane',
      data: result,
    });
  } catch (error) {
    console.error('❌ Newsletter preferences error:', error);
    res.status(500).json({ error: 'Nie udało się zaktualizować preferencji' });
  }
});

/**
 * GET /api/newsletter/subscribers
 * Pobierz listę aktywnych subskrybentów (dla n8n)
 * Wymaga klucza API w headerze X-API-Key
 */
router.get('/subscribers', async (req, res) => {
  try {
    // Prosty klucz API dla n8n
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.N8N_API_KEY || 'dlamedica-n8n-key-2025';

    if (apiKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { preference, limit = 1000 } = req.query;

    let query = `
      SELECT email, preferences, created_at
      FROM newsletter_subscriptions
      WHERE subscribed = true
    `;
    const params = [];

    // Filtruj po preferencjach jeśli podano
    if (preference) {
      params.push(preference);
      query += ` AND preferences->>'${preference}' = 'true'`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      subscribers: result.rows.map(row => ({
        email: row.email,
        preferences: row.preferences,
        subscribed_at: row.created_at
      }))
    });
  } catch (error) {
    console.error('❌ Newsletter subscribers error:', error);
    res.status(500).json({ error: 'Nie udało się pobrać subskrybentów' });
  }
});

/**
 * POST /api/newsletter/webhook
 * Webhook dla n8n do raportowania wysłanych emaili
 */
router.post('/webhook', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.N8N_API_KEY || 'dlamedica-n8n-key-2025';

    if (apiKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { event, email, campaign_id, timestamp } = req.body;

    console.log(`📧 Newsletter webhook: ${event} for ${email} (campaign: ${campaign_id})`);

    // Tutaj można zapisać statystyki do bazy
    // await db.insert('newsletter_stats', { ... });

    res.json({ success: true, received: true });
  } catch (error) {
    console.error('❌ Newsletter webhook error:', error);
    res.status(500).json({ error: 'Webhook error' });
  }
});

/**
 * GET /api/newsletter/content
 * Pobierz najnowsze artykuły do newslettera (dla n8n)
 */
router.get('/content', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.N8N_API_KEY || 'dlamedica-n8n-key-2025';

    if (apiKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { limit = 10, category } = req.query;

    let query = `
      SELECT id, title, content, category, author, image_url, created_at
      FROM articles
      WHERE published = true
    `;
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      articles: result.rows.map(row => ({
        id: row.id,
        title: row.title,
        excerpt: row.content ? row.content.substring(0, 200) + '...' : '',
        category: row.category,
        author: row.author,
        image_url: row.image_url,
        published_at: row.created_at
      }))
    });
  } catch (error) {
    console.error('❌ Newsletter content error:', error);
    res.status(500).json({ error: 'Nie udało się pobrać treści' });
  }
});

module.exports = router;
