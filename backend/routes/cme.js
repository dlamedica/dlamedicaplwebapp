/**
 * CME Routes - Punkty Edukacyjne
 * System śledzenia kształcenia ustawicznego dla medyków
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/cme/requirements
 * Pobierz wymagania punktowe dla zawodów
 */
router.get('/requirements', async (req, res) => {
  try {
    const { profession } = req.query;

    let query = 'SELECT * FROM cme_requirements WHERE 1=1';
    const params = [];

    if (profession) {
      params.push(profession);
      query += ` AND profession = $${params.length}`;
    }

    query += ' ORDER BY profession';
    const result = await db.query(query, params);

    res.json({
      success: true,
      requirements: result.rows
    });
  } catch (error) {
    console.error('❌ CME requirements error:', error);
    res.status(500).json({ error: 'Błąd pobierania wymagań' });
  }
});

/**
 * GET /api/cme/activities
 * Pobierz dostępne aktywności edukacyjne
 */
router.get('/activities', async (req, res) => {
  try {
    const { category, type, specialization, limit = 20, offset = 0 } = req.query;

    let query = `
      SELECT * FROM cme_activities
      WHERE is_active = true
      AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
    `;
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (type) {
      params.push(type);
      query += ` AND activity_type = $${params.length}`;
    }

    if (specialization) {
      params.push(specialization);
      query += ` AND $${params.length} = ANY(specializations)`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      success: true,
      activities: result.rows
    });
  } catch (error) {
    console.error('❌ CME activities error:', error);
    res.status(500).json({ error: 'Błąd pobierania aktywności' });
  }
});

/**
 * GET /api/cme/progress
 * Pobierz postęp użytkownika w punktach CME
 */
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { period_start, period_end } = req.query;

    // Pobierz profesję użytkownika
    const userResult = await db.query(
      'SELECT profession FROM auth.users WHERE id = $1',
      [userId]
    );
    const profession = userResult.rows[0]?.profession || 'lekarz';

    // Pobierz wymagania dla profesji
    const reqResult = await db.query(
      'SELECT * FROM cme_requirements WHERE profession = $1',
      [profession]
    );
    const requirements = reqResult.rows[0] || { points_required: 200, period_years: 4 };

    // Oblicz okres rozliczeniowy
    const periodEnd = period_end ? new Date(period_end) : new Date();
    const periodStart = period_start
      ? new Date(period_start)
      : new Date(periodEnd.getFullYear() - requirements.period_years, periodEnd.getMonth(), periodEnd.getDate());

    // Pobierz zdobyte punkty
    const progressResult = await db.query(`
      SELECT
        COALESCE(SUM(points_earned), 0) as total_points,
        COUNT(*) as activities_count
      FROM user_cme_progress
      WHERE user_id = $1
      AND completed_at BETWEEN $2 AND $3
    `, [userId, periodStart, periodEnd]);

    const totalPoints = parseFloat(progressResult.rows[0]?.total_points || 0);
    const activitiesCount = parseInt(progressResult.rows[0]?.activities_count || 0);

    // Pobierz historię aktywności
    const historyResult = await db.query(`
      SELECT
        p.*,
        a.title,
        a.activity_type,
        a.category,
        a.provider
      FROM user_cme_progress p
      LEFT JOIN cme_activities a ON p.activity_id = a.id
      WHERE p.user_id = $1
      ORDER BY p.completed_at DESC
      LIMIT 20
    `, [userId]);

    // Oblicz procent ukończenia
    const progressPercent = Math.min(100, (totalPoints / requirements.points_required) * 100);

    // Oblicz ile dni pozostało
    const daysRemaining = Math.ceil((periodEnd - new Date()) / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      progress: {
        totalPoints,
        requiredPoints: requirements.points_required,
        progressPercent: Math.round(progressPercent * 10) / 10,
        activitiesCount,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        daysRemaining: Math.max(0, daysRemaining),
        pointsRemaining: Math.max(0, requirements.points_required - totalPoints)
      },
      requirements,
      history: historyResult.rows
    });
  } catch (error) {
    console.error('❌ CME progress error:', error);
    res.status(500).json({ error: 'Błąd pobierania postępu' });
  }
});

/**
 * POST /api/cme/complete
 * Zarejestruj ukończenie aktywności CME
 */
