import { TeamType, TeamScore } from '../types';

export interface TeamInfo {
  type: TeamType;
  name: string;
  motto: string;
  themeColor: string;
  badgeIcon: string;
  textColor: string;
  bgGradient: string;
  borderColor: string;
}

export const TEAMS_INFO: Record<TeamType, TeamInfo> = {
  Alpha: {
    type: 'Alpha',
    name: 'Team Alpha (Golden Eagles)',
    motto: 'Leadership, Precision & Academic Supremacy',
    themeColor: '#f59e0b',
    textColor: 'text-amber-400',
    badgeIcon: '🦅',
    bgGradient: 'from-amber-600/20 via-amber-900/10 to-slate-900/80',
    borderColor: 'border-amber-500/40'
  },
  Beta: {
    type: 'Beta',
    name: 'Team Beta (Emerald Cobras)',
    motto: 'Resilience, Strategy & Scientific Rigor',
    themeColor: '#10b981',
    textColor: 'text-emerald-400',
    badgeIcon: '🐍',
    bgGradient: 'from-emerald-600/20 via-emerald-900/10 to-slate-900/80',
    borderColor: 'border-emerald-500/40'
  },
  Omega: {
    type: 'Omega',
    name: 'Team Omega (Sapphire Titans)',
    motto: 'Wisdom, Endurance & Unyielding Focus',
    themeColor: '#3b82f6',
    textColor: 'text-blue-400',
    badgeIcon: '⚡',
    bgGradient: 'from-blue-600/20 via-blue-900/10 to-slate-900/80',
    borderColor: 'border-blue-500/40'
  }
};

/**
 * Equitably assigns a user to Team Alpha, Beta, or Omega
 * Ensures balanced distribution across matches and registrations.
 */
export function assignEquitableTeam(existingMemberCounts?: { Alpha: number; Beta: number; Omega: number }): TeamType {
  if (existingMemberCounts) {
    const { Alpha, Beta, Omega } = existingMemberCounts;
    if (Alpha <= Beta && Alpha <= Omega) return 'Alpha';
    if (Beta <= Alpha && Beta <= Omega) return 'Beta';
    return 'Omega';
  }

  // Random equitable 1/3 distribution
  const roll = Math.random();
  if (roll < 0.334) return 'Alpha';
  if (roll < 0.667) return 'Beta';
  return 'Omega';
}

export const INITIAL_TEAM_SCORES: TeamScore[] = [
  {
    team: 'Alpha',
    name: 'Team Alpha',
    color: '#f59e0b',
    badge: '🦅',
    totalXP: 42850,
    accuracyRate: 88.4,
    memberCount: 142,
    leadSchool: 'Loyola Jesuit College, Abuja'
  },
  {
    team: 'Beta',
    name: 'Team Beta',
    color: '#10b981',
    badge: '🐍',
    totalXP: 41920,
    accuracyRate: 87.1,
    memberCount: 139,
    leadSchool: "Federal Government Boys' College, Apo"
  },
  {
    team: 'Omega',
    name: 'Team Omega',
    color: '#3b82f6',
    badge: '⚡',
    totalXP: 43100,
    accuracyRate: 89.2,
    memberCount: 145,
    leadSchool: 'Deeper Life High School, Abuja'
  }
];
