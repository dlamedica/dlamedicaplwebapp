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

module.exports = router;
