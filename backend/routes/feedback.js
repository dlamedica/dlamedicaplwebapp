/**
 * Feedback Routes
 * Endpointy do zbierania błędów i sugestii użytkowników
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * POST /api/feedback/error
 * Zgłoś błąd z aplikacji
 */
router.post('/error', async (req, res) => {
  try {
    const { title, message, page_url, browser_info, error_stack, user_email } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Opis błędu jest wymagany' });
    }

    const result = await db.query(`
      INSERT INTO feedback (type, title, message, page_url, browser_info, error_stack, user_email, priority)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at
    `, ['error', title || 'Błąd aplikacji', message, page_url, browser_info, error_stack, user_email, 'high']);

    console.log(`🐛 Nowy błąd zgłoszony: ${title || 'Błąd'} (ID: ${result.rows[0].id})`);

    // Wywołaj webhook n8n do powiadomienia
    notifyN8n('error', result.rows[0].id, { title, message, page_url });

    res.json({
      success: true,
      message: 'Błąd został zgłoszony',
      feedback_id: result.rows[0].id
    });
  } catch (error) {
    console.error('❌ Feedback error:', error);
    res.status(500).json({ error: 'Nie udało się zgłosić błędu' });
  }
});

/**
 * POST /api/feedback/suggestion
 * Zgłoś pomysł/sugestię
 */
router.post('/suggestion', async (req, res) => {
  try {
    const { title, message, user_email, category } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Opis sugestii jest wymagany' });
    }

    const result = await db.query(`
      INSERT INTO feedback (type, title, message, user_email, browser_info)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at
    `, ['suggestion', title || 'Sugestia użytkownika', message, user_email, category || 'general']);

    console.log(`💡 Nowa sugestia: ${title || 'Sugestia'} (ID: ${result.rows[0].id})`);

    // Wywołaj webhook n8n do powiadomienia
    notifyN8n('suggestion', result.rows[0].id, { title, message });

    res.json({
      success: true,
      message: 'Sugestia została zapisana',
      feedback_id: result.rows[0].id
    });
  } catch (error) {
    console.error('❌ Feedback suggestion error:', error);
    res.status(500).json({ error: 'Nie udało się zapisać sugestii' });
  }
});

/**
 * POST /api/feedback/contact
 * Formularz kontaktowy
 */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!message || !email) {
      return res.status(400).json({ error: 'Email i wiadomość są wymagane' });
    }

    const result = await db.query(`
      INSERT INTO feedback (type, title, message, user_email, browser_info)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at
    `, ['contact', subject || `Kontakt od ${name || email}`, message, email, name]);

    console.log(`📬 Nowa wiadomość kontaktowa od: ${email} (ID: ${result.rows[0].id})`);

    // Wywołaj webhook n8n
    notifyN8n('contact', result.rows[0].id, { name, email, subject, message });

    res.json({
      success: true,
      message: 'Wiadomość została wysłana'
    });
  } catch (error) {
    console.error('❌ Feedback contact error:', error);
    res.status(500).json({ error: 'Nie udało się wysłać wiadomości' });
  }
});

/**
 * GET /api/feedback/list
 * Pobierz listę feedbacku (dla admina, wymaga API key)
 */
router.get('/list', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.N8N_API_KEY || 'dlamedica-n8n-key-2025';

    if (apiKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { type, status, limit = 50 } = req.query;

    let query = 'SELECT * FROM feedback WHERE 1=1';
    const params = [];

    if (type) {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';
    params.push(limit);
    query += ` LIMIT $${params.length}`;

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      feedback: result.rows
    });
  } catch (error) {
    console.error('❌ Feedback list error:', error);
    res.status(500).json({ error: 'Nie udało się pobrać listy' });
  }
});

/**
 * PATCH /api/feedback/:id/status
 * Zmień status feedbacku (dla admina)
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.N8N_API_KEY || 'dlamedica-n8n-key-2025';

    if (apiKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const validStatuses = ['new', 'in_progress', 'resolved', 'wont_fix', 'duplicate'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status musi być jednym z: ${validStatuses.join(', ')}` });
    }

    const result = await db.query(`
      UPDATE feedback
      SET status = $1, admin_notes = COALESCE($2, admin_notes), updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [status, admin_notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback nie znaleziony' });
    }

    res.json({
      success: true,
      feedback: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Feedback status update error:', error);
    res.status(500).json({ error: 'Nie udało się zaktualizować statusu' });
  }
});

/**
 * Funkcja pomocnicza - powiadom n8n o nowym feedbacku
 */
async function notifyN8n(type, feedbackId, data) {
  try {
    const n8nWebhookUrl = process.env.N8N_FEEDBACK_WEBHOOK || 'https://dlamedica.app.n8n.cloud/webhook/feedback';

    await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        feedback_id: feedbackId,
        timestamp: new Date().toISOString(),
        ...data
      })
    });
  } catch (error) {
    // Nie blokuj głównego flow jeśli webhook nie działa
    console.log('⚠️ n8n webhook notification failed:', error.message);
  }
}

module.exports = router;
