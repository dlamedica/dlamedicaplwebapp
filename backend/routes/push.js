/**
 * Web Push Notifications Routes
 * Server-side push notifications z VAPID
 */

const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const db = require('../db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Konfiguracja VAPID - klucze z env lub generowanie
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@dlamedica.pl';
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';

// Inicjalizuj web-push jeśli mamy klucze
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  console.log('Web Push configured with VAPID keys');
} else {
  console.warn('VAPID keys not configured - Web Push disabled');
}

/**
 * GET /api/push/vapid-public-key
 * Pobierz klucz publiczny VAPID dla klienta
 */
router.get('/vapid-public-key', (req, res) => {
  if (!VAPID_PUBLIC_KEY) {
    return res.status(503).json({
      error: 'Push notifications not configured',
      configured: false
    });
  }

  res.json({
    publicKey: VAPID_PUBLIC_KEY,
    configured: true
  });
});

/**
 * POST /api/push/subscribe
 * Zapisz subskrypcję push dla użytkownika/przeglądarki
 */
router.post('/subscribe', optionalAuth, async (req, res) => {
  try {
    const { subscription, topics } = req.body;
    const userId = req.user?.id || null;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription object' });
    }

    // Wstaw lub aktualizuj subskrypcję
    const result = await db.query(`
      INSERT INTO push_subscriptions (user_id, endpoint, keys_p256dh, keys_auth, topics, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (endpoint) DO UPDATE SET
        user_id = COALESCE(EXCLUDED.user_id, push_subscriptions.user_id),
        keys_p256dh = EXCLUDED.keys_p256dh,
        keys_auth = EXCLUDED.keys_auth,
        topics = COALESCE(EXCLUDED.topics, push_subscriptions.topics),
        updated_at = NOW()
      RETURNING id
    `, [
      userId,
      subscription.endpoint,
      subscription.keys?.p256dh,
      subscription.keys?.auth,
      topics || ['general'],
      req.headers['user-agent']
    ]);

    console.log(`Push subscription saved: ${result.rows[0].id}`);

    res.json({
      success: true,
      subscriptionId: result.rows[0].id
    });
  } catch (error) {
    console.error('Push subscribe error:', error);
    res.status(500).json({ error: 'Subscription failed' });
  }
});

/**
 * DELETE /api/push/unsubscribe
 * Usuń subskrypcję push
 */
router.delete('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint required' });
    }

    await db.query(
      'DELETE FROM push_subscriptions WHERE endpoint = $1',
      [endpoint]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    res.status(500).json({ error: 'Unsubscribe failed' });
  }
});

/**
 * PUT /api/push/topics
 * Aktualizuj tematy subskrypcji
 */
router.put('/topics', async (req, res) => {
  try {
    const { endpoint, topics } = req.body;

    if (!endpoint || !topics) {
      return res.status(400).json({ error: 'Endpoint and topics required' });
    }

    await db.query(
      'UPDATE push_subscriptions SET topics = $1, updated_at = NOW() WHERE endpoint = $2',
      [topics, endpoint]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Push topics update error:', error);
    res.status(500).json({ error: 'Topics update failed' });
  }
});

/**
 * POST /api/push/send (Admin)
 * Wyślij powiadomienie push do wszystkich lub wybranych subskrybentów
 */
router.post('/send', authenticateToken, async (req, res) => {
  try {
    // Tylko admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const { title, body, icon, url, topic, userIds } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body required' });
    }

    // Pobierz subskrypcje
    let query = 'SELECT * FROM push_subscriptions WHERE 1=1';
    const params = [];

    if (topic) {
      params.push(topic);
      query += ` AND $${params.length} = ANY(topics)`;
    }

    if (userIds && userIds.length > 0) {
      params.push(userIds);
      query += ` AND user_id = ANY($${params.length})`;
    }

    const subscriptions = await db.query(query, params);

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      url: url || '/',
      timestamp: Date.now()
    });

    // Wyślij do wszystkich subskrypcji
    const results = await Promise.allSettled(
      subscriptions.rows.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.keys_p256dh,
            auth: sub.keys_auth
          }
        };

        try {
          await webpush.sendNotification(pushSubscription, payload);
          return { success: true, endpoint: sub.endpoint };
        } catch (error) {
          // Usuń nieważne subskrypcje (410 Gone lub 404)
          if (error.statusCode === 410 || error.statusCode === 404) {
            await db.query('DELETE FROM push_subscriptions WHERE id = $1', [sub.id]);
          }
          return { success: false, endpoint: sub.endpoint, error: error.message };
        }
      })
    );

    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'rejected' || !r.value?.success).length;

    console.log(`Push sent: ${sent} success, ${failed} failed`);

    res.json({
      success: true,
      sent,
      failed,
      total: subscriptions.rows.length
    });
  } catch (error) {
    console.error('Push send error:', error);
    res.status(500).json({ error: 'Send failed' });
  }
});

/**
 * POST /api/push/send-to-user (Admin/System)
 * Wyślij powiadomienie do konkretnego użytkownika
 */
router.post('/send-to-user', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const { userId, title, body, icon, url } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ error: 'userId, title and body required' });
    }

    const subscriptions = await db.query(
      'SELECT * FROM push_subscriptions WHERE user_id = $1',
      [userId]
    );

    if (subscriptions.rows.length === 0) {
      return res.status(404).json({ error: 'User has no push subscriptions' });
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/favicon.ico',
      url: url || '/',
      timestamp: Date.now()
    });

    let sent = 0;
    for (const sub of subscriptions.rows) {
      try {
        await webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth }
        }, payload);
        sent++;
      } catch (error) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          await db.query('DELETE FROM push_subscriptions WHERE id = $1', [sub.id]);
        }
      }
    }

    res.json({ success: true, sent, total: subscriptions.rows.length });
  } catch (error) {
    console.error('Push send-to-user error:', error);
    res.status(500).json({ error: 'Send failed' });
  }
});

/**
 * GET /api/push/stats (Admin)
 * Statystyki subskrypcji push
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const stats = await db.query(`
      SELECT
        COUNT(*) as total_subscriptions,
        COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as registered_users,
        COUNT(*) FILTER (WHERE user_id IS NULL) as anonymous_subscriptions,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as new_this_week
      FROM push_subscriptions
    `);

    const topicStats = await db.query(`
      SELECT unnest(topics) as topic, COUNT(*) as count
      FROM push_subscriptions
      GROUP BY topic
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      stats: stats.rows[0],
      topics: topicStats.rows
    });
  } catch (error) {
    console.error('Push stats error:', error);
    res.status(500).json({ error: 'Stats failed' });
  }
});

module.exports = router;
