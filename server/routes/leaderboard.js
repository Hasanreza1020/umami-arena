const express = require('express');
const { db } = require('../db');
const { verifyToken } = require('../auth');

const router = express.Router();

function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  req.userId = null;
  if (header && header.startsWith('Bearer ')) {
    try {
      const decoded = verifyToken(header.slice(7));
      req.userId = decoded.id;
    } catch {
      // token invalid — treat as guest
    }
  }
  next();
}

router.get('/', optionalAuth, (req, res) => {
  const top10 = db
    .prepare(
      `SELECT id, name, total_packs, current_streak, current_level FROM users
       ORDER BY total_packs DESC, current_streak DESC LIMIT 10`
    )
    .all();

  let userEntry = null;
  let userRank = null;

  if (req.userId) {
    const userInTop10 = top10.some((u) => u.id === req.userId);
    if (!userInTop10) {
      const allUsers = db
        .prepare(`SELECT id FROM users ORDER BY total_packs DESC, current_streak DESC`)
        .all();
      userRank = allUsers.findIndex((u) => u.id === req.userId) + 1;
      userEntry = db
        .prepare('SELECT id, name, total_packs, current_streak, current_level FROM users WHERE id = ?')
        .get(req.userId);
    }
  }

  res.json({ top10, userEntry, userRank, currentUserId: req.userId });
});

module.exports = router;
