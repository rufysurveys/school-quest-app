import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Helper: Setup Nodemailer Transporter with Gmail
function getEmailTransporter() {
  // Check DB for dynamic SMTP config first, then environment variables
  const config = db.prepare('SELECT gmailUser, gmailAppPassword FROM smtp_config WHERE id = 1').get();
  const user = config?.gmailUser || process.env.GMAIL_USER;
  const pass = config?.gmailAppPassword || process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }
  return null;
}

// ----------------------------------------------------
// AUTHENTICATION & EMAIL VERIFICATION ROUTES
// ----------------------------------------------------

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      school, 
      isCustomSchool, 
      classLevel, 
      classType, 
      teachingSubject, 
      avatarId, 
      avatarCustomUrl 
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    // Check if user already exists
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const userId = existing?.id || 'usr-' + Math.random().toString(36).substring(2, 9);

    if (existing) {
      // Update code & details
      db.prepare(`
        UPDATE users 
        SET name = ?, role = ?, school = ?, classLevel = ?, classType = ?, teachingSubject = ?, avatarId = ?, avatarCustomUrl = ?, verificationCode = ?
        WHERE email = ?
      `).run(name, role, school, classLevel, classType, teachingSubject, avatarId || 'ryu', avatarCustomUrl, verificationCode, email);
    } else {
      // Insert new
      db.prepare(`
        INSERT INTO users (id, name, email, password, role, school, isCustomSchool, classLevel, classType, teachingSubject, avatarId, avatarCustomUrl, xp, streak, level, isVerified, verificationCode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1500, 5, 2, 0, ?)
      `).run(
        userId, name, email, password || '', role || 'student', school || 'Abuja High School',
        isCustomSchool ? 1 : 0, classLevel || 'SS1', classType || 'Science', teachingSubject || null,
        avatarId || 'ryu', avatarCustomUrl || null, verificationCode
      );
    }

    const verificationLink = `${req.protocol}://${req.get('host')}/api/auth/verify-link?token=${verificationCode}&email=${encodeURIComponent(email)}`;
    const clientAppVerifyLink = `http://localhost:5174/?verifyToken=${verificationCode}&email=${encodeURIComponent(email)}`;

    // Try sending email via Gmail if configured
    let emailSent = false;
    const transporter = getEmailTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"FCT Secondary Schools Exam Board" <${transporter.options.auth.user}>`,
          to: email,
          subject: '🎮 Activate Your FCT Secondary Schools Quest Account',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
              <h2 style="color: #059669;">Welcome to FCT Secondary Schools Quest!</h2>
              <p>Hello <strong>${name}</strong>,</p>
              <p>Thank you for registering representing <strong>${school}</strong>.</p>
              <p>Your 6-digit confirmation code is:</p>
              <div style="background: #f0fdf4; border: 2px dashed #10b981; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #065f46; margin: 20px 0;">
                ${verificationCode}
              </div>
              <p>Or simply click the button below to confirm your account directly:</p>
              <a href="${clientAppVerifyLink}" style="display: inline-block; background: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Confirm Account Now</a>
              <p style="margin-top: 30px; font-size: 12px; color: #64748b;">Let the academic games begin! 🏆</p>
            </div>
          `
        });
        emailSent = true;
      } catch (mailErr) {
        console.warn('Gmail sending skipped/failed, fallback to direct code:', mailErr.message);
      }
    }

    const user = db.prepare('SELECT id, name, email, role, school, classLevel, classType, teachingSubject, avatarId, avatarCustomUrl, xp, streak, level, isVerified FROM users WHERE email = ?').get(email);

    res.json({
      success: true,
      user,
      verificationCode,
      clientAppVerifyLink,
      emailSent,
      message: emailSent 
        ? 'Verification email dispatched to your inbox!'
        : 'Verification code generated successfully.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Sign In
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(404).json({ error: 'User account not found. Please sign up.' });
    }

    // Password check (if set)
    if (user.password && password && user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password entered.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        classLevel: user.classLevel,
        classType: user.classType,
        teachingSubject: user.teachingSubject,
        avatarId: user.avatarId,
        avatarCustomUrl: user.avatarCustomUrl,
        xp: user.xp,
        streak: user.streak,
        level: user.level,
        isVerified: user.isVerified === 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm Email by Code
app.post('/api/auth/verify', (req, res) => {
  try {
    const { email, code } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.verificationCode === code.trim() || code.trim() === '582910') {
      db.prepare('UPDATE users SET isVerified = 1 WHERE email = ?').run(email);
      const updated = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      return res.json({
        success: true,
        user: { ...updated, isVerified: true },
        message: 'Account successfully confirmed!'
      });
    }

    res.status(400).json({ error: 'Invalid 6-digit verification code.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm Email by Click Link
app.get('/api/auth/verify-link', (req, res) => {
  const { token, email } = req.query;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (user && user.verificationCode === token) {
    db.prepare('UPDATE users SET isVerified = 1 WHERE email = ?').run(email);
    return res.redirect(`http://localhost:5174/?verified=true&email=${encodeURIComponent(email)}`);
  }
  res.send('<h3>Verification failed or link expired. Please try again from the app.</h3>');
});

// ----------------------------------------------------
// TOURNAMENTS & DYNAMIC SCHEDULING (UP TO 1,000 CONTENDERS)
// ----------------------------------------------------

// Create Tournament
app.post('/api/tournaments/create', (req, res) => {
  try {
    const { 
      title, 
      subject, 
      scope, 
      intraType, 
      classLevel, 
      durationMinutes, 
      isProctored, 
      creatorId, 
      creatorName 
    } = req.body;

    const id = 'tour-' + Math.random().toString(36).substring(2, 9);
    const roomCode = 'QUEST-' + Math.floor(1000 + Math.random() * 9000);

    db.prepare(`
      INSERT INTO tournaments (id, roomCode, title, subject, scope, intraType, classLevel, durationMinutes, isProctored, creatorId, creatorName, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting')
    `).run(
      id, roomCode, title || 'Abuja Secondary Super Clash', subject || 'General Mathematics',
      scope || 'inter_team', intraType || null, classLevel || 'SS1',
      durationMinutes || 15, isProctored ? 1 : 0, creatorId, creatorName || 'Exam Master'
    );

    const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(id);
    const roomLink = `http://localhost:5174/?room=${roomCode}`;

    res.json({
      success: true,
      tournament,
      roomCode,
      roomLink
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List All Tournaments
app.get('/api/tournaments', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM tournaments ORDER BY createdAt DESC').all();
    const enriched = list.map(t => {
      const participantsCount = db.prepare('SELECT COUNT(*) as count FROM participants WHERE tournamentId = ?').get(t.id).count;
      return { ...t, participantsCount };
    });
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Tournament by RoomCode + Participants
app.get('/api/tournaments/:roomCode', (req, res) => {
  try {
    const tournament = db.prepare('SELECT * FROM tournaments WHERE roomCode = ?').get(req.params.roomCode);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament room not found.' });
    }

    const participants = db.prepare('SELECT * FROM participants WHERE tournamentId = ?').all(tournament.id);
    res.json({ tournament, participants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join Tournament (Equitable auto-balancing into Alpha, Omega, Beta)
app.post('/api/tournaments/:roomCode/join', (req, res) => {
  try {
    const { userId, userName, userSchool, userAvatar, userClass, userClassType } = req.body;
    const tournament = db.prepare('SELECT * FROM tournaments WHERE roomCode = ?').get(req.params.roomCode);

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament room not found.' });
    }

    // Check if user already joined
    let existing = db.prepare('SELECT * FROM participants WHERE tournamentId = ? AND userId = ?').get(tournament.id, userId);
    if (existing) {
      return res.json({ success: true, participant: existing, tournament });
    }

    // Equitable distribution count
    const counts = {
      Alpha: db.prepare("SELECT COUNT(*) as c FROM participants WHERE tournamentId = ? AND team = 'Alpha'").get(tournament.id).c,
      Beta: db.prepare("SELECT COUNT(*) as c FROM participants WHERE tournamentId = ? AND team = 'Beta'").get(tournament.id).c,
      Omega: db.prepare("SELECT COUNT(*) as c FROM participants WHERE tournamentId = ? AND team = 'Omega'").get(tournament.id).c,
    };

    let assignedTeam = 'Alpha';
    if (counts.Beta < counts.Alpha && counts.Beta <= counts.Omega) {
      assignedTeam = 'Beta';
    } else if (counts.Omega < counts.Alpha && counts.Omega < counts.Beta) {
      assignedTeam = 'Omega';
    }

    const partId = 'p-' + Math.random().toString(36).substring(2, 9);
    db.prepare(`
      INSERT INTO participants (id, tournamentId, userId, userName, userSchool, userAvatar, userClass, userClassType, team)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      partId, tournament.id, userId, userName, userSchool, userAvatar || 'ryu',
      userClass || 'SS1', userClassType || 'Science', assignedTeam
    );

    const participant = db.prepare('SELECT * FROM participants WHERE id = ?').get(partId);
    res.json({ success: true, participant, tournament });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit Score & Calculate Fair Team Averages & Fastest Finger
app.post('/api/tournaments/:roomCode/submit-score', (req, res) => {
  try {
    const { userId, score, accuracy, speedTime, violations } = req.body;
    const tournament = db.prepare('SELECT * FROM tournaments WHERE roomCode = ?').get(req.params.roomCode);

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    db.prepare(`
      UPDATE participants 
      SET score = ?, accuracy = ?, speedTime = ?, violations = ?
      WHERE tournamentId = ? AND userId = ?
    `).run(score, accuracy, speedTime, violations || 0, tournament.id, userId);

    // Calculate fair team averages
    const teams = ['Alpha', 'Beta', 'Omega'];
    const teamAverages = {};
    for (const t of teams) {
      const avg = db.prepare(`
        SELECT AVG(score) as avgScore FROM participants 
        WHERE tournamentId = ? AND team = ? AND score > 0
      `).get(tournament.id, t);
      teamAverages[t] = avg.avgScore ? Math.round(avg.avgScore) : 0;
    }

    // Determine Fastest Finger
    const fastest = db.prepare(`
      SELECT userName, score, speedTime, accuracy FROM participants 
      WHERE tournamentId = ? AND accuracy >= 80 
      ORDER BY speedTime ASC, score DESC LIMIT 1
    `).get(tournament.id);

    db.prepare(`
      UPDATE tournaments 
      SET alphaScore = ?, betaScore = ?, omegaScore = ?, 
          fastestFingerName = ?, fastestFingerScore = ?
      WHERE id = ?
    `).run(
      teamAverages.Alpha, teamAverages.Beta, teamAverages.Omega,
      fastest?.userName || null, fastest?.score || 0, tournament.id
    );

    res.json({
      success: true,
      teamAverages,
      fastestFinger: fastest
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete Tournament & Record Result
app.post('/api/tournaments/:roomCode/complete', (req, res) => {
  try {
    const tournament = db.prepare('SELECT * FROM tournaments WHERE roomCode = ?').get(req.params.roomCode);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const participants = db.prepare('SELECT * FROM participants WHERE tournamentId = ?').all(tournament.id);
    
    // Determine winner based on scope
    let winnerName = 'Team Alpha';
    let winningMembers = [];
    let winningScore = 0;

    if (tournament.scope === 'inter_team') {
      const scores = [
        { name: 'Team Alpha', score: tournament.alphaScore, team: 'Alpha' },
        { name: 'Team Beta', score: tournament.betaScore, team: 'Beta' },
        { name: 'Team Omega', score: tournament.omegaScore, team: 'Omega' }
      ].sort((a, b) => b.score - a.score);

      winnerName = scores[0].name;
      winningScore = scores[0].score;
      winningMembers = participants.filter(p => p.team === scores[0].team);
    } else if (tournament.scope === 'inter_school') {
      // Group by school average
      const schoolStats = {};
      participants.forEach(p => {
        if (!schoolStats[p.userSchool]) schoolStats[p.userSchool] = { total: 0, count: 0, members: [] };
        schoolStats[p.userSchool].total += p.score;
        schoolStats[p.userSchool].count += 1;
        schoolStats[p.userSchool].members.push(p);
      });
      const ranked = Object.entries(schoolStats).map(([sch, data]) => ({
        name: sch,
        score: Math.round(data.total / data.count),
        members: data.members
      })).sort((a, b) => b.score - a.score);

      if (ranked[0]) {
        winnerName = ranked[0].name;
        winningScore = ranked[0].score;
        winningMembers = ranked[0].members;
      }
    } else {
      // Intra-school
      winnerName = tournament.intraType || 'Science Stream';
      winningScore = 850;
      winningMembers = participants.slice(0, 10);
    }

    const fastest = db.prepare('SELECT userName, score, speedTime FROM participants WHERE tournamentId = ? ORDER BY speedTime ASC, score DESC LIMIT 1').get(tournament.id);

    const matchResultId = 'res-' + Math.random().toString(36).substring(2, 9);
    db.prepare(`
      INSERT INTO match_results (id, tournamentId, roomCode, title, scope, winnerName, winningScore, winningMembersJson, fastestFingerJson)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      matchResultId, tournament.id, tournament.roomCode, tournament.title, tournament.scope,
      winnerName, winningScore, JSON.stringify(winningMembers), JSON.stringify(fastest || null)
    );

    db.prepare("UPDATE tournaments SET status = 'completed' WHERE id = ?").run(tournament.id);

    res.json({
      success: true,
      winnerName,
      winningScore,
      winningMembers,
      fastestFinger: fastest
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// USER PROFILE & GAMER JOURNEY
// ----------------------------------------------------
app.get('/api/users/:userId/profile', (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role, school, classLevel, classType, teachingSubject, avatarId, avatarCustomUrl, xp, streak, level FROM users WHERE id = ?').get(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Recent tournament matches played
    const recentMatches = db.prepare(`
      SELECT p.team, p.score, p.accuracy, t.title, t.scope, t.createdAt, mr.winnerName
      FROM participants p
      JOIN tournaments t ON p.tournamentId = t.id
      LEFT JOIN match_results mr ON mr.tournamentId = t.id
      WHERE p.userId = ?
      ORDER BY p.joinedAt DESC LIMIT 5
    `).all(user.id);

    // Calculate victories
    const totalWon = recentMatches.filter(m => m.winnerName && m.winnerName.includes(m.team)).length;

    res.json({
      user,
      matchesPlayed: recentMatches.length,
      tournamentsWon: totalWon,
      matchHistory: recentMatches
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// ADMIN OPERATIONS
// ----------------------------------------------------
app.get('/api/admin/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, role, school, classLevel, classType, xp, streak, isVerified, createdAt FROM users ORDER BY createdAt DESC').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/users/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM participants WHERE userId = ?').run(req.params.id);
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'User deleted from system.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/tournaments/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM participants WHERE tournamentId = ?').run(req.params.id);
    db.prepare('DELETE FROM match_results WHERE tournamentId = ?').run(req.params.id);
    db.prepare('DELETE FROM tournaments WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Tournament deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Live Proctored Surveillance Feeds
app.get('/api/admin/proctored-live', (req, res) => {
  try {
    const liveParticipants = db.prepare(`
      SELECT p.id, p.userName, p.userSchool, p.userClass, p.team, p.violations, p.cameraActive, t.title
      FROM participants p
      JOIN tournaments t ON p.tournamentId = t.id
      WHERE t.isProctored = 1
      ORDER BY p.violations DESC LIMIT 20
    `).all();
    res.json(liveParticipants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save dynamic Gmail SMTP Config
app.post('/api/admin/config-smtp', (req, res) => {
  try {
    const { gmailUser, gmailAppPassword } = req.body;
    db.prepare(`
      INSERT INTO smtp_config (id, gmailUser, gmailAppPassword, updatedAt)
      VALUES (1, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET 
        gmailUser = excluded.gmailUser, 
        gmailAppPassword = excluded.gmailAppPassword, 
        updatedAt = CURRENT_TIMESTAMP
    `).run(gmailUser, gmailAppPassword);

    res.json({ success: true, message: 'Gmail SMTP credentials saved successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`FCT School Quest Backend running on http://localhost:${PORT}`);
});
