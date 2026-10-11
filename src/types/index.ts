export type UserRole = 'student' | 'teacher';

export type ClassLevel = 'SS1' | 'SS2' | 'SS3' | 'JSS1' | 'JSS2' | 'JSS3';

export type Department = 'Science' | 'Humanities / Arts' | 'Business / Commercial' | 'Technology / Trade';

export type TeamType = 'Alpha' | 'Beta' | 'Omega';

export type OperatingMode = 
  | 'inter_team'         // Default: Alpha vs Beta vs Omega
  | 'inter_school'       // School vs School across Abuja
  | 'intra_school'       // Within user's school (Class vs Class)
  | 'individual_league'  // Individual student XP championship
  | 'practice_hub';      // Topic-by-topic self paced mastery

export type ExamMode = 'practice' | 'regular' | 'proctored';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  school: string;
  isCustomSchool?: boolean;
  classLevel: ClassLevel;
  department: Department;
  classType?: 'Science' | 'Art' | 'Commercial';
  avatarId?: string;
  avatarCustomUrl?: string;
  teachingSubject?: string;
  xp: number;
  streak: number;
  lastActiveDate: string;
  level: number;
  badges: string[];
  team: TeamType;
  bookmarks: string[]; // Question IDs
  isVerified: boolean;
  verificationCode?: string;
  verificationToken?: string;
  matchesPlayed?: number;
  matchesWon?: number;
}

export interface Question {
  id: string;
  subject: string;
  classLevel: ClassLevel;
  term: 1 | 2 | 3;
  week?: number;
  topic: string;
  subtopic?: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export interface TeamScore {
  team: TeamType;
  name: string;
  color: string;
  badge: string;
  totalXP: number;
  accuracyRate: number;
  memberCount: number;
  leadSchool: string;
}

export interface SchoolRanking {
  id: string;
  name: string;
  shortName: string;
  location: string;
  rank: number;
  totalXP: number;
  studentCount: number;
  accuracyRate: number;
  category: 'Government' | 'Federal Unity' | 'Private';
  badge: string;
}

export interface StudentLeaderboardEntry {
  id: string;
  name: string;
  school: string;
  classLevel: ClassLevel;
  team: TeamType;
  role: UserRole;
  xp: number;
  accuracy: number;
  streak: number;
  rank: number;
  badge: string;
  avatarUrl?: string;
}

export interface ScheduledMatch {
  id: string;
  title: string;
  subject: string;
  classLevel: ClassLevel;
  term: 1 | 2 | 3;
  questionCount: number;
  durationMinutes: number;
  date: string;
  time: string;
  isProctored: boolean;
  status: 'upcoming' | 'live' | 'completed';
  registeredCount: number;
  alphaPoints: number;
  betaPoints: number;
  omegaPoints: number;
  winnerTeam?: TeamType;
  scope?: OperatingMode;
  roomCode?: string;
  maxParticipants?: number;
  intraFilter?: string;
  schoolA?: string;
  schoolB?: string;
}
