const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { signToken } = require('../auth');

const router = express.Router();

function sanitize(u) {
  const { password_hash, ...rest } = u;
  return rest;
}

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(400).json({ error: 'Email already registered.' });

  const hash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare(`INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, datetime('now'))`)
    .run(name.trim(), email.toLowerCase().trim(), hash);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = signToken({ id: user.id });
  res.json({ token, user: sanitize(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required.' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = signToken({ id: user.id });
  res.json({ token, user: sanitize(user) });
});

module.exports = router;
