/**
 * Scraper Routes
 * Endpoint dla n8n do zapisywania zescrapowanych danych
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// API Key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.N8N_API_KEY || 'dlamedica-n8n-key-2025';

  if (apiKey !== validKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

/**
 * POST /api/scraper/save
 * Zapisz zescrapowane dane z n8n
 */
router.post('/save', validateApiKey, async (req, res) => {
  try {
    const { source, type, title, description, url, date, category, metadata } = req.body;

    if (!source || !type || !title) {
      return res.status(400).json({ error: 'source, type, title required' });
    }

    // Sprawdz czy juz istnieje (deduplikacja)
    const existing = await db.query(
      'SELECT id FROM scraped_content WHERE source = $1 AND title = $2',
      [source, title]
    );

    if (existing.rows.length > 0) {
      return res.json({
        success: true,
        action: 'skipped',
        reason: 'duplicate',
        id: existing.rows[0].id
      });
    }

    // Zapisz nowa tresc
    const result = await db.query(`
      INSERT INTO scraped_content (source, content_type, title, description, url, event_date, category, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [source, type, title, description, url, date, category, JSON.stringify(metadata || {})]);

    console.log(`Scraped: ${type} from ${source} - ${title.substring(0, 50)}`);

    res.json({
      success: true,
      action: 'saved',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Scraper save error:', error);
    res.status(500).json({ error: 'Save failed' });
  }
});

/**
 * POST /api/scraper/bulk
 * Zapisz wiele elementow naraz
 */
router.post('/bulk', validateApiKey, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'items array required' });
    }

    let saved = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of items) {
      try {
        // Sprawdz duplikat
        const existing = await db.query(
          'SELECT id FROM scraped_content WHERE source = $1 AND title = $2',
          [item.source, item.title]
        );

        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        await db.query(`
          INSERT INTO scraped_content (source, content_type, title, description, url, event_date, category, metadata)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [item.source, item.type, item.title, item.description, item.url, item.date, item.category, JSON.stringify(item.metadata || {})]);

        saved++;
      } catch {
        errors++;
      }
    }

    console.log(`Bulk scrape: ${saved} saved, ${skipped} skipped, ${errors} errors`);

    res.json({
      success: true,
      saved,
      skipped,
      errors,
      total: items.length
    });
  } catch (error) {
    console.error('Scraper bulk error:', error);
    res.status(500).json({ error: 'Bulk save failed' });
  }
});

/**
 * GET /api/scraper/content
 * Pobierz zescrapowane dane (Admin)
 */
router.get('/content', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const { source, type, status, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM scraped_content WHERE 1=1';
    const params = [];

    if (source) {
      params.push(source);
      query += ` AND source = $${params.length}`;
    }

    if (type) {
      params.push(type);
      query += ` AND content_type = $${params.length}`;
    }

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += ` ORDER BY scraped_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Pobierz statystyki
    const stats = await db.query(`
      SELECT
        source,
        content_type,
        status,
        COUNT(*) as count
      FROM scraped_content
      GROUP BY source, content_type, status
      ORDER BY source, content_type
    `);

    res.json({
      success: true,
      content: result.rows,
      stats: stats.rows
    });
  } catch (error) {
    console.error('Scraper content error:', error);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

/**
 * PATCH /api/scraper/content/:id/status
 * Zmien status zescrapowanej tresci (approve/reject/publish)
 */
router.patch('/content/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'published'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.query(
      'UPDATE scraped_content SET status = $1, reviewed_at = NOW(), reviewed_by = $2 WHERE id = $3',
      [status, req.user.id, id]
    );

    res.json({ success: true, status });
  } catch (error) {
    console.error('Scraper status error:', error);
    res.status(500).json({ error: 'Status update failed' });
  }
});

/**
 * POST /api/scraper/content/:id/publish
 * Opublikuj zescrapowana tresc jako artykul/wydarzenie
 */
router.post('/content/:id/publish', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const { id } = req.params;
    const { target_type, modifications } = req.body; // target_type: 'article', 'event'

    // Pobierz zescrapowana tresc
    const content = await db.query(
      'SELECT * FROM scraped_content WHERE id = $1',
      [id]
    );

    if (content.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const item = content.rows[0];
    const finalData = { ...item, ...modifications };

    let publishedId;

    if (target_type === 'article') {
      // Publikuj jako artykul
      const result = await db.query(`
        INSERT INTO articles (title, content, excerpt, category, source, source_url, is_published, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, true, $7)
        RETURNING id
      `, [
        finalData.title,
        finalData.description || '',
        finalData.description?.substring(0, 200) || '',
        finalData.category || 'news',
        finalData.source,
        finalData.url,
        req.user.id
      ]);
      publishedId = result.rows[0].id;
    } else if (target_type === 'event') {
      // Publikuj jako wydarzenie
      const result = await db.query(`
        INSERT INTO events (name, description, date, category, source, source_url, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        finalData.title,
        finalData.description || '',
        finalData.event_date,
        finalData.category || 'conference',
        finalData.source,
        finalData.url,
        req.user.id
      ]);
      publishedId = result.rows[0].id;
    } else {
      return res.status(400).json({ error: 'Invalid target_type' });
    }

    // Oznacz jako opublikowane
    await db.query(
      'UPDATE scraped_content SET status = $1, published_as = $2, published_id = $3, reviewed_at = NOW(), reviewed_by = $4 WHERE id = $5',
      ['published', target_type, publishedId, req.user.id, id]
    );

    res.json({
      success: true,
      published_as: target_type,
      published_id: publishedId
    });
  } catch (error) {
    console.error('Scraper publish error:', error);
    res.status(500).json({ error: 'Publish failed' });
  }
});

/**
 * GET /api/scraper/stats
 * Statystyki scrapera (Admin)
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const stats = await db.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE status = 'published') as published,
        COUNT(*) FILTER (WHERE scraped_at > NOW() - INTERVAL '24 hours') as last_24h,
        COUNT(*) FILTER (WHERE scraped_at > NOW() - INTERVAL '7 days') as last_7d
      FROM scraped_content
    `);

    const bySources = await db.query(`
      SELECT source, COUNT(*) as count
      FROM scraped_content
      GROUP BY source
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      stats: stats.rows[0],
      by_source: bySources.rows
    });
  } catch (error) {
    console.error('Scraper stats error:', error);
    res.status(500).json({ error: 'Stats failed' });
  }
});

module.exports = router;
