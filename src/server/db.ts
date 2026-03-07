import Database from "better-sqlite3";

const db = new Database("kaching.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    sender TEXT,
    amount TEXT,
    tng_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
  )
`);

// Cleanup expired links periodically
setInterval(() => {
  try {
    const stmt = db.prepare("DELETE FROM links WHERE expires_at < CURRENT_TIMESTAMP");
    const info = stmt.run();
    if (info.changes > 0) {
      console.log(`Cleaned up ${info.changes} expired links.`);
    }
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}, 1000 * 60 * 60); // Every hour

export default db;
