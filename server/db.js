import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'database.sqlite'), { verbose: console.log });
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatarColor TEXT,
    walletBalance REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS wallet_txns (
    id TEXT PRIMARY KEY,
    userId INTEGER,
    type TEXT,
    amount REAL,
    title TEXT,
    subtitle TEXT,
    date TEXT,
    method TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS charging_sessions (
    id TEXT PRIMARY KEY,
    userId INTEGER,
    stationId TEXT,
    stationName TEXT,
    date TEXT,
    energyKwh REAL,
    durationMin INTEGER,
    connector TEXT,
    amount REAL,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    userId INTEGER,
    name TEXT,
    model TEXT,
    batteryKwh REAL,
    connectors TEXT, -- JSON array
    maxChargingKw REAL,
    regNumber TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    userId INTEGER,
    stationId TEXT,
    stationName TEXT,
    chargerLabel TEXT,
    date TEXT,
    time TEXT,
    durationMin INTEGER,
    reservationFee REAL,
    estimatedCost REAL,
    total REAL,
    status TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    userId INTEGER,
    type TEXT,
    title TEXT,
    body TEXT,
    date TEXT,
    read INTEGER DEFAULT 0,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

// Add password column if it doesn't exist (migration)
const tableInfo = db.prepare("PRAGMA table_info(users)").all();
if (!tableInfo.some(col => col.name === 'password')) {
  db.prepare("ALTER TABLE users ADD COLUMN password TEXT").run();
}
if (!tableInfo.some(col => col.name === 'resetOtp')) {
  db.prepare("ALTER TABLE users ADD COLUMN resetOtp TEXT").run();
}
if (!tableInfo.some(col => col.name === 'resetOtpExpires')) {
  db.prepare("ALTER TABLE users ADD COLUMN resetOtpExpires INTEGER").run();
}

export default db;
