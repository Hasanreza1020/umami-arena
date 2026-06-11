const express = require('express');
const { db, computeLevel } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

function getStreakUpdate(user) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  if (!user.last_redeemed_at) {
    return { streak: 1, streakChanged: true };
  }

  const lastDate = new Date(user.last_redeemed_at);
  const lastStr = lastDate.toISOString().slice(0, 10);

  if (lastStr === todayStr) {
    return { streak: user.current_streak, streakChanged: false };
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (lastStr === yesterdayStr) {
    return { streak: user.current_streak + 1, streakChanged: true };
  }

  return { streak: 1, streakChanged: true };
}

router.post('/', authMiddleware, (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required.' });

  const codeRow = db.prepare('SELECT * FROM codes WHERE code_string = ?').get(code.trim().toUpperCase());

  if (!codeRow) {
    return res.status(400).json({ error: 'Invalid code. Check the scratch panel again.' });
  }

  if (codeRow.redeemed_by) {
    return res.status(400).json({ error: 'This code has already been claimed.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const now = new Date().toISOString();
  const { streak, streakChanged } = getStreakUpdate(user);
  const newPacks = user.total_packs + 1;
  const newLevel = computeLevel(newPacks);
  const oldLevel = computeLevel(user.total_packs);
  const longestStreak = Math.max(user.longest_streak, streak);
  const levelUp = newLevel.level > oldLevel.level;

  db.prepare('UPDATE codes SET redeemed_by = ?, redeemed_at = ? WHERE id = ?').run(req.userId, now, codeRow.id);
  db.prepare('INSERT INTO redemptions (user_id, code_id, redeemed_at) VALUES (?, ?, ?)').run(req.userId, codeRow.id, now);
  db.prepare(
    `UPDATE users SET total_packs = ?, current_streak = ?, longest_streak = ?, last_redeemed_at = ?, current_level = ? WHERE id = ?`
  ).run(newPacks, streak, longestStreak, now, newLevel.level, req.userId);

  const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  const { password_hash, ...safeUser } = updatedUser;

  let streakMsg = '';
  if (streakChanged && streak > 1) streakMsg = ` 🔥 ${streak}-day streak!`;
  else if (streak === 1 && streakChanged) streakMsg = ' Streak started!';

  res.json({
    success: true,
    message: `Pack logged. You're at ${newPacks} packs.${streakMsg}`,
    user: safeUser,
    levelUp,
    newLevel: levelUp ? newLevel : null,
    streak,
  });
});

module.exports = router;
