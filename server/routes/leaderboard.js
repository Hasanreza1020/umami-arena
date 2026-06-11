const express = require('express');
const { db } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const top10 = db
    .prepare(
      `SELECT id, name, total_packs, current_streak, current_level FROM users
       ORDER BY total_packs DESC, current_streak DESC LIMIT 10`
    )
    .all();

  const userInTop10 = top10.some((u) => u.id === req.userId);

  let userEntry = null;
  let userRank = null;

  if (!userInTop10) {
    const allUsers = db
      .prepare(`SELECT id FROM users ORDER BY total_packs DESC, current_streak DESC`)
      .all();
    userRank = allUsers.findIndex((u) => u.id === req.userId) + 1;
    userEntry = db.prepare('SELECT id, name, total_packs, current_streak, current_level FROM users WHERE id = ?').get(req.userId);
  }

  res.json({ top10, userEntry, userRank, currentUserId: req.userId });
});

module.exports = router;
