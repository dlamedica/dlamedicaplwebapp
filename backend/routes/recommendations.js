/**
 * AI Recommendations Routes
 * Personalizowane rekomendacje na podstawie zachowania użytkownika
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

/**
 * POST /api/recommendations/track
 * Rejestruj interakcję użytkownika (view, click, like, save)
 */
router.post('/track', optionalAuth, async (req, res) => {
  try {
    const { content_type, content_id, action, metadata } = req.body;
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || req.body.session_id || null;

    if (!content_type || !content_id || !action) {
      return res.status(400).json({ error: 'content_type, content_id, action required' });
    }

    // Walidacja action
    const validActions = ['view', 'click', 'like', 'save', 'share', 'complete', 'search'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: 'Invalid action type' });
    }

    await db.query(`
      INSERT INTO user_interactions (user_id, session_id, content_type, content_id, action, metadata, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [userId, sessionId, content_type, content_id, action, JSON.stringify(metadata || {})]);

    res.json({ success: true });
  } catch (error) {
    console.error('Track interaction error:', error);
    res.status(500).json({ error: 'Tracking failed' });
  }
});

/**
 * GET /api/recommendations/articles
 * Pobierz rekomendowane artykuly dla użytkownika
 */
router.get('/articles', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit) || 6;

    let recommendations = [];

    if (userId) {
      // Dla zalogowanych: rekomendacje na podstawie historii
      const result = await db.query(`
        WITH user_tags AS (
          -- Pobierz tagi z artykułów które użytkownik przeglądał/likował
          SELECT DISTINCT unnest(a.tags) as tag
          FROM user_interactions ui
          JOIN articles a ON ui.content_id = a.id::text AND ui.content_type = 'article'
          WHERE ui.user_id = $1
          AND ui.action IN ('view', 'like', 'save')
          AND ui.created_at > NOW() - INTERVAL '30 days'
          LIMIT 10
        ),
        scored_articles AS (
          SELECT a.*,
            -- Scoring: matching tags + recency + popularity
            (
              SELECT COUNT(*) FROM user_tags ut WHERE ut.tag = ANY(a.tags)
            ) * 10 as tag_score,
            CASE WHEN a.created_at > NOW() - INTERVAL '7 days' THEN 5 ELSE 0 END as recency_score,
            COALESCE(a.view_count, 0) / 100 as popularity_score
          FROM articles a
          WHERE a.is_published = true
          AND a.id NOT IN (
            -- Wyklucz już przeglądane
            SELECT content_id::int FROM user_interactions
            WHERE user_id = $1 AND content_type = 'article' AND action = 'view'
          )
        )
        SELECT id, title, slug, excerpt, image_url, category, tags, created_at,
               (tag_score + recency_score + popularity_score) as score
        FROM scored_articles
        ORDER BY score DESC, created_at DESC
        LIMIT $2
      `, [userId, limit]);

      recommendations = result.rows;
    }

    // Fallback: popularne artykuły (dla niezalogowanych lub gdy brak historii)
    if (recommendations.length < limit) {
      const fallback = await db.query(`
        SELECT id, title, slug, excerpt, image_url, category, tags, created_at
        FROM articles
        WHERE is_published = true
        AND id NOT IN (SELECT UNNEST($1::int[]))
        ORDER BY view_count DESC, created_at DESC
        LIMIT $2
      `, [recommendations.map(r => r.id), limit - recommendations.length]);

      recommendations = [...recommendations, ...fallback.rows];
    }

    res.json({
      success: true,
      recommendations,
      personalized: !!userId
    });
  } catch (error) {
    console.error('Article recommendations error:', error);
    res.status(500).json({ error: 'Recommendations failed' });
  }
});

/**
 * GET /api/recommendations/events
 * Pobierz rekomendowane wydarzenia
 */
router.get('/events', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit) || 4;

    let recommendations = [];

    if (userId) {
      // Rekomendacje na podstawie specjalizacji i historii
      const result = await db.query(`
        WITH user_prefs AS (
          SELECT
            u.profession,
            u.specialization,
            array_agg(DISTINCT e.category) FILTER (WHERE e.category IS NOT NULL) as liked_categories
          FROM auth.users u
          LEFT JOIN user_interactions ui ON ui.user_id = u.id
          LEFT JOIN events e ON ui.content_id = e.id::text AND ui.content_type = 'event'
          WHERE u.id = $1
          GROUP BY u.id, u.profession, u.specialization
        )
        SELECT e.id, e.name, e.slug, e.description, e.date, e.location, e.category,
               e.event_type, e.image_url, e.is_free
        FROM events e, user_prefs up
        WHERE e.date >= CURRENT_DATE
        AND (
          e.category = ANY(up.liked_categories)
          OR e.specialization = up.specialization
          OR e.category IS NULL
        )
        AND e.id NOT IN (
          SELECT content_id::int FROM user_interactions
          WHERE user_id = $1 AND content_type = 'event' AND action = 'view'
        )
        ORDER BY e.date ASC
        LIMIT $2
      `, [userId, limit]);

      recommendations = result.rows;
    }

    // Fallback: nadchodzące wydarzenia
    if (recommendations.length < limit) {
      const fallback = await db.query(`
        SELECT id, name, slug, description, date, location, category, event_type, image_url, is_free
        FROM events
        WHERE date >= CURRENT_DATE
        AND id NOT IN (SELECT UNNEST($1::int[]))
        ORDER BY date ASC
        LIMIT $2
      `, [recommendations.map(r => r.id), limit - recommendations.length]);

      recommendations = [...recommendations, ...fallback.rows];
    }

    res.json({
      success: true,
      recommendations,
      personalized: !!userId
    });
  } catch (error) {
    console.error('Event recommendations error:', error);
    res.status(500).json({ error: 'Recommendations failed' });
  }
});

/**
 * GET /api/recommendations/jobs
 * Pobierz rekomendowane oferty pracy
 */
router.get('/jobs', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit) || 4;

    let recommendations = [];

    if (userId) {
      // Rekomendacje na podstawie profilu
      const result = await db.query(`
        WITH user_profile AS (
          SELECT profession, specialization, city
          FROM auth.users
          WHERE id = $1
        )
        SELECT j.id, j.title, j.slug, j.company_name, j.location, j.salary_min, j.salary_max,
               j.employment_type, j.created_at
        FROM job_offers j, user_profile up
        WHERE j.is_active = true
        AND (j.expires_at IS NULL OR j.expires_at >= CURRENT_DATE)
        AND (
          j.profession = up.profession
          OR j.specialization = up.specialization
          OR j.location ILIKE '%' || up.city || '%'
        )
        ORDER BY
          CASE WHEN j.profession = up.profession THEN 0 ELSE 1 END,
          CASE WHEN j.specialization = up.specialization THEN 0 ELSE 1 END,
          j.created_at DESC
        LIMIT $2
      `, [userId, limit]);

      recommendations = result.rows;
    }

    // Fallback: najnowsze oferty
    if (recommendations.length < limit) {
      const fallback = await db.query(`
        SELECT id, title, slug, company_name, location, salary_min, salary_max,
               employment_type, created_at
        FROM job_offers
        WHERE is_active = true
        AND (expires_at IS NULL OR expires_at >= CURRENT_DATE)
        AND id NOT IN (SELECT UNNEST($1::int[]))
        ORDER BY created_at DESC
        LIMIT $2
      `, [recommendations.map(r => r.id), limit - recommendations.length]);

      recommendations = [...recommendations, ...fallback.rows];
    }

    res.json({
      success: true,
      recommendations,
      personalized: !!userId
    });
  } catch (error) {
    console.error('Job recommendations error:', error);
    res.status(500).json({ error: 'Recommendations failed' });
  }
});

/**
 * GET /api/recommendations/courses
 * Pobierz rekomendowane kursy CME
 */
router.get('/courses', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit) || 4;

    let recommendations = [];

    if (userId) {
      // Rekomendacje na podstawie specjalizacji i brakujących punktów
      const result = await db.query(`
        WITH user_data AS (
          SELECT
            u.profession,
            u.specialization,
            COALESCE(SUM(p.points_earned), 0) as earned_points,
            COALESCE(r.points_required, 200) as required_points
          FROM auth.users u
          LEFT JOIN user_cme_progress p ON p.user_id = u.id
          LEFT JOIN cme_requirements r ON r.profession = u.profession
          WHERE u.id = $1
          GROUP BY u.id, u.profession, u.specialization, r.points_required
        )
        SELECT a.id, a.title, a.description, a.activity_type, a.points,
               a.provider, a.category, a.valid_until
        FROM cme_activities a, user_data ud
        WHERE a.is_active = true
        AND (a.valid_until IS NULL OR a.valid_until >= CURRENT_DATE)
        AND (
          ud.specialization = ANY(a.specializations)
          OR a.specializations IS NULL
          OR array_length(a.specializations, 1) IS NULL
        )
        ORDER BY
          CASE WHEN ud.specialization = ANY(a.specializations) THEN 0 ELSE 1 END,
          a.points DESC
        LIMIT $2
      `, [userId, limit]);

      recommendations = result.rows;
    }

    // Fallback: popularne kursy
    if (recommendations.length < limit) {
      const fallback = await db.query(`
        SELECT id, title, description, activity_type, points, provider, category, valid_until
        FROM cme_activities
        WHERE is_active = true
        AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
        AND id NOT IN (SELECT UNNEST($1::int[]))
        ORDER BY points DESC
        LIMIT $2
      `, [recommendations.map(r => r.id), limit - recommendations.length]);

      recommendations = [...recommendations, ...fallback.rows];
    }

    res.json({
      success: true,
      recommendations,
      personalized: !!userId
    });
  } catch (error) {
    console.error('Course recommendations error:', error);
    res.status(500).json({ error: 'Recommendations failed' });
  }
});

/**
 * GET /api/recommendations/similar/:type/:id
 * Pobierz podobne treści do danego elementu
 */
router.get('/similar/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    let similar = [];

    switch (type) {
      case 'article':
        const articleResult = await db.query(`
          WITH target AS (
            SELECT tags, category FROM articles WHERE id = $1
          )
          SELECT a.id, a.title, a.slug, a.excerpt, a.image_url, a.category, a.created_at,
                 (SELECT COUNT(*) FROM target t WHERE t.tags && a.tags) as tag_match
          FROM articles a, target t
          WHERE a.id != $1
          AND a.is_published = true
          AND (a.category = t.category OR a.tags && t.tags)
          ORDER BY tag_match DESC, a.created_at DESC
          LIMIT $2
        `, [id, limit]);
        similar = articleResult.rows;
        break;

      case 'event':
        const eventResult = await db.query(`
          WITH target AS (
            SELECT category, event_type FROM events WHERE id = $1
          )
          SELECT e.id, e.name, e.slug, e.date, e.location, e.category, e.event_type
          FROM events e, target t
          WHERE e.id != $1
          AND e.date >= CURRENT_DATE
          AND (e.category = t.category OR e.event_type = t.event_type)
          ORDER BY e.date ASC
          LIMIT $2
        `, [id, limit]);
        similar = eventResult.rows;
        break;

      case 'job':
        const jobResult = await db.query(`
          WITH target AS (
            SELECT profession, specialization, location FROM job_offers WHERE id = $1
          )
          SELECT j.id, j.title, j.slug, j.company_name, j.location, j.salary_min, j.salary_max
          FROM job_offers j, target t
          WHERE j.id != $1
          AND j.is_active = true
          AND (j.profession = t.profession OR j.specialization = t.specialization)
          ORDER BY j.created_at DESC
          LIMIT $2
        `, [id, limit]);
        similar = jobResult.rows;
        break;
    }

    res.json({
      success: true,
      similar,
      type
    });
  } catch (error) {
    console.error('Similar content error:', error);
    res.status(500).json({ error: 'Similar content failed' });
  }
});

/**
 * GET /api/recommendations/trending
 * Pobierz popularne/trendy treści
 */
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const timeframe = req.query.timeframe || '7d';

    const interval = timeframe === '24h' ? '1 day' :
                     timeframe === '7d' ? '7 days' :
                     timeframe === '30d' ? '30 days' : '7 days';

    // Artykuły trending
    const articles = await db.query(`
      SELECT a.id, a.title, a.slug, a.excerpt, a.image_url, 'article' as type,
             COUNT(ui.id) as interaction_count
      FROM articles a
      LEFT JOIN user_interactions ui ON ui.content_id = a.id::text
        AND ui.content_type = 'article'
        AND ui.created_at > NOW() - INTERVAL '${interval}'
      WHERE a.is_published = true
      GROUP BY a.id
      ORDER BY interaction_count DESC, a.created_at DESC
      LIMIT $1
    `, [Math.ceil(limit / 2)]);

    // Wydarzenia trending
    const events = await db.query(`
      SELECT e.id, e.name as title, e.slug, e.description as excerpt, e.image_url, 'event' as type,
             COUNT(ui.id) as interaction_count
      FROM events e
      LEFT JOIN user_interactions ui ON ui.content_id = e.id::text
        AND ui.content_type = 'event'
        AND ui.created_at > NOW() - INTERVAL '${interval}'
      WHERE e.date >= CURRENT_DATE
      GROUP BY e.id
      ORDER BY interaction_count DESC, e.date ASC
      LIMIT $1
    `, [Math.ceil(limit / 2)]);

    res.json({
      success: true,
      trending: [...articles.rows, ...events.rows]
        .sort((a, b) => b.interaction_count - a.interaction_count)
        .slice(0, limit)
    });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: 'Trending failed' });
  }
});

module.exports = router;