router.post('/complete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { activity_id, points_earned, certificate_url, notes } = req.body;

    // Sprawdź czy aktywność istnieje
    if (activity_id) {
      const activityResult = await db.query(
        'SELECT * FROM cme_activities WHERE id = $1 AND is_active = true',
        [activity_id]
      );

      if (activityResult.rows.length === 0) {
        return res.status(404).json({ error: 'Aktywność nie znaleziona' });
      }
    }

    // Dodaj wpis o ukończeniu
    const result = await db.query(`
      INSERT INTO user_cme_progress
      (user_id, activity_id, points_earned, certificate_url, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [userId, activity_id, points_earned, certificate_url, notes]);

    res.json({
      success: true,
      message: 'Aktywność zarejestrowana',
      entry: result.rows[0]
    });
  } catch (error) {
    console.error('❌ CME complete error:', error);
    res.status(500).json({ error: 'Błąd rejestrowania aktywności' });
  }
});

/**
 * POST /api/cme/activities (Admin)
 * Dodaj nową aktywność CME
 */
router.post('/activities', authenticateToken, async (req, res) => {
  try {
    // Sprawdź czy admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Brak uprawnień' });
    }

    const {
      title, description, activity_type, points, duration_minutes,
      provider, accreditation_number, category, specializations,
      valid_from, valid_until, max_participants
    } = req.body;

    if (!title || !activity_type || !points) {
      return res.status(400).json({ error: 'Tytuł, typ i punkty są wymagane' });
    }

    const result = await db.query(`
      INSERT INTO cme_activities
      (title, description, activity_type, points, duration_minutes, provider,
       accreditation_number, category, specializations, valid_from, valid_until, max_participants)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [title, description, activity_type, points, duration_minutes, provider,
        accreditation_number, category, specializations, valid_from, valid_until, max_participants]);

    res.json({
      success: true,
      activity: result.rows[0]
    });
  } catch (error) {
    console.error('❌ CME create activity error:', error);
    res.status(500).json({ error: 'Błąd tworzenia aktywności' });
  }
});

/**
 * GET /api/cme/certificate/:id
 * Generuj certyfikat ukończenia
 */
router.get('/certificate/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await db.query(`
      SELECT
        p.*,
        a.title,
        a.activity_type,
        a.provider,
        a.accreditation_number,
        u.first_name,
        u.last_name,
        u.profession
      FROM user_cme_progress p
      LEFT JOIN cme_activities a ON p.activity_id = a.id
      LEFT JOIN auth.users u ON p.user_id = u.id
      WHERE p.id = $1 AND p.user_id = $2
    `, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wpis nie znaleziony' });
    }

    const entry = result.rows[0];

    // Generuj dane certyfikatu (w przyszłości można generować PDF)
    res.json({
      success: true,
      certificate: {
        id: entry.id,
        participantName: `${entry.first_name} ${entry.last_name}`,
        profession: entry.profession,
        activityTitle: entry.title,
        activityType: entry.activity_type,
        provider: entry.provider,
        accreditationNumber: entry.accreditation_number,
        pointsEarned: entry.points_earned,
        completedAt: entry.completed_at,
        verified: entry.verified,
        certificateNumber: `CME-${entry.id}-${new Date(entry.completed_at).getFullYear()}`
      }
    });
  } catch (error) {
    console.error('❌ CME certificate error:', error);
    res.status(500).json({ error: 'Błąd generowania certyfikatu' });
  }
});

/**
 * GET /api/cme/leaderboard
 * Ranking użytkowników po punktach CME
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10, profession } = req.query;

    let query = `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.profession,
        COALESCE(SUM(p.points_earned), 0) as total_points,
        COUNT(p.id) as activities_count
      FROM auth.users u
      LEFT JOIN user_cme_progress p ON u.id = p.user_id
      WHERE u.deleted_at IS NULL
    `;
    const params = [];

    if (profession) {
      params.push(profession);
      query += ` AND u.profession = $${params.length}`;
    }

    query += `
      GROUP BY u.id, u.first_name, u.last_name, u.profession
      HAVING COALESCE(SUM(p.points_earned), 0) > 0
      ORDER BY total_points DESC
      LIMIT $${params.length + 1}
    `;
    params.push(limit);

    const result = await db.query(query, params);

    res.json({
      success: true,
      leaderboard: result.rows.map((row, index) => ({
        rank: index + 1,
        userId: row.id,
        name: `${row.first_name} ${row.last_name}`,
        profession: row.profession,
        totalPoints: parseFloat(row.total_points),
        activitiesCount: parseInt(row.activities_count)
      }))
    });
  } catch (error) {
    console.error('❌ CME leaderboard error:', error);
    res.status(500).json({ error: 'Błąd pobierania rankingu' });
  }
});

module.exports = router;
