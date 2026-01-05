const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');
const { validate, validateParams, schemas, paramSchemas } = require('../middleware/validation');

// Sample module data
const modulesData = {
  '1-module-1': {
    id: '1-module-1',
    subjectId: '1',
    name: 'Anatomia Układu Krążenia',
    description: 'Kompleksowe omówienie budowy serca, naczyń krwionośnych i krążenia krwi',
    estimatedHours: 8,
    difficulty: 'medium',
    prerequisites: [],
    learningObjectives: [
      'Zrozumienie budowy anatomicznej serca',
      'Znajomość układu naczyń krwionośnych',
      'Mechanizmy krążenia krwi',
      'Anatomia topograficzna układu krążenia'
    ],
    topics: [
      {
        id: 'topic-1-1',
        name: 'Budowa serca',
        description: 'Anatomia makroskopowa i mikroskopowa serca',
        estimatedMinutes: 60,
        type: 'theory'
      },
      {
        id: 'topic-1-2',
        name: 'Naczynia wieńcowe',
        description: 'Układ naczyń zaopatrujących serce',
        estimatedMinutes: 45,
        type: 'theory'
      },
      {
        id: 'topic-1-3',
        name: 'Przewodzenie serca',
        description: 'System przewodzący impulsy elektryczne',
        estimatedMinutes: 40,
        type: 'theory'
      },
      {
        id: 'topic-1-4',
        name: 'Interaktywny atlas serca',
        description: 'Anatomia serca w 3D z opisami',
        estimatedMinutes: 30,
        type: 'interactive'
      }
    ],
    resources: [
      {
        id: 'resource-1',
        name: 'Atlas anatomii serca.pdf',
        type: 'pdf',
        url: '/resources/heart-anatomy-atlas.pdf',
        size: '15.2 MB'
      },
      {
        id: 'resource-2',
        name: 'Video: Czynność serca',
        type: 'video',
        url: '/resources/heart-function-video.mp4',
        duration: '12:30'
      }
    ],
    quiz: {
      id: 'quiz-1-1',
      name: 'Test z anatomii układu krążenia',
      questions: 15,
      timeLimit: 20,
      passingScore: 70
    }
  },
  '11-module-1': {
    id: '11-module-1',
    subjectId: '11',
    name: 'Anatomia i Fizjologia Serca',
    description: 'Podstawy kardiologii - budowa i czynność serca',
    estimatedHours: 6,
    difficulty: 'medium',
    prerequisites: ['1-module-1'],
    learningObjectives: [
      'Znajomość anatomii czynnościowej serca',
      'Zrozumienie cyklu sercowego',
      'Mechanizmy regulacji czynności serca',
      'Korelacja anatomii z fizjologią'
    ],
    topics: [
      {
        id: 'cardio-topic-1',
        name: 'Cykl sercowy',
        description: 'Skurcz i rozkurcz, fazy cyklu sercowego',
        estimatedMinutes: 45,
        type: 'theory'
      },
      {
        id: 'cardio-topic-2',
        name: 'Hemodynamika',
        description: 'Przepływ krwi przez serce i naczynia',
        estimatedMinutes: 50,
        type: 'theory'
      },
      {
        id: 'cardio-topic-3',
        name: 'Regulacja czynności serca',
        description: 'Kontrola nerwowa i hormonalna',
        estimatedMinutes: 40,
        type: 'theory'
      },
      {
        id: 'cardio-topic-4',
        name: 'Symulator hemodynamiki',
        description: 'Interaktywny model przepływu krwi',
        estimatedMinutes: 35,
        type: 'simulation'
      }
    ],
    caseStudies: [
      {
        id: 'case-1',
        title: 'Pacjent z bólem w klatce piersiowej',
        description: 'Mężczyzna, 55 lat, ból w klatce piersiowej po wysiłku',
        difficulty: 'beginner',
        estimatedMinutes: 20
      }
    ]
  },
  '101-module-1': {
    id: '101-module-1',
    subjectId: '101',
    name: 'Podstawy EKG',
    description: 'Wprowadzenie do elektrokardiografii - fizjologia i technika',
    estimatedHours: 4,
    difficulty: 'medium',
    prerequisites: ['11-module-1'],
    learningObjectives: [
      'Zrozumienie podstaw fizjologii przewodzenia',
      'Znajomość odprowadzeń EKG',
      'Technika wykonywania badania EKG',
      'Podstawowa interpretacja zapisu'
    ],
    topics: [
      {
        id: 'ekg-topic-1',
        name: 'Fizjologia przewodzenia elektrycznego',
        description: 'Potencjały czynnościowe w sercu',
        estimatedMinutes: 40,
        type: 'theory'
      },
      {
        id: 'ekg-topic-2',
        name: 'Odprowadzenia EKG',
        description: '12-odprowadzeniowe EKG, umiejscowienie elektrod',
        estimatedMinutes: 35,
        type: 'practical'
      },
      {
        id: 'ekg-topic-3',
        name: 'Normalne EKG',
        description: 'Parametry prawidłowego zapisu EKG',
        estimatedMinutes: 45,
        type: 'theory'
      },
      {
        id: 'ekg-topic-4',
        name: 'Interpretacja podstawowa',
        description: 'Algorytm czytania EKG krok po kroku',
        estimatedMinutes: 50,
        type: 'practical'
      }
    ],
    practicalExercises: [
      {
        id: 'exercise-1',
        name: 'Rozpoznawanie rytmu zatokowego',
        description: '20 przykładów EKG do interpretacji',
        type: 'pattern_recognition',
        difficulty: 'beginner'
      },
      {
        id: 'exercise-2',
        name: 'Pomiary na EKG',
        description: 'Ćwiczenia pomiarów odstępów i amplitud',
        type: 'measurement',
        difficulty: 'beginner'
      }
    ]
  }
};

