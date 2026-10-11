import { UserProfile, ScheduledMatch, TeamType } from '../types';
import { assignEquitableTeam } from '../data/teams';
import { UPCOMING_MATCHES } from '../data/leaderboards';

const API_BASE = 'http://localhost:5001/api';

export async function registerUserApi(payload: Partial<UserProfile>): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback mode
  }
  const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
  return {
    success: true,
    verificationCode: mockCode,
    clientAppVerifyLink: `http://localhost:5174/?verifyToken=${mockCode}&email=${encodeURIComponent(payload.email || '')}`,
    message: 'Verification code generated.'
  };
}

export async function loginUserApi(email: string, password?: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return { success: false, error: 'User not found in local backend. Please sign up.' };
}

export async function verifyEmailApi(email: string, code: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return { success: true, message: 'Account confirmed!' };
}

export async function createTournamentApi(payload: any): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/tournaments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  const roomCode = 'QUEST-' + Math.floor(1000 + Math.random() * 9000);
  const newMatch: ScheduledMatch = {
    id: 'match-' + Date.now(),
    title: payload.title || 'Abuja Secondary Super Clash',
    subject: payload.subject || 'General Mathematics',
    classLevel: payload.classLevel || 'SS1',
    term: 1,
    questionCount: 15,
    durationMinutes: payload.durationMinutes || 15,
    date: 'Today',
    time: 'Live',
    isProctored: !!payload.isProctored,
    status: 'live',
    registeredCount: 1,
    alphaPoints: 0,
    betaPoints: 0,
    omegaPoints: 0,
    roomCode,
    scope: payload.scope || 'inter_team'
  };
  return {
    success: true,
    tournament: newMatch,
    roomCode,
    roomLink: `http://localhost:5174/?room=${roomCode}`
  };
}

export async function fetchTournamentsApi(): Promise<ScheduledMatch[]> {
  try {
    const res = await fetch(`${API_BASE}/tournaments`);
    if (res.ok) {
      const data = await res.json();
      return data.map((t: any) => ({
        id: t.id,
        title: t.title,
        subject: t.subject,
        classLevel: t.classLevel,
        term: 1,
        questionCount: 15,
        durationMinutes: t.durationMinutes,
        date: 'Today',
        time: t.status === 'live' ? 'Live Now' : 'Scheduled',
        isProctored: t.isProctored === 1,
        status: t.status,
        registeredCount: t.participantsCount || 1,
        alphaPoints: t.alphaScore || 0,
        betaPoints: t.betaScore || 0,
        omegaPoints: t.omegaScore || 0,
        roomCode: t.roomCode,
        scope: t.scope
      }));
    }
  } catch (e) {
    // Fallback
  }
  return UPCOMING_MATCHES;
}

export async function joinTournamentRoomApi(roomCode: string, user: UserProfile): Promise<{ team: TeamType }> {
  try {
    const res = await fetch(`${API_BASE}/tournaments/${roomCode}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        userName: user.name,
        userSchool: user.school,
        userAvatar: user.avatarId,
        userClass: user.classLevel,
        userClassType: user.classType
      })
    });
    if (res.ok) {
      const data = await res.json();
      return { team: data.participant.team };
    }
  } catch (e) {
    // Fallback
  }
  return { team: assignEquitableTeam() };
}
