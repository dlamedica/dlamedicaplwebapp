/**
 * User Preferences Routes
 * Synchronizacja preferencji użytkownika (dark mode, język, etc.)
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/preferences
 * Pobierz preferencje zalogowanego użytkownika
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      // Zwróć domyślne preferencje
      return res.json({
        success: true,
        preferences: {
          dark_mode: false,
          high_contrast: false,
          font_size: 'medium',
          language: 'pl',
          notifications_enabled: true,
          email_notifications: true,
          sound_enabled: true
        }
      });
    }

    res.json({
      success: true,
      preferences: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Preferences GET error:', error);
    res.status(500).json({ error: 'Błąd pobierania preferencji' });
  }
});

/**
 * PUT /api/preferences
 * Aktualizuj preferencje użytkownika
 */
router.put('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      dark_mode,
      high_contrast,
      font_size,
      language,
      notifications_enabled,
      email_notifications,
      sound_enabled
    } = req.body;

    // Upsert - wstaw lub aktualizuj
    const result = await db.query(`
      INSERT INTO user_preferences (user_id, dark_mode, high_contrast, font_size, language, notifications_enabled, email_notifications, sound_enabled)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id) DO UPDATE SET
        dark_mode = COALESCE(EXCLUDED.dark_mode, user_preferences.dark_mode),
        high_contrast = COALESCE(EXCLUDED.high_contrast, user_preferences.high_contrast),
        font_size = COALESCE(EXCLUDED.font_size, user_preferences.font_size),
        language = COALESCE(EXCLUDED.language, user_preferences.language),
        notifications_enabled = COALESCE(EXCLUDED.notifications_enabled, user_preferences.notifications_enabled),
        email_notifications = COALESCE(EXCLUDED.email_notifications, user_preferences.email_notifications),
        sound_enabled = COALESCE(EXCLUDED.sound_enabled, user_preferences.sound_enabled),
        updated_at = NOW()
      RETURNING *
    `, [userId, dark_mode, high_contrast, font_size, language, notifications_enabled, email_notifications, sound_enabled]);

    console.log(`⚙️ Preferences updated for user ${userId}`);

    res.json({
      success: true,
      preferences: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Preferences PUT error:', error);
    res.status(500).json({ error: 'Błąd aktualizacji preferencji' });
  }
});

/**
 * PATCH /api/preferences
 * Aktualizuj pojedynczą preferencję
 */
router.patch('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { key, value } = req.body;

    // Walidacja dozwolonych kluczy
    const allowedKeys = ['dark_mode', 'high_contrast', 'font_size', 'language', 'notifications_enabled', 'email_notifications', 'sound_enabled'];

    if (!allowedKeys.includes(key)) {
      return res.status(400).json({ error: 'Nieprawidłowy klucz preferencji' });
    }

    // Sprawdź czy rekord istnieje
    const existsResult = await db.query(
      'SELECT id FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    let result;
    if (existsResult.rows.length === 0) {
      // Utwórz nowy rekord z domyślnymi wartościami i podaną preferencją
      const defaultValues = {
        dark_mode: false,
        high_contrast: false,
        font_size: 'medium',
        language: 'pl',
        notifications_enabled: true,
        email_notifications: true,
        sound_enabled: true
      };
      defaultValues[key] = value;

      result = await db.query(`
        INSERT INTO user_preferences (user_id, dark_mode, high_contrast, font_size, language, notifications_enabled, email_notifications, sound_enabled)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [userId, defaultValues.dark_mode, defaultValues.high_contrast, defaultValues.font_size, defaultValues.language, defaultValues.notifications_enabled, defaultValues.email_notifications, defaultValues.sound_enabled]);
    } else {
      // Aktualizuj istniejący rekord
      result = await db.query(`
        UPDATE user_preferences
        SET ${key} = $1, updated_at = NOW()
        WHERE user_id = $2
        RETURNING *
      `, [value, userId]);
    }

    console.log(`⚙️ Preference ${key}=${value} for user ${userId}`);

    res.json({
      success: true,
      preferences: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Preferences PATCH error:', error);
    res.status(500).json({ error: 'Błąd aktualizacji preferencji' });
  }
});

/**
 * DELETE /api/preferences
 * Resetuj preferencje do domyślnych
 */
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query('DELETE FROM user_preferences WHERE user_id = $1', [userId]);

    res.json({
      success: true,
      message: 'Preferencje zresetowane do domyślnych'
    });
  } catch (error) {
    console.error('❌ Preferences DELETE error:', error);
    res.status(500).json({ error: 'Błąd resetowania preferencji' });
  }
});

module.exports = router;
