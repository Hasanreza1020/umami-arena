const express = require('express');
const { db } = require('../db');

const router = express.Router();

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rand = (n) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `UMA-${rand(4)}-${rand(4)}`;
}

router.get('/generate-codes', (req, res) => {
  const codes = new Set();
  const existing = new Set(db.prepare('SELECT code_string FROM codes').all().map((r) => r.code_string));
  const insert = db.prepare('INSERT OR IGNORE INTO codes (code_string) VALUES (?)');

  const insertMany = db.transaction(() => {
    let attempts = 0;
    while (codes.size < 50 && attempts < 1000) {
      const code = generateCode();
      if (!existing.has(code) && !codes.has(code)) {
        codes.add(code);
        insert.run(code);
      }
      attempts++;
    }
  });
  insertMany();

  const codeList = [...codes];
  console.log('\n=== 50 NEW CODES GENERATED ===');
  codeList.forEach((c) => console.log(c));
  console.log('==============================\n');

  res.json({ generated: codeList.length, codes: codeList });
});

module.exports = router;
