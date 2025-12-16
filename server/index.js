require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id BIGSERIAL PRIMARY KEY,
      sender VARCHAR(40) NOT NULL DEFAULT 'Anon',
      content VARCHAR(280) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    ALTER TABLE messages
    ADD COLUMN IF NOT EXISTS sender VARCHAR(40) NOT NULL DEFAULT 'Anon';
  `);

  console.log("DB ready");
}

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/messages", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "40", 10), 100);
  const { rows } = await pool.query(
    `SELECT id,sender, content, created_at FROM messages ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  res.json(
    rows.map((r) => ({
      id: String(r.id),
      sender: r.sender, 
      content: r.content,
      createdAt: r.created_at,
    }))
  );
});

app.post("/api/messages", async (req, res) => {
  const sender = String(req.body?.sender ?? "").trim() || "Anon";
  const content = String(req.body?.content ?? "").trim();
  if (!content)
    return res.status(400).json({ ok: false, error: "EMPTY_CONTENT" });
  if (content.length > 280)
    return res.status(400).json({ ok: false, error: "MAX_280" });

  const { rows } = await pool.query(
    `INSERT INTO messages(sender, content) VALUES($1,$2) RETURNING id, sender, content, created_at`,
    [sender.slice(0, 40), content]
  );

  const r = rows[0];
  res.status(201).json({
    id: String(r.id),
    content: r.content,
    createdAt: r.created_at,
  });
});

const port = process.env.PORT || 3000;

initDb()
  .then(() =>
    app.listen(port, () =>
      console.log("API running on http://localhost:" + port)
    )
  )
  .catch((e) => {
    console.error("DB init failed:", e);
    process.exit(1);
  });
