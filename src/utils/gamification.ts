import { UserProfile, TeamType } from '../types';
import { assignEquitableTeam } from '../data/teams';

const USER_STORAGE_KEY = 'fct_school_quest_user_v2';

export const BADGE_TIERS = [
  { name: '🌱 Novice Scholar', minXP: 0, level: 1 },
  { name: '📘 Junior Specialist', minXP: 1000, level: 2 },
  { name: '⭐ Senior Scholar', minXP: 2500, level: 3 },
  { name: '🎓 Academic Master', minXP: 5000, level: 4 },
  { name: '👑 Academic Legend', minXP: 10000, level: 5 },
];

export function getTierForXP(xp: number) {
  let current = BADGE_TIERS[0];
  for (const tier of BADGE_TIERS) {
    if (xp >= tier.minXP) {
      current = tier;
    }
  }
  return current;
}

/**
 * Loads stored user. Returns null if not registered or not yet email-verified.
 */
export function loadUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const user: UserProfile = JSON.parse(raw);
      if (user && user.isVerified) {
        return user;
      }
    }
  } catch (err) {
    console.error('Failed to load user profile from storage', err);
  }
  return null;
}

export function saveUserProfile(user: UserProfile): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user profile', err);
  }
}

export function clearUserProfile(): void {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear user profile', err);
  }
}

export function generateVerificationCode(): string {
  // Generates 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 20) return 2.0;
  if (streakDays >= 10) return 1.5;
  if (streakDays >= 5) return 1.25;
  if (streakDays >= 3) return 1.1;
  return 1.0;
}
