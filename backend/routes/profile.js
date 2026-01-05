/**
 * Routes dla profilu użytkownika - PostgreSQL
 * Własna implementacja z PostgreSQL
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');

// 🔒 Schemat walidacji dla aktualizacji profilu
const accountUpdateSchema = Joi.object({
  firstName: Joi.string().max(100).optional().allow(''),
  lastName: Joi.string().max(100).optional().allow(''),
  fullName: Joi.string().max(200).optional().allow(''),
  profession: Joi.string().max(100).optional().allow('', null),
  city: Joi.string().max(100).optional().allow('', null),
  phone: Joi.string().max(20).pattern(/^[+]?[\d\s-()]*$/).optional().allow('', null)
    .messages({ 'string.pattern.base': 'Nieprawidłowy format numeru telefonu' }),
}).or('firstName', 'lastName', 'fullName', 'profession', 'city', 'phone');

// Middleware walidacji
const validateAccountUpdate = (req, res, next) => {
  const { error, value } = accountUpdateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: 'Błąd walidacji',
      details: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    });
  }
  req.validatedData = value;
  next();
};

// Helper: pobierz profil użytkownika
const getUserProfile = async (userId) => {
  const result = await db.query(
    `SELECT u.*, au.email, au.raw_user_meta_data
     FROM public.users u
     JOIN auth.users au ON au.id = u.id
     WHERE u.id = $1`,
    [userId]
  );
  return result.rows[0] || null;
};

// GET /api/profile/overview
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Profil użytkownika
    const profile = await getUserProfile(userId);

    // Education - postęp nauki
    const progressResult = await db.query(
      `SELECT progress, completed, time_studied
       FROM user_progress
       WHERE user_id = $1`,
      [userId]
    );
    const userProgress = progressResult.rows || [];
    const modulesTotal = userProgress.length;
    const modulesCompleted = userProgress.filter(m => m.completed).length;
    const studyTimeMinutes = userProgress.reduce((sum, m) => sum + (m.time_studied || 0), 0);
    const studyTimeHours = Math.round(studyTimeMinutes / 60);

    // Certyfikaty
    const certsResult = await db.query(
      `SELECT COUNT(*) as count FROM user_certificates WHERE user_id = $1`,
      [userId]
    );
    const certificatesCount = parseInt(certsResult.rows[0]?.count || 0);

    // Streak days (jeśli tabela istnieje)
    let streakDays = 0;
    try {
      const streakResult = await db.query(
        `SELECT streak_days FROM user_points WHERE user_id = $1`,
        [userId]
      );
      streakDays = streakResult.rows[0]?.streak_days || 0;
    } catch (e) {
      // Tabela może nie istnieć
    }

    // Ulubione oferty pracy
    const favoritesResult = await db.query(
      `SELECT COUNT(*) as count FROM user_favorites WHERE user_id = $1`,
      [userId]
    );
    const savedOffersCount = parseInt(favoritesResult.rows[0]?.count || 0);

    // Aplikacje
    const appsResult = await db.query(
      `SELECT COUNT(*) as count FROM applications WHERE applicant_id = $1`,
      [userId]
    );
    const applicationsCount = parseInt(appsResult.rows[0]?.count || 0);

    // Nadchodzące wydarzenia
    const eventsResult = await db.query(
      `SELECT e.id, e.title, e.start_date, e.type
       FROM events e
       JOIN event_participants ep ON ep.event_id = e.id
       WHERE ep.user_id = $1 AND e.start_date >= NOW()
       ORDER BY e.start_date ASC
       LIMIT 5`,
      [userId]
    );
    const upcomingEvents = eventsResult.rows || [];
    const nextEvent = upcomingEvents[0] ? {
      id: upcomingEvents[0].id,
      title: upcomingEvents[0].title,
      date: upcomingEvents[0].start_date,
      type: upcomingEvents[0].type,
    } : null;

    res.json({
      user: {
        email: req.user.email,
        firstName: profile?.full_name?.split(' ')[0] || '',
        lastName: profile?.full_name?.split(' ').slice(1).join(' ') || '',
        fullName: profile?.full_name || '',
        profession: profile?.profession || '',
        avatar_url: profile?.avatar_url || null,
      },
      education: {
        modulesCompleted,
        modulesTotal,
        streakDays,
        studyTimeHours,
        certificatesCount,
      },
      career: {
        savedOffersCount,
        applicationsCount,
        activeAlertsCount: 0,
      },
      events: {
        nextEvent,
        upcomingCount: upcomingEvents.length,
      },
      store: {
        lastOrderNumber: null,
        downloadsAvailable: 0,
      },
      favorites: {
        articles: 0,
        courses: 0,
        products: 0,
        universities: 0,
        jobOffers: savedOffersCount,
        tools: 0,
      },
      tools: {
        pinned: [],
      },
    });
  } catch (error) {
    console.error('Error fetching profile overview:', error);
    res.status(500).json({ error: 'Failed to fetch profile overview' });
  }
});

// GET /api/profile/education
router.get('/education', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const progressResult = await db.query(
      `SELECT up.*, s.name as subject_name
       FROM user_progress up
       LEFT JOIN subjects s ON s.id = up.subject_id
       WHERE up.user_id = $1`,
      [userId]
    );
    const progressRows = progressResult.rows || [];

    const modulesTotal = progressRows.length;
    const modulesCompleted = progressRows.filter(m => m.completed).length;
    const totalStudyMinutes = progressRows.reduce((sum, m) => sum + (m.time_studied || 0), 0);
    const studyTimeHours = Math.round(totalStudyMinutes / 60);
    const averageProgress = modulesTotal > 0
      ? Math.round(progressRows.reduce((sum, m) => sum + (m.progress || 0), 0) / modulesTotal)
      : 0;

    // Certyfikaty
    const certsResult = await db.query(
      `SELECT id, subject_id, module_id, certificate_type, earned_at, verification_code
       FROM user_certificates
       WHERE user_id = $1`,
      [userId]
    );
    const certificates = certsResult.rows || [];

    // Streak
    let streakData = { streak_days: 0, total_points: 0, level: 1 };
    try {
      const streakResult = await db.query(
        `SELECT streak_days, total_points, level FROM user_points WHERE user_id = $1`,
        [userId]
      );
      if (streakResult.rows[0]) streakData = streakResult.rows[0];
    } catch (e) {}

    // Recent activity
    const recentActivity = progressRows
      .sort((a, b) => new Date(b.last_accessed || 0) - new Date(a.last_accessed || 0))
      .slice(0, 5)
      .map(r => ({
        type: r.completed ? 'module_completed' : 'module_progress',
        title: r.subject_name || `Moduł ${r.module_id}`,
        createdAt: r.last_accessed || r.started_at,
      }));

    // Subject progress
    const subjectMap = new Map();
    progressRows.forEach(p => {
      const current = subjectMap.get(p.subject_id) || { completed: 0, total: 0, name: p.subject_name || 'Przedmiot' };
      current.total += 1;
      if (p.completed) current.completed += 1;
      subjectMap.set(p.subject_id, current);
    });
    const subjectsProgress = Array.from(subjectMap.entries()).map(([id, v]) => ({
      subjectId: id,
      name: v.name,
      completedModules: v.completed,
      totalModules: v.total,
      progress: v.total ? Math.round((v.completed / v.total) * 100) : 0,
    }));

    res.json({
      stats: {
        modulesCompleted,
        modulesTotal,
        studyTimeHours,
        streakDays: streakData.streak_days,
        certificatesCount: certificates.length,
        rankPosition: null,
        rankPercentile: null,
        averageProgress,
      },
      subjectsProgress,
      recentActivity,
      achievements: [],
    });
  } catch (error) {
    console.error('Error fetching education data:', error);
    res.status(500).json({ error: 'Failed to fetch education data' });
  }
});

// GET /api/profile/career
router.get('/career', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Aplikacje
    const appsResult = await db.query(
      `SELECT a.id, jo.title as position_title, c.name as employer_name, a.status, a.created_at as applied_at
       FROM applications a
       LEFT JOIN job_offers jo ON jo.id = a.job_offer_id
       LEFT JOIN companies c ON c.id = jo.company_id
       WHERE a.applicant_id = $1
       ORDER BY a.created_at DESC`,
      [userId]
    );

    // Zapisane oferty
    const savedResult = await db.query(
      `SELECT uf.id, uf.job_offer_id, jo.title as position_title, jo.location, uf.created_at
       FROM user_favorites uf
       LEFT JOIN job_offers jo ON jo.id = uf.job_offer_id
       WHERE uf.user_id = $1
       ORDER BY uf.created_at DESC`,
      [userId]
    );

    res.json({
      applications: appsResult.rows || [],
      savedOffers: savedResult.rows || [],
      alerts: [],
    });
  } catch (error) {
    console.error('Error fetching career data:', error);
    res.status(500).json({ error: 'Failed to fetch career data' });
  }
});

// GET /api/profile/events
router.get('/events', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Nadchodzące
    const upcomingResult = await db.query(
      `SELECT ep.id, ep.status, e.id as event_id, e.title, e.start_date, e.type
       FROM event_participants ep
       JOIN events e ON e.id = ep.event_id
       WHERE ep.user_id = $1 AND e.start_date >= NOW()
       ORDER BY e.start_date ASC`,
      [userId]
    );

    // Historia
    const historyResult = await db.query(
      `SELECT ep.id, ep.status, e.id as event_id, e.title, e.start_date, e.type
       FROM event_participants ep
       JOIN events e ON e.id = ep.event_id
       WHERE ep.user_id = $1 AND e.start_date < NOW()
       ORDER BY e.start_date DESC`,
      [userId]
    );

    res.json({
      upcoming: (upcomingResult.rows || []).map(e => ({
        id: e.event_id,
        title: e.title,
        date: e.start_date,
        type: e.type,
        status: e.status,
      })),
      history: (historyResult.rows || []).map(e => ({
        id: e.event_id,
        title: e.title,
        date: e.start_date,
        status: e.status,
      })),
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/profile/store
router.get('/store', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // W przyszłości - zamówienia ze sklepu
    // Na razie zwracamy puste dane

    res.json({
      orders: [],
      downloads: [],
    });
  } catch (error) {
    console.error('Error fetching store data:', error);
    res.status(500).json({ error: 'Failed to fetch store data' });
  }
});

// GET /api/profile/favorites/summary
router.get('/favorites/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT COUNT(*) as count FROM user_favorites WHERE user_id = $1`,
      [userId]
    );

    res.json({
      articles: 0,
      courses: 0,
      products: 0,
      universities: 0,
      jobOffers: parseInt(result.rows[0]?.count || 0),
      tools: 0,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// GET /api/profile/tools
router.get('/tools', authenticateToken, async (req, res) => {
  try {
    res.json({
      pinned: [],
      recent: [],
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

// GET /api/profile/account
router.get('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      firstName: profile.full_name?.split(' ')[0] || '',
      lastName: profile.full_name?.split(' ').slice(1).join(' ') || '',
      fullName: profile.full_name || '',
      email: profile.email,
      profession: profile.profession || '',
      city: profile.city || '',
      phone: profile.phone || '',
      avatar_url: profile.avatar_url || null,
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account data' });
  }
});

// PUT /api/profile/account
router.put('/account', authenticateToken, validateAccountUpdate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, fullName, profession, city, phone } = req.validatedData || {};

    const finalFullName = fullName || `${firstName || ''} ${lastName || ''}`.trim();

    const result = await db.query(
      `UPDATE public.users
       SET full_name = $1, profession = $2, city = $3, phone = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [finalFullName, profession, city, phone, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = result.rows[0];

    res.json({
      firstName: profile.full_name?.split(' ')[0] || '',
      lastName: profile.full_name?.split(' ').slice(1).join(' ') || '',
      fullName: profile.full_name || '',
      email: req.user.email,
      profession: profile.profession || '',
      city: profile.city || '',
      phone: profile.phone || '',
    });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Failed to update account data' });
  }
});

module.exports = router;
