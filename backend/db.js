import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'quest.sqlite');
const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'student',
    school TEXT NOT NULL,
    isCustomSchool INTEGER DEFAULT 0,
    classLevel TEXT,
    classType TEXT,
    teachingSubject TEXT,
    avatarId TEXT DEFAULT 'ryu',
    avatarCustomUrl TEXT,
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 1,
    level INTEGER DEFAULT 1,
    isVerified INTEGER DEFAULT 0,
    verificationCode TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tournaments (
    id TEXT PRIMARY KEY,
    roomCode TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    scope TEXT NOT NULL DEFAULT 'inter_team',
    intraType TEXT,
    classLevel TEXT NOT NULL DEFAULT 'SS1',
    durationMinutes INTEGER DEFAULT 15,
    isProctored INTEGER DEFAULT 0,
    creatorId TEXT,
    creatorName TEXT,
    status TEXT DEFAULT 'waiting',
    alphaScore REAL DEFAULT 0,
    betaScore REAL DEFAULT 0,
    omegaScore REAL DEFAULT 0,
    fastestFingerName TEXT,
    fastestFingerScore REAL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    tournamentId TEXT NOT NULL,
    userId TEXT NOT NULL,
    userName TEXT NOT NULL,
    userSchool TEXT NOT NULL,
    userAvatar TEXT NOT NULL,
    userClass TEXT,
    userClassType TEXT,
    team TEXT NOT NULL,
    score REAL DEFAULT 0,
    accuracy REAL DEFAULT 0,
    speedTime REAL DEFAULT 0,
    cameraActive INTEGER DEFAULT 0,
    violations INTEGER DEFAULT 0,
    isOnline INTEGER DEFAULT 1,
    joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tournamentId) REFERENCES tournaments(id)
  );

  CREATE TABLE IF NOT EXISTS match_results (
    id TEXT PRIMARY KEY,
    tournamentId TEXT NOT NULL,
    roomCode TEXT NOT NULL,
    title TEXT NOT NULL,
    scope TEXT NOT NULL,
    winnerName TEXT NOT NULL,
    winningScore REAL NOT NULL,
    winningMembersJson TEXT NOT NULL,
    fastestFingerJson TEXT,
    completedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS smtp_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    gmailUser TEXT,
    gmailAppPassword TEXT,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
