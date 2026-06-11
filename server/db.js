const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

const isProd = process.env.VERCEL || process.env.NODE_ENV === 'production';
const DB_PATH = isProd ? '/tmp/arena.db' : path.join(__dirname, 'arena.db');

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL');

const LEVELS = [
  { level: 0, title: 'Unranked', minPacks: 0, maxPacks: 0 },
  { level: 1, title: 'Genin', minPacks: 1, maxPacks: 3 },
  { level: 2, title: 'Ramen Apprentice', minPacks: 4, maxPacks: 10 },
  { level: 3, title: 'Broth Samurai', minPacks: 11, maxPacks: 25 },
  { level: 4, title: 'Umami Oni', minPacks: 26, maxPacks: 45 },
  { level: 5, title: 'The Ramen God', minPacks: 46, maxPacks: Infinity },
];

function computeLevel(totalPacks) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalPacks >= LEVELS[i].minPacks) return LEVELS[i];
  }
  return LEVELS[0];
}

function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      total_packs INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_redeemed_at TEXT,
      current_level INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code_string TEXT UNIQUE NOT NULL,
      redeemed_by INTEGER REFERENCES users(id),
      redeemed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS redemptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      code_id INTEGER NOT NULL,
      redeemed_at TEXT NOT NULL
    );
  `);

  seedCodes();
  seedDemoUser();
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rand = (n) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `UMA-${rand(4)}-${rand(4)}`;
}

function seedCodes() {
  const count = db.prepare('SELECT COUNT(*) as c FROM codes').get().c;
  if (count > 0) return;

  const codes = new Set();
  const insert = db.prepare('INSERT OR IGNORE INTO codes (code_string) VALUES (?)');

  db.exec('BEGIN TRANSACTION');
  try {
    while (codes.size < 200) {
      const code = generateCode();
      if (!codes.has(code)) {
        codes.add(code);
        insert.run(code);
      }
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

  console.log('\n=== 200 PACK CODES GENERATED ===');
  [...codes].forEach((c) => console.log(c));
  console.log('================================\n');
}

function seedDemoUser() {
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (count > 0) return;

  const hash = bcrypt.hashSync('ramen123', 10);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const result = db
    .prepare(
      `INSERT INTO users (name, email, password_hash, total_packs, current_streak, longest_streak, current_level, last_redeemed_at, created_at)
       VALUES (?, ?, ?, 12, 3, 5, 3, ?, datetime('now'))`
    )
    .run('Kaito', 'demo@umamiarena.com', hash, yesterday.toISOString());

  const userId = Number(result.lastInsertRowid);
  const codes = db.prepare('SELECT id FROM codes LIMIT 3').all();

  const d1 = new Date(); d1.setDate(d1.getDate() - 3);
  const d2 = new Date(); d2.setDate(d2.getDate() - 2);
  const d3 = new Date(); d3.setDate(d3.getDate() - 1);
  const dates = [d1.toISOString(), d2.toISOString(), d3.toISOString()];

  codes.forEach((code, i) => {
    db.prepare('UPDATE codes SET redeemed_by = ?, redeemed_at = ? WHERE id = ?').run(userId, dates[i], code.id);
    db.prepare('INSERT INTO redemptions (user_id, code_id, redeemed_at) VALUES (?, ?, ?)').run(userId, code.id, dates[i]);
  });

  console.log('\n=== DEMO USER CREATED ===');
  console.log('Email: demo@umamiarena.com');
  console.log('Password: ramen123');
  console.log('Level: Broth Samurai (12 packs)');
  console.log('========================\n');
}

module.exports = { db, initDB, computeLevel, LEVELS };
