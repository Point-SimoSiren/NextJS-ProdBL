import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "board.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

export const STATUS = ["backlog", "in_progress", "done"];

db.exec(`
  CREATE TABLE IF NOT EXISTS use_cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('backlog', 'in_progress', 'done')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const rowCount = db.prepare("SELECT COUNT(*) AS count FROM use_cases").get().count;
if (rowCount === 0) {
  const seed = db.prepare(
    "INSERT INTO use_cases (title, status) VALUES (@title, @status)",
  );
  seed.run({ title: "Kirjautumisen virheviestit selkeämmiksi", status: "backlog" });
  seed.run({ title: "Hakutulosten sivutus", status: "in_progress" });
  seed.run({ title: "Profiilisivun perustiedot", status: "done" });
}

export function listUseCases() {
  return db
    .prepare(
      `
      SELECT id, title, status, created_at
      FROM use_cases
      ORDER BY
        CASE status
          WHEN 'backlog' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'done' THEN 3
        END,
        id DESC
    `,
    )
    .all();
}

export function createUseCase(title) {
  const cleanTitle = title.trim();
  const result = db
    .prepare("INSERT INTO use_cases (title, status) VALUES (?, 'backlog')")
    .run(cleanTitle);
  return db
    .prepare("SELECT id, title, status, created_at FROM use_cases WHERE id = ?")
    .get(result.lastInsertRowid);
}

export function updateUseCaseStatus(id, status) {
  db.prepare("UPDATE use_cases SET status = ? WHERE id = ?").run(status, id);
  return db
    .prepare("SELECT id, title, status, created_at FROM use_cases WHERE id = ?")
    .get(id);
}
