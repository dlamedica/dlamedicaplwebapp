/**
 * Translations Routes
 * Auto-tłumaczenie artykułów na EN/UK
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, validateApiKey } = require('../middleware/auth');

const SUPPORTED_LANGUAGES = ['en', 'uk', 'de']; // English, Ukrainian, German

/**
 * GET /api/translations/article/:id
 * Pobierz tłumaczenia artykułu
 */
router.get('/article/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { lang } = req.query;

    let query = `
      SELECT t.*, a.title as original_title
      FROM article_translations t
      JOIN articles a ON t.article_id = a.id
      WHERE t.article_id = $1
    `;
    const params = [id];

    if (lang) {
      params.push(lang);
      query += ` AND t.language = $${params.length}`;
    }

    const result = await db.query(query, params);

    res.json({
      success: true,
      articleId: id,
      translations: result.rows,
      availableLanguages: result.rows.map(r => r.language)
    });
  } catch (error) {
    console.error('❌ Get translations error:', error);
    res.status(500).json({ error: 'Błąd pobierania tłumaczeń' });
  }
});

/**
 * POST /api/translations/translate
 * Przetłumacz artykuł (wywołuje n8n webhook)
 */
router.post('/translate', authenticateToken, async (req, res) => {
  try {
    const { article_id, target_language } = req.body;

    if (!article_id || !target_language) {
      return res.status(400).json({ error: 'article_id i target_language są wymagane' });
    }

    if (!SUPPORTED_LANGUAGES.includes(target_language)) {
      return res.status(400).json({
        error: `Nieobsługiwany język. Dostępne: ${SUPPORTED_LANGUAGES.join(', ')}`
      });
    }

    // Pobierz oryginalny artykuł
    const articleResult = await db.query(
      'SELECT id, title, content FROM articles WHERE id = $1',
      [article_id]
    );

    if (articleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Artykuł nie znaleziony' });
    }

    const article = articleResult.rows[0];

    // Sprawdź czy tłumaczenie już istnieje
    const existingResult = await db.query(
      'SELECT id FROM article_translations WHERE article_id = $1 AND language = $2',
      [article_id, target_language]
    );

    if (existingResult.rows.length > 0) {
      return res.status(409).json({
        error: 'Tłumaczenie już istnieje',
        translationId: existingResult.rows[0].id
      });
    }

    // Wywołaj n8n webhook do tłumaczenia
    try {
      const n8nWebhookUrl = process.env.N8N_TRANSLATE_WEBHOOK || 'https://dlamedica.app.n8n.cloud/webhook/translate-article';
      await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: article.id,
          title: article.title,
          content: article.content,
          target_language,
          requested_by: req.user.id
        })
      });
    } catch (webhookError) {
      console.error('⚠️ Webhook error:', webhookError.message);
    }

    res.json({
      success: true,
      message: 'Tłumaczenie zostało zlecone. Pojawi się wkrótce.',
      articleId: article_id,
      targetLanguage: target_language
    });
  } catch (error) {
    console.error('❌ Translate error:', error);
    res.status(500).json({ error: 'Błąd zlecania tłumaczenia' });
  }
});

/**
 * POST /api/translations/save
 * Zapisz tłumaczenie (callback z n8n)
 */
router.post('/save', validateApiKey, async (req, res) => {
  try {

    const { article_id, language, title, content, excerpt, quality_score } = req.body;

    if (!article_id || !language || !title || !content) {
      return res.status(400).json({ error: 'Brakuje wymaganych pól' });
    }

    const result = await db.query(`
      INSERT INTO article_translations
      (article_id, language, title, content, excerpt, quality_score)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (article_id, language)
      DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        excerpt = EXCLUDED.excerpt,
        quality_score = EXCLUDED.quality_score,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [article_id, language, title, content, excerpt, quality_score]);

    console.log(`🌍 Tłumaczenie zapisane: artykuł ${article_id} → ${language}`);

    res.json({
      success: true,
      translation: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Save translation error:', error);
    res.status(500).json({ error: 'Błąd zapisywania tłumaczenia' });
  }
});

/**
 * GET /api/translations/languages
 * Lista dostępnych języków
 */
router.get('/languages', (req, res) => {
  res.json({
    success: true,
    languages: [
      { code: 'pl', name: 'Polski', flag: '🇵🇱', native: true },
      { code: 'en', name: 'English', flag: '🇬🇧', native: false },
      { code: 'uk', name: 'Українська', flag: '🇺🇦', native: false },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪', native: false }
    ]
  });
});

/**
 * GET /api/translations/stats
 * Statystyki tłumaczeń
 */
router.get('/stats', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        language,
        COUNT(*) as count,
        AVG(quality_score) as avg_quality,
        COUNT(*) FILTER (WHERE reviewed = true) as reviewed_count
      FROM article_translations
      GROUP BY language
    `);

    const totalArticles = await db.query('SELECT COUNT(*) FROM articles WHERE published = true');

    res.json({
      success: true,
      totalArticles: parseInt(totalArticles.rows[0].count),
      byLanguage: result.rows,
      supportedLanguages: SUPPORTED_LANGUAGES
    });
  } catch (error) {
    console.error('❌ Translation stats error:', error);
    res.status(500).json({ error: 'Błąd pobierania statystyk' });
  }
});

module.exports = router;
