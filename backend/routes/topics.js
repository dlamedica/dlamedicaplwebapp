const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');

// GET /api/topics/:id/content - materiały do tematu
router.get('/:id/content',
  authenticateToken,
  async (req, res) => {
    try {
      const topicId = req.params.id;
      
      const { contentData } = require('./content');
      const topicContent = Object.values(contentData || {}).filter(content => 
        content.topicId === topicId
      );

      if (topicContent.length === 0) {
        return res.status(404).json({ error: 'No content found for this topic' });
      }

      // Get user progress for each content item
      const contentIds = topicContent.map(c => c.id);
      let viewHistory = [];
      if (contentIds.length > 0) {
        const viewResult = await db.query(
          'SELECT * FROM content_views WHERE user_id = $1 AND content_id = ANY($2)',
          [req.user.id, contentIds]
        );
        viewHistory = viewResult.rows;
      }

      const contentWithProgress = topicContent.map(content => {
        const views = viewHistory?.filter(v => v.content_id === content.id) || [];
        const lastView = views.sort((a, b) => new Date(b.viewed_at) - new Date(a.viewed_at))[0];
        
        return {
          ...content,
          userProgress: {
            viewed: views.length > 0,
            completed: lastView?.completed || false,
            lastViewed: lastView?.viewed_at || null,
            totalTimeSpent: views.reduce((sum, v) => sum + (v.time_spent || 0), 0)
          }
        };
      });

      res.json({
        topicId,
        content: contentWithProgress,
        total: contentWithProgress.length,
        summary: {
          totalItems: contentWithProgress.length,
          completedItems: contentWithProgress.filter(c => c.userProgress.completed).length,
          viewedItems: contentWithProgress.filter(c => c.userProgress.viewed).length
        }
      });
    } catch (error) {
      console.error('Error fetching topic content:', error);
      res.status(500).json({ error: 'Failed to fetch topic content' });
    }
  }
);

module.exports = router;