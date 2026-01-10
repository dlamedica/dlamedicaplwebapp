/**
 * Admin Routes
 * Endpointy administracyjne - statystyki, zarządzanie
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole, validateApiKey } = require('../middleware/auth');

/**
 * GET /api/admin/stats
 * Pobierz statystyki dashboardu
 */
router.get('/stats', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    // Równoległe zapytania dla wydajności
    const [
      usersResult,
      articlesResult,
      eventsResult,
      feedbackResult,
      subscribersResult,
      recentUsersResult,
      feedbackByTypeResult
    ] = await Promise.all([
      // Liczba użytkowników
      db.query(`SELECT COUNT(*) as count FROM auth.users WHERE deleted_at IS NULL`),

      // Liczba artykułów
      db.query(`SELECT COUNT(*) as count, COUNT(*) FILTER (WHERE published = true) as published FROM articles`),

      // Liczba wydarzeń
      db.query(`SELECT COUNT(*) as count, COUNT(*) FILTER (WHERE date >= NOW()) as upcoming FROM events`),

      // Liczba feedbacku
      db.query(`SELECT COUNT(*) as count, COUNT(*) FILTER (WHERE status = 'new') as new FROM feedback`),

      // Subskrybenci newslettera
      db.query(`SELECT COUNT(*) as count FROM newsletter_subscriptions WHERE subscribed = true`),

      // Nowi użytkownicy (ostatnie 7 dni)
      db.query(`SELECT COUNT(*) as count FROM auth.users WHERE created_at >= NOW() - INTERVAL '7 days' AND deleted_at IS NULL`),

      // Feedback by type
      db.query(`SELECT type, COUNT(*) as count FROM feedback GROUP BY type`)
    ]);

    // Statystyki tygodniowe (trend)
    const weeklyTrend = await db.query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as users
      FROM auth.users
      WHERE created_at >= NOW() - INTERVAL '30 days' AND deleted_at IS NULL
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    res.json({
      success: true,
      stats: {
        users: {
          total: parseInt(usersResult.rows[0]?.count || 0),
          newThisWeek: parseInt(recentUsersResult.rows[0]?.count || 0)
        },
        articles: {
          total: parseInt(articlesResult.rows[0]?.count || 0),
          published: parseInt(articlesResult.rows[0]?.published || 0)
        },
        events: {
          total: parseInt(eventsResult.rows[0]?.count || 0),
          upcoming: parseInt(eventsResult.rows[0]?.upcoming || 0)
        },
        feedback: {
          total: parseInt(feedbackResult.rows[0]?.count || 0),
          new: parseInt(feedbackResult.rows[0]?.new || 0),
          byType: feedbackByTypeResult.rows.reduce((acc, row) => {
            acc[row.type] = parseInt(row.count);
            return acc;
          }, {})
        },
        newsletter: {
          subscribers: parseInt(subscribersResult.rows[0]?.count || 0)
        }
      },
      trends: {
        dailyUsers: weeklyTrend.rows
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Admin stats error:', error);
    res.status(500).json({ error: 'Nie udało się pobrać statystyk' });
  }
});

/**
 * GET /api/admin/stats/quick
 * Szybkie statystyki (bez auth - do internal use)
 * Wymaga API key
 */
router.get('/stats/quick', validateApiKey, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL) as users,
        (SELECT COUNT(*) FROM articles WHERE published = true) as articles,
        (SELECT COUNT(*) FROM events WHERE date >= NOW()) as events,
        (SELECT COUNT(*) FROM feedback WHERE status = 'new') as new_feedback,
        (SELECT COUNT(*) FROM newsletter_subscriptions WHERE subscribed = true) as subscribers
    `);

    res.json({
      success: true,
      ...result.rows[0]
    });

  } catch (error) {
    console.error('❌ Quick stats error:', error);
    res.status(500).json({ error: 'Błąd pobierania statystyk' });
  }
});

/**
 * GET /api/admin/users
 * Lista użytkowników (paginacja)
 */
router.get('/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, email, first_name, last_name, role, profession, created_at, last_login
      FROM auth.users
      WHERE deleted_at IS NULL
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (email ILIKE $${params.length} OR first_name ILIKE $${params.length} OR last_name ILIKE $${params.length})`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const [usersResult, countResult] = await Promise.all([
      db.query(query, params),
      db.query(`SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL`)
    ]);

    res.json({
      success: true,
      users: usersResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / limit)
      }
    });

  } catch (error) {
    console.error('❌ Admin users error:', error);
    res.status(500).json({ error: 'Nie udało się pobrać użytkowników' });
  }
});

/**
 * GET /api/admin/activity
 * Ostatnia aktywność
 */
router.get('/activity', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Połącz różne źródła aktywności
    const activities = await db.query(`
      (
        SELECT 'user_registered' as type, email as detail, created_at, NULL as extra
        FROM auth.users
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC LIMIT 10
      )
      UNION ALL
      (
        SELECT 'feedback_' || type as type, title as detail, created_at, message as extra
        FROM feedback
        ORDER BY created_at DESC LIMIT 10
      )
      UNION ALL
      (
        SELECT 'newsletter_subscribe' as type, email as detail, created_at, NULL as extra
        FROM newsletter_subscriptions
        WHERE subscribed = true
        ORDER BY created_at DESC LIMIT 10
      )
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);

    res.json({
      success: true,
      activities: activities.rows.map(a => ({
        type: a.type,
        detail: a.detail,
        extra: a.extra,
        timestamp: a.created_at
      }))
    });

  } catch (error) {
    console.error('❌ Admin activity error:', error);
    res.status(500).json({ error: 'Nie udało się pobrać aktywności' });
  }
});

module.exports = router;
