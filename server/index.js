require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB, db } = require('./db');
const { authMiddleware } = require('./auth');

const app = express();

app.use(cors());
app.use(express.json());

initDB();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/redeem', require('./routes/redeem'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/user/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { password_hash, ...safeUser } = user;

  const now = new Date();
  const recentDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().slice(0, 10);
    const found = db
      .prepare(`SELECT 1 FROM redemptions WHERE user_id = ? AND date(redeemed_at) = ?`)
      .get(req.userId, dayStr);
    recentDays.push(!!found);
  }

  res.json({ ...safeUser, recentDays });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Umami Arena server running on http://localhost:${PORT}`));
}

module.exports = app;
