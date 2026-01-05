const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');
const { validate, schemas } = require('../middleware/validation');

// POST /api/progress/update - aktualizacja postępu
router.post('/update',
  authenticateToken,
  validate(schemas.updateProgress),
  async (req, res) => {
    try {
      const { moduleId, topicId, contentId, progress, timeStudied, completed } = req.validatedData;
      const userId = req.user.id;
      const normalizedProgress = Math.min(100, Math.max(0, Math.round(progress)));

      // Update module progress
      const moduleProgressResult = await db.query(
        `INSERT INTO user_progress (user_id, module_id, progress, time_studied, completed, last_accessed)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (user_id, module_id) 
         DO UPDATE SET progress = $3, time_studied = $4, completed = $5, last_accessed = NOW()
         RETURNING *`,
        [userId, moduleId, normalizedProgress, timeStudied || 0, completed || false]
      );
      const moduleProgress = moduleProgressResult.rows[0];

      if (!moduleProgress) {
        return res.status(500).json({ error: 'Failed to update module progress' });
      }

      // Update topic progress if provided
      if (topicId) {
        await db.query(
          `INSERT INTO user_topic_progress (user_id, module_id, topic_id, completed, time_spent, last_viewed)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT (user_id, module_id, topic_id)
           DO UPDATE SET completed = $4, time_spent = $5, last_viewed = NOW()`,
          [userId, moduleId, topicId, completed || false, timeStudied || 0]
        );
      }

      // Update content progress if provided
      if (contentId) {
        await db.query(
          `INSERT INTO content_views (user_id, content_id, time_spent, completed, viewed_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [userId, contentId, timeStudied || 0, completed || false]
        );
      }

      res.json({
        message: 'Progress updated successfully',
        moduleProgress: {
          id: moduleProgress.id,
          moduleId: moduleProgress.module_id,
          progress: moduleProgress.progress,
          timeStudied: moduleProgress.time_studied,
          completed: moduleProgress.completed,
          lastAccessed: moduleProgress.last_accessed
        }
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  }
);

// GET /api/progress/stats - statystyki nauki
router.get('/stats',
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { timeframe = '30' } = req.query; // days
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeframe));

      // Get module stats
      const moduleStatsResult = await db.query(
        'SELECT * FROM user_progress WHERE user_id = $1',
        [userId]
      );
      const moduleStats = moduleStatsResult.rows;

      // Get daily study time
      const dailyStatsResult = await db.query(
        'SELECT viewed_at, time_spent FROM content_views WHERE user_id = $1 AND viewed_at >= $2',
        [userId, startDate.toISOString()]
      );
      const dailyStats = dailyStatsResult.rows;

      // Get quiz stats
      const quizStatsResult = await db.query(
        'SELECT * FROM quiz_attempts WHERE user_id = $1 AND created_at >= $2',
        [userId, startDate.toISOString()]
      );
      const quizStats = quizStatsResult.rows;

      // Process daily study time
      const dailyStudyTime = {};
      dailyStats?.forEach(stat => {
        const date = stat.viewed_at.split('T')[0];
        dailyStudyTime[date] = (dailyStudyTime[date] || 0) + (stat.time_spent || 0);
      });

      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      const today = new Date();
      
      for (let i = 0; i < parseInt(timeframe); i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        if (dailyStudyTime[dateStr] > 0) {
          if (i === 0) currentStreak++;
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          if (i === 0) currentStreak = 0;
          tempStreak = 0;
        }
      }

      const stats = {
        overview: {
          totalModules: moduleStats?.length || 0,
          completedModules: moduleStats?.filter(m => m.completed).length || 0,
          totalStudyTime: moduleStats?.reduce((sum, m) => sum + (m.time_studied || 0), 0) || 0,
          averageProgress: moduleStats?.length ? 
            moduleStats.reduce((sum, m) => sum + (m.progress || 0), 0) / moduleStats.length : 0
        },
        streaks: {
          current: currentStreak,
          longest: longestStreak
        },
        quiz: {
          totalAttempts: quizStats?.length || 0,
          averageScore: quizStats?.length ? 
            quizStats.reduce((sum, q) => sum + (q.score || 0), 0) / quizStats.length : 0,
          passedQuizzes: quizStats?.filter(q => q.passed).length || 0
        },
        dailyActivity: Object.entries(dailyStudyTime)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([date, minutes]) => ({ date, minutes })),
        weeklyGoal: {
          target: 300, // 5 hours per week
          achieved: Object.values(dailyStudyTime).reduce((sum, time) => sum + time, 0),
          percentage: Math.min(100, (Object.values(dailyStudyTime).reduce((sum, time) => sum + time, 0) / 300) * 100)
        }
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching progress stats:', error);
      res.status(500).json({ error: 'Failed to fetch progress statistics' });
    }
  }
);

// GET /api/progress/dashboard - dashboard data
router.get('/dashboard',
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;

      // Get recent activity
      const recentModulesResult = await db.query(
        'SELECT * FROM user_progress WHERE user_id = $1 ORDER BY last_accessed DESC NULLS LAST LIMIT 5',
        [userId]
      );
      const recentModules = recentModulesResult.rows;

      // Get upcoming deadlines (mock data for now)
      const upcomingDeadlines = [
        {
          type: 'quiz',
          title: 'Test z kardiologii',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          moduleId: '11-module-1'
        },
        {
          type: 'assignment',
          title: 'Analiza przypadku EKG',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          moduleId: '101-module-1'
        }
      ];

      // Get achievements (mock data)
      const achievements = [
        {
          id: 'first-module',
          name: 'Pierwszy moduł',
          description: 'Ukończ pierwszy moduł',
          earned: recentModules?.some(m => m.completed) || false,
          earnedAt: recentModules?.find(m => m.completed)?.updated_at || null
        },
        {
          id: 'study-streak',
          name: 'Tydzień nauki',
          description: 'Naucz się przez 7 dni z rzędu',
          earned: false,
          earnedAt: null
        }
      ];

      // Get recommended content
      const recommendations = [
        {
          type: 'module',
          id: '1-module-1',
          title: 'Anatomia Układu Krążenia',
          reason: 'Popularne wśród użytkowników o podobnym profilu',
          difficulty: 'medium'
        },
        {
          type: 'quiz',
          id: 'quiz-basics',
          title: 'Quiz podstawy medycyny',
          reason: 'Uzupełnij podstawową wiedzę',
          difficulty: 'beginner'
        }
      ];

      res.json({
        recentActivity: recentModules?.map(module => ({
          id: module.id,
          moduleId: module.module_id,
          progress: module.progress,
          lastAccessed: module.last_accessed,
          completed: module.completed
        })) || [],
        upcomingDeadlines,
        achievements,
        recommendations,
        quickStats: {
          modulesInProgress: recentModules?.filter(m => !m.completed && m.progress > 0).length || 0,
          completedThisWeek: recentModules?.filter(m => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return m.completed && new Date(m.updated_at) > weekAgo;
          }).length || 0,
          studyTimeThisWeek: recentModules?.reduce((sum, m) => sum + (m.time_studied || 0), 0) || 0
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }
);

module.exports = router;