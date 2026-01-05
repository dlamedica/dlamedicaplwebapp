const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');
const { validate, schemas } = require('../middleware/validation');

// Sample content data
const contentData = {
  'topic-1-1': {
    id: 'content-1-1',
    topicId: 'topic-1-1',
    title: 'Budowa serca - wprowadzenie',
    type: 'text',
    content: `
      <h2>Anatomia serca</h2>
      <p>Serce (cor) jest głównym organem układu krążenia. Znajduje się w śródpiersiu środkowym, w worku osierdziowym (pericardium).</p>
      
      <h3>Budowa makroskopowa</h3>
      <ul>
        <li><strong>Prawdzierdy:</strong> prawy przedsionek i prawa komora</li>
        <li><strong>Lewostronne:</strong> lewy przedsionek i lewa komora</li>
        <li><strong>Przegrody:</strong> międzyprzedsionkowa i międzykomorowa</li>
      </ul>
      
      <h3>Warstwy ściany serca</h3>
      <ol>
        <li><strong>Wsierdzie (endocardium):</strong> wewnętrzna warstwa wyściełająca komory</li>
        <li><strong>Mięsień sercowy (myocardium):</strong> warstwa mięśniowa</li>
        <li><strong>Nasierdzie (epicardium):</strong> zewnętrzna warstwa</li>
      </ol>
    `,
    duration: 15,
    difficulty: 'beginner',
    interactiveElements: [
      {
        type: 'image_hotspot',
        imageUrl: '/images/heart-anatomy.jpg',
        hotspots: [
          { x: 120, y: 80, label: 'Prawy przedsionek', description: 'Odbiera krew żylną z ciała' },
          { x: 180, y: 120, label: 'Prawa komora', description: 'Pompuje krew do płuc' },
          { x: 220, y: 80, label: 'Lewy przedsionek', description: 'Odbiera krew tętniczą z płuc' },
          { x: 160, y: 120, label: 'Lewa komora', description: 'Pompuje krew do ciała' }
        ]
      }
    ]
  },
  'cardio-topic-1': {
    id: 'content-cardio-1',
    topicId: 'cardio-topic-1',
    title: 'Cykl sercowy - fazy skurczu i rozkurczu',
    type: 'interactive',
    content: `
      <h2>Cykl sercowy</h2>
      <p>Cykl sercowy składa się z dwóch głównych faz: skurczu (systole) i rozkurczu (diastole).</p>
      
      <h3>Faza skurczu (Systole)</h3>
      <ul>
        <li>Skurcz przedsionków (0.1s)</li>
        <li>Skurcz komór (0.3s)</li>
        <li>Wyrzut krwi z komór</li>
      </ul>
      
      <h3>Faza rozkurczu (Diastole)</h3>
      <ul>
        <li>Rozkurcz komór (0.5s)</li>
        <li>Napełnianie komór krwią</li>
        <li>Przygotowanie do kolejnego skurczu</li>
      </ul>
    `,
    duration: 20,
    difficulty: 'intermediate',
    simulation: {
      type: 'cardiac_cycle',
      parameters: {
        heartRate: 70,
        strokeVolume: 70,
        showPressure: true,
        showVolume: true
      }
    }
  },
  'ekg-topic-1': {
    id: 'content-ekg-1',
    topicId: 'ekg-topic-1',
    title: 'Potencjały czynnościowe w sercu',
    type: 'multimedia',
    content: `
      <h2>Przewodzenie elektryczne w sercu</h2>
      <p>Aktywność elektryczna serca jest podstawą zapisu EKG.</p>
      
      <h3>Węzeł zatokowy</h3>
      <p>Naturalny rozrusznik serca, generuje impulsy z częstością 60-100/min.</p>
      
      <h3>Drogi przewodzenia</h3>
      <ul>
        <li>Węzeł przedsionkowo-komorowy (AV)</li>
        <li>Pęczek Hisa</li>
        <li>Odnogi pęczka</li>
        <li>Włókna Purkinjego</li>
      </ul>
    `,
    duration: 25,
    difficulty: 'intermediate',
    mediaElements: [
      {
        type: 'video',
        url: '/videos/cardiac-conduction.mp4',
        duration: 180,
        subtitles: true
      },
      {
        type: 'animation',
        url: '/animations/action-potential.swf',
        interactive: true
      }
    ]
  }
};

