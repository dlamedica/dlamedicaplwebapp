/**
 * Routes dla użytkowników - PostgreSQL
 * Własna implementacja z PostgreSQL
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateParams, paramSchemas } = require('../middleware/validation');
const { validateUUID } = require('../middleware/inputValidation');
const { auditLog, AUDIT_OPERATIONS, logDataAccess } = require('../middleware/auditLog');

// GET /api/users/:userId/progress - postęp użytkownika
router.get('/:userId/progress',
  authenticateToken,
  validateUUID('userId'),
  validateParams(paramSchemas.userId),
  auditLog(AUDIT_OPERATIONS.DATA_ACCESS, (req) => ({ dataType: 'user_progress', userId: req.params.userId })),
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Check if user can access this data (self or admin)
      if (req.user.id !== userId) {
        const profile = await db.findOne('auth.users', { id: req.user.id }, 'raw_user_meta_data');
        const role = profile?.raw_user_meta_data?.role;
        
        if (role !== 'admin') {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      // Get user's module progress
      const moduleProgress = await db.query(
        `SELECT up.*, s.name as subject_name, s.category as subject_category
         FROM user_progress up
         LEFT JOIN subjects s ON s.id = up.subject_id
         WHERE up.user_id = $1
         ORDER BY up.last_accessed DESC NULLS LAST`,
        [userId]
      );

      // Get user's quiz attempts
      const quizAttempts = await db.query(
        `SELECT * FROM quiz_attempts
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 10`,
        [userId]
      );

      // Calculate overall statistics
      const progress = moduleProgress.rows || [];
      const totalModules = progress.length;
      const completedModules = progress.filter(m => m.completed).length;
      const totalStudyTime = progress.reduce((sum, m) => sum + (m.time_studied || 0), 0);
      const averageProgress = totalModules > 0 ? 
        progress.reduce((sum, m) => sum + (m.progress || 0), 0) / totalModules : 0;

      // Group by subject category
      const progressByCategory = {
        preclinical: progress.filter(m => m.subject_category === 'preclinical'),
        clinical: progress.filter(m => m.subject_category === 'clinical'),
        specialized: progress.filter(m => m.subject_category === 'specialized')
      };

      res.json({
        userId,
        overview: {
          totalModules,
          completedModules,
          inProgressModules: progress.filter(m => !m.completed && m.progress > 0).length,
          totalStudyTime,
          averageProgress
        },
        moduleProgress: progress.map(module => ({
          id: module.id,
          moduleId: module.module_id,
          subjectId: module.subject_id,
          subjectName: module.subject_name,
          progress: module.progress,
          completed: module.completed,
          timeStudied: module.time_studied,
          startedAt: module.started_at,
          lastAccessed: module.last_accessed
        })),
        progressByCategory: {
          preclinical: {
            modules: progressByCategory.preclinical.length,
            completed: progressByCategory.preclinical.filter(m => m.completed).length,
            averageProgress: progressByCategory.preclinical.length > 0 ?
              progressByCategory.preclinical.reduce((sum, m) => sum + (m.progress || 0), 0) / progressByCategory.preclinical.length : 0
          },
          clinical: {
            modules: progressByCategory.clinical.length,
            completed: progressByCategory.clinical.filter(m => m.completed).length,
            averageProgress: progressByCategory.clinical.length > 0 ?
              progressByCategory.clinical.reduce((sum, m) => sum + (m.progress || 0), 0) / progressByCategory.clinical.length : 0
          },
          specialized: {
            modules: progressByCategory.specialized.length,
            completed: progressByCategory.specialized.filter(m => m.completed).length,
            averageProgress: progressByCategory.specialized.length > 0 ?
              progressByCategory.specialized.reduce((sum, m) => sum + (m.progress || 0), 0) / progressByCategory.specialized.length : 0
          }
        },
        recentQuizzes: (quizAttempts.rows || []).map(quiz => ({
          id: quiz.id,
          quizId: quiz.quiz_id,
          score: quiz.score,
          passed: quiz.passed,
          completedAt: quiz.created_at,
          timeSpent: quiz.time_spent
        })),
        learningPath: null
      });
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ error: 'Failed to fetch user progress' });
    }
  }
);

// GET /api/users/:userId/certificates - certyfikaty użytkownika
router.get('/:userId/certificates',
  authenticateToken,
  validateUUID('userId'),
  validateParams(paramSchemas.userId),
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Check access permissions
      if (req.user.id !== userId) {
        const profile = await db.findOne('auth.users', { id: req.user.id }, 'raw_user_meta_data');
        const role = profile?.raw_user_meta_data?.role;
        
        if (role !== 'admin') {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      // Get user's certificates
      const certificates = await db.query(
        `SELECT uc.*, s.name as subject_name, s.icon as subject_icon
         FROM user_certificates uc
         LEFT JOIN subjects s ON s.id = uc.subject_id
         WHERE uc.user_id = $1
         ORDER BY uc.earned_at DESC`,
        [userId]
      );

      // Get available certificates (modules that can be certified)
      const availableCerts = await db.query(
        `SELECT module_id, subject_id, completed
         FROM user_progress
         WHERE user_id = $1 AND completed = true`,
        [userId]
      );

      res.json({
        certificates: (certificates.rows || []).map(cert => ({
          id: cert.id,
          subjectId: cert.subject_id,
          subjectName: cert.subject_name,
          subjectIcon: cert.subject_icon,
          moduleId: cert.module_id,
          certificateType: cert.certificate_type,
          earnedAt: cert.earned_at,
          verificationCode: cert.verification_code,
          pdfUrl: cert.pdf_url
        })),
        availableForCertification: availableCerts.rows?.length || 0,
        totalCertificates: certificates.rows?.length || 0
      });
    } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).json({ error: 'Failed to fetch certificates' });
    }
  }
);

// GET /api/users/:userId/learning-path - ścieżka nauki użytkownika
router.get('/:userId/learning-path',
  authenticateToken,
  validateUUID('userId'),
  validateParams(paramSchemas.userId),
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Check access permissions
      if (req.user.id !== userId) {
        const profile = await db.findOne('auth.users', { id: req.user.id }, 'raw_user_meta_data');
        const role = profile?.raw_user_meta_data?.role;
        
        if (role !== 'admin') {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      // Get user's profile to determine profession
      const userProfile = await db.query(
        `SELECT u.profession, u.specialization, au.raw_user_meta_data
         FROM public.users u
         JOIN auth.users au ON au.id = u.id
         WHERE u.id = $1`,
        [userId]
      );

      // Get user's current progress
      const progress = await db.query(
        `SELECT module_id, subject_id, completed, progress
         FROM user_progress
         WHERE user_id = $1`,
        [userId]
      );

      const profile = userProfile.rows[0];
      const profession = profile?.profession || 'lekarz';
      const learningPath = generateLearningPath(profession, progress.rows || []);

      res.json({
        userId,
        profession: profile?.profession,
        specialization: profile?.specialization,
        role: profile?.raw_user_meta_data?.role,
        currentStep: learningPath.currentStep,
        completedSteps: learningPath.completedSteps,
        nextSteps: learningPath.nextSteps,
        estimatedCompletion: learningPath.estimatedCompletion,
        path: learningPath.path
      });
    } catch (error) {
      console.error('Error fetching learning path:', error);
      res.status(500).json({ error: 'Failed to fetch learning path' });
    }
  }
);

// Helper function to generate learning path
function generateLearningPath(profession, userProgress = []) {
  const learningPaths = {
    lekarz: [
      { step: 1, category: 'preclinical', subjects: ['1', '2', '3'], name: 'Podstawy medyczne' },
      { step: 2, category: 'preclinical', subjects: ['5', '6', '7'], name: 'Choroby i leczenie' },
      { step: 3, category: 'clinical', subjects: ['11', '12', '13'], name: 'Specjalizacje kliniczne' },
      { step: 4, category: 'specialized', subjects: ['101', '102'], name: 'Umiejętności specjalistyczne' }
    ],
    'pielęgniarka': [
      { step: 1, category: 'preclinical', subjects: ['1', '2'], name: 'Anatomia i fizjologia' },
      { step: 2, category: 'preclinical', subjects: ['5', '7'], name: 'Mikrobiologia i farmakologia' },
      { step: 3, category: 'clinical', subjects: ['11', '12'], name: 'Opieka kardiologiczna i oddechowa' },
      { step: 4, category: 'specialized', subjects: ['101'], name: 'EKG w praktyce pielęgniarskiej' }
    ],
    fizjoterapeuta: [
      { step: 1, category: 'preclinical', subjects: ['1', '2', '4'], name: 'Anatomia, fizjologia, biofizyka' },
      { step: 2, category: 'clinical', subjects: ['12'], name: 'Fizjoterapia oddechowa' },
      { step: 3, category: 'specialized', subjects: ['102'], name: 'USG w fizjoterapii' }
    ]
  };

  const defaultPath = learningPaths.lekarz;
  const path = learningPaths[profession] || defaultPath;

  // Calculate progress
  const completedSubjects = userProgress.filter(p => p.completed).map(p => String(p.subject_id));
  let currentStep = 1;
  let completedSteps = 0;

  for (const step of path) {
    const stepCompleted = step.subjects.every(subjectId => 
      completedSubjects.includes(subjectId)
    );
    
    if (stepCompleted) {
      completedSteps++;
      currentStep = step.step + 1;
    } else {
      break;
    }
  }

  const nextSteps = path.filter(step => step.step >= currentStep).slice(0, 3);
  const totalSteps = path.length;
  const estimatedHoursPerStep = 40;
  const remainingSteps = totalSteps - completedSteps;
  const estimatedCompletion = `${remainingSteps * estimatedHoursPerStep} godzin`;

  return {
    currentStep: Math.min(currentStep, totalSteps),
    completedSteps,
    totalSteps,
    nextSteps,
    estimatedCompletion,
    path
  };
}

// GET /api/users/:userId/profile - pobierz profil użytkownika
router.get('/:userId/profile',
  authenticateToken,
  validateUUID('userId'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Check access permissions
      if (req.user.id !== userId) {
        const profile = await db.findOne('auth.users', { id: req.user.id }, 'raw_user_meta_data');
        const role = profile?.raw_user_meta_data?.role;
        
        if (role !== 'admin') {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      const result = await db.query(
        `SELECT u.*, au.email, au.raw_user_meta_data
         FROM public.users u
         JOIN auth.users au ON au.id = u.id
         WHERE u.id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      const user = result.rows[0];
      res.json({
        ...user,
        role: user.raw_user_meta_data?.role || user.account_type || 'user',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }
);

// PUT /api/users/:userId/profile - zaktualizuj profil użytkownika
router.put('/:userId/profile',
  authenticateToken,
  validateUUID('userId'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Check access permissions - tylko właściciel lub admin
      if (req.user.id !== userId) {
        const profile = await db.findOne('auth.users', { id: req.user.id }, 'raw_user_meta_data');
        const role = profile?.raw_user_meta_data?.role;
        
        if (role !== 'admin') {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      const updateData = { ...req.body };
      
      // Usuń pola, które nie powinny być aktualizowane przez użytkownika
      delete updateData.id;
      delete updateData.email;
      delete updateData.created_at;
      delete updateData.role;

      updateData.updated_at = new Date().toISOString();

      // Buduj zapytanie UPDATE
      const keys = Object.keys(updateData);
      const values = Object.values(updateData);
      const setClause = keys.map((key, i) => `"${key}" = $${i + 1}`).join(', ');

      const result = await db.query(
        `UPDATE public.users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
        [...values, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  }
);

// GET /api/users - lista użytkowników (tylko dla admina)
router.get('/',
  authenticateToken,
  async (req, res) => {
    try {
      // Check if user is admin
      const profile = await db.findOne('auth.users', { id: req.user.id }, 'raw_user_meta_data');
      const role = profile?.raw_user_meta_data?.role;
      
      if (role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const { role: filterRole, search, limit = 50, offset = 0 } = req.query;
      
      let sql = `
        SELECT u.*, au.email, au.raw_user_meta_data, au.created_at as auth_created_at
        FROM public.users u
        JOIN auth.users au ON au.id = u.id
        WHERE au.deleted_at IS NULL
      `;
      const params = [];
      let paramIndex = 1;

      if (filterRole) {
        sql += ` AND (au.raw_user_meta_data->>'role' = $${paramIndex} OR u.account_type = $${paramIndex})`;
        params.push(filterRole);
        paramIndex++;
      }

      if (search) {
        sql += ` AND (u.full_name ILIKE $${paramIndex} OR au.email ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      sql += ` ORDER BY u.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(parseInt(limit), parseInt(offset));

      const result = await db.query(sql, params);

      res.json({
        users: (result.rows || []).map(u => ({
          ...u,
          role: u.raw_user_meta_data?.role || u.account_type || 'user',
        })),
        total: result.rows?.length || 0,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
);

module.exports = router;