// GET /api/modules/:id - szczegóły modułu
router.get('/:id', 
  authenticateToken,
  async (req, res) => {
    try {
      const moduleId = req.params.id;
      const moduleData = modulesData[moduleId];
      
      if (!moduleData) {
        return res.status(404).json({ error: 'Module not found' });
      }

      // Get user progress for this module
      const progressResult = await db.query(
        'SELECT * FROM user_progress WHERE user_id = $1 AND module_id = $2 LIMIT 1',
        [req.user.id, moduleId]
      );
      const progress = progressResult.rows[0] || null;

      const moduleWithProgress = {
        ...moduleData,
        userProgress: progress ? {
          completed: progress.completed,
          progress: progress.progress,
          timeStudied: progress.time_studied,
          lastAccessed: progress.last_accessed,
          startedAt: progress.started_at
        } : null
      };

      res.json(moduleWithProgress);
    } catch (error) {
      console.error('Error fetching module:', error);
      res.status(500).json({ error: 'Failed to fetch module details' });
    }
  }
);

// GET /api/modules/:id/topics - tematy w module
router.get('/:id/topics',
  authenticateToken,
  async (req, res) => {
    try {
      const moduleId = req.params.id;
      const moduleData = modulesData[moduleId];
      
      if (!moduleData) {
        return res.status(404).json({ error: 'Module not found' });
      }

      // Get user progress for each topic
      const topicProgressResult = await db.query(
        'SELECT * FROM user_topic_progress WHERE user_id = $1 AND module_id = $2',
        [req.user.id, moduleId]
      );
      const topicProgress = topicProgressResult.rows;

      const topicsWithProgress = moduleData.topics.map(topic => {
        const progress = topicProgress?.find(p => p.topic_id === topic.id);
        return {
          ...topic,
          userProgress: progress ? {
            completed: progress.completed,
            timeSpent: progress.time_spent,
            lastViewed: progress.last_viewed
          } : null
        };
      });

      res.json({
        moduleId,
        moduleName: moduleData.name,
        topics: topicsWithProgress,
        total: topicsWithProgress.length
      });
    } catch (error) {
      console.error('Error fetching module topics:', error);
      res.status(500).json({ error: 'Failed to fetch module topics' });
    }
  }
);

// POST /api/modules/:id/enroll - zapisanie się na moduł
router.post('/:id/enroll',
  authenticateToken,
  validate(schemas.enrollModule),
  async (req, res) => {
    try {
      const moduleId = req.params.id;
      const { startDate } = req.validatedData;
      
      // Check if module exists
      if (!modulesData[moduleId]) {
        return res.status(404).json({ error: 'Module not found' });
      }

      // Check if user is already enrolled
      const existingResult = await db.query(
        'SELECT id FROM user_progress WHERE user_id = $1 AND module_id = $2 LIMIT 1',
        [req.user.id, moduleId]
      );

      if (existingResult.rows.length > 0) {
        return res.status(400).json({ error: 'User already enrolled in this module' });
      }

      // Create enrollment record
      const enrollmentResult = await db.query(
        `INSERT INTO user_progress (user_id, module_id, subject_id, started_at, progress, completed, time_studied)
         VALUES ($1, $2, $3, $4, 0, false, 0) RETURNING *`,
        [req.user.id, moduleId, modulesData[moduleId].subjectId, startDate || new Date().toISOString()]
      );
      const enrollment = enrollmentResult.rows[0];

      if (!enrollment) {
        return res.status(500).json({ error: 'Failed to enroll in module' });
      }

      res.status(201).json({
        message: 'Successfully enrolled in module',
        enrollment: {
          id: enrollment.id,
          moduleId: enrollment.module_id,
          startedAt: enrollment.started_at,
          progress: enrollment.progress
        }
      });
    } catch (error) {
      console.error('Error enrolling in module:', error);
      res.status(500).json({ error: 'Failed to enroll in module' });
    }
  }
);

// GET /api/modules/:id/resources - zasoby modułu
router.get('/:id/resources',
  authenticateToken,
  async (req, res) => {
    try {
      const moduleId = req.params.id;
      const moduleData = modulesData[moduleId];
      
      if (!moduleData) {
        return res.status(404).json({ error: 'Module not found' });
      }

      res.json({
        moduleId,
        resources: moduleData.resources || [],
        total: (moduleData.resources || []).length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch module resources' });
    }
  }
);

// GET /api/modules/:id/quiz - quiz modułu
router.get('/:id/quiz',
  authenticateToken,
  async (req, res) => {
    try {
      const moduleId = req.params.id;
      const moduleData = modulesData[moduleId];
      
      if (!moduleData || !moduleData.quiz) {
        return res.status(404).json({ error: 'Quiz not found for this module' });
      }

      // Get user's quiz attempts
      const attemptsResult = await db.query(
        'SELECT * FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2 ORDER BY created_at DESC',
        [req.user.id, moduleData.quiz.id]
      );
      const attempts = attemptsResult.rows;

      res.json({
        quiz: moduleData.quiz,
        userAttempts: attempts || [],
        maxAttempts: 3,
        remainingAttempts: Math.max(0, 3 - (attempts?.length || 0))
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch module quiz' });
    }
  }
);

module.exports = router;