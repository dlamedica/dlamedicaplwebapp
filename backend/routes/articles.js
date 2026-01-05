const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/articles - dodaj nowy artykuł (dla n8n)
router.post('/', async (req, res) => {
  try {
    const { title, content, category, author, image_url, source_urls, word_count } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Brakuje wymaganych pól: title, content, category' });
    }

    const result = await db.query(
      `INSERT INTO articles (title, content, category, author, image_url, source_urls, word_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, content, category, author || 'DlaMedica.pl', image_url, source_urls, word_count]
    );

    res.status(201).json({ success: true, article: result.rows[0] });
  } catch (error) {
    console.error('Błąd dodawania artykułu:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// GET /api/articles - lista artykułów
router.get('/', async (req, res) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM articles WHERE published = true';
    const params = [];
    
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    
    query += ' ORDER BY created_at DESC';
    params.push(limit, offset);
    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await db.query(query, params);
    res.json({ articles: result.rows });
  } catch (error) {
    console.error('Błąd pobierania artykułów:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// GET /api/articles/:id - pojedynczy artykuł
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM articles WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artykuł nie znaleziony' });
    }

    res.json({ article: result.rows[0] });
  } catch (error) {
    console.error('Błąd pobierania artykułu:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;