// GET /api/content/:id - szczegółowy materiał
router.get('/:id', 
  authenticateToken,
  async (req, res) => {
    try {
      const contentId = req.params.id;
      const content = contentData[contentId];
      
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }

      // Get user's viewing history for this content
      const viewHistoryResult = await db.query(
        'SELECT * FROM content_views WHERE user_id = $1 AND content_id = $2 ORDER BY viewed_at DESC LIMIT 1',
        [req.user.id, contentId]
      );
      const viewHistory = viewHistoryResult.rows;

      // Get user's notes for this content
      const userNotesResult = await db.query(
        'SELECT * FROM user_notes WHERE user_id = $1 AND content_id = $2 ORDER BY created_at DESC',
        [req.user.id, contentId]
      );
      const userNotes = userNotesResult.rows;

      res.json({
        ...content,
        userHistory: viewHistory?.[0] || null,
        userNotes: userNotes || [],
        lastViewed: viewHistory?.[0]?.viewed_at || null,
        viewCount: viewHistory?.length || 0
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({ error: 'Failed to fetch content' });
    }
  }
);

// POST /api/content/:id/view - oznaczenie jako przeczytane
router.post('/:id/view',
  authenticateToken,
  validate(schemas.markContentViewed),
  async (req, res) => {
    try {
      const contentId = req.params.id;
      const { timeSpent, completed } = req.validatedData;
      
      // Record the view
      const viewResult = await db.query(
        `INSERT INTO content_views (user_id, content_id, time_spent, completed, viewed_at)
         VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [req.user.id, contentId, timeSpent || 0, completed || false]
      );
      const view = viewResult.rows[0];

      if (!view) {
        return res.status(500).json({ error: 'Failed to record content view' });
      }

      // Update topic progress if content is completed
      if (completed) {
        const content = contentData[contentId];
        if (content) {
          await db.query(
            `INSERT INTO user_topic_progress (user_id, topic_id, completed, time_spent, last_viewed)
             VALUES ($1, $2, true, $3, NOW())
             ON CONFLICT (user_id, topic_id)
             DO UPDATE SET completed = true, time_spent = $3, last_viewed = NOW()`,
            [req.user.id, content.topicId, timeSpent || 0]
          );
        }
      }

      res.json({
        message: 'Content view recorded successfully',
        view: {
          id: view.id,
          timeSpent: view.time_spent,
          completed: view.completed,
          viewedAt: view.viewed_at
        }
      });
    } catch (error) {
      console.error('Error recording content view:', error);
      res.status(500).json({ error: 'Failed to record content view' });
    }
  }
);

// POST /api/content/:id/notes - dodawanie notatki
router.post('/:id/notes',
  authenticateToken,
  validate(schemas.userNote),
  async (req, res) => {
    try {
      const contentId = req.params.id;
      const { note, highlight, tags } = req.validatedData;
      
      const userNoteResult = await db.query(
        `INSERT INTO user_notes (user_id, content_id, note, highlight, tags, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [req.user.id, contentId, note, highlight, tags || []]
      );
      const userNote = userNoteResult.rows[0];

      if (!userNote) {
        return res.status(500).json({ error: 'Failed to create note' });
      }

      res.status(201).json({
        message: 'Note created successfully',
        note: userNote
      });
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Failed to create note' });
    }
  }
);

// GET /api/content/:id/notes - pobieranie notatek
router.get('/:id/notes',
  authenticateToken,
  async (req, res) => {
    try {
      const contentId = req.params.id;
      
      const notesResult = await db.query(
        'SELECT * FROM user_notes WHERE user_id = $1 AND content_id = $2 ORDER BY created_at DESC',
        [req.user.id, contentId]
      );
      const notes = notesResult.rows;

      res.json({
        contentId,
        notes: notes || [],
        total: (notes || []).length
      });
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  }
);

// GET /api/content/search - wyszukiwanie treści
router.get('/search',
  authenticateToken,
  require('../middleware/searchSanitizer').sanitizeSearch, // 🔒 Sanityzacja zapytań wyszukiwania
  async (req, res) => {
    try {
      const { q: query, type, difficulty } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      // 🔒 BEZPIECZEŃSTWO: Użyj sanityzowanego query (już przefiltrowane przez middleware)
      // Simple search implementation (in production use full-text search)
      const allContent = Object.values(contentData);
      const results = allContent.filter(content => {
        // 🔒 BEZPIECZEŃSTWO: Użyj toLowerCase() tylko dla porównań, nie modyfikuj oryginalnych danych
        const queryLower = query.toLowerCase();
        const matchesQuery = content.title.toLowerCase().includes(queryLower) ||
                           content.content.toLowerCase().includes(queryLower);
        const matchesType = !type || content.type === type;
        const matchesDifficulty = !difficulty || content.difficulty === difficulty;
        
        return matchesQuery && matchesType && matchesDifficulty;
      });

      res.json({
        query,
        filters: { type, difficulty },
        results,
        total: results.length
      });
    } catch (error) {
      console.error('Error searching content:', error);
      res.status(500).json({ error: 'Failed to search content' });
    }
  }
);

module.exports = router;
module.exports.contentData = contentData;