import React from 'react';
import { 
  X, 
  Trophy, 
  Flame, 
  Award, 
  School, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Medal,
  Clock
} from 'lucide-react';
import { UserProfile } from '../types';
import { getAvatarById } from '../data/avatars';
import { TEAMS_INFO } from '../data/teams';
import { getTierForXP } from '../utils/gamification';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  if (!isOpen) return null;

  const avatar = getAvatarById(user.avatarId || 'ryu');
  const userTeam = TEAMS_INFO[user.team || 'Alpha'];
  const userTier = getTierForXP(user.xp);

  // Simulated match journey history
  const matchHistory = [
    {
      id: 'm-1',
      title: 'FCT All-Schools STEM Super Clash',
      date: 'Yesterday',
      scope: 'Inter-Team',
      team: 'Alpha',
      score: 1350,
      accuracy: 94,
      winner: 'Team Alpha (Won 🏆)'
    },
    {
      id: 'm-2',
      title: 'Abuja Regional English & Oratory Derby',
      date: '3 days ago',
      scope: 'Inter-School',
      team: 'Beta',
      score: 1100,
      accuracy: 88,
      winner: 'Loyola Jesuit College (Won 🏆)'
    },
    {
      id: 'm-3',
      title: 'Intra-School Stream Clash: Science vs Commercial',
      date: 'Last week',
      scope: 'Intra-School',
      team: 'Omega',
      score: 1420,
      accuracy: 96,
      winner: 'Science Stream (Won 🏆)'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[32px] shadow-2xl p-6 sm:p-8 text-slate-800 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
          
          {/* Avatar / Photo */}
          <div className="relative">
            {user.avatarCustomUrl ? (
              <img
                src={user.avatarCustomUrl}
                alt={user.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-emerald-500 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-600 to-slate-900 border-4 border-amber-400 flex flex-col items-center justify-center text-white shadow-md relative overflow-hidden">
                <span className="text-4xl">{avatar.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 mt-1">
                  {avatar.name}
                </span>
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow">
              Lvl {user.level}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                {user.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {user.role === 'teacher' ? 'Instructor 👨‍🏫' : 'Student 🎓'}
              </span>
            </div>

            <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1 font-medium">
              <School className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.school}</span>
            </p>

            {user.role === 'student' ? (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {user.classLevel || 'SS1'}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200">
                  Class Type: {user.classType || 'Science'}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                  {userTeam.name}
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Subject Specialist: <strong className="text-slate-800">{user.teachingSubject || 'Mathematics'}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Academic Stats Podia */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-center">
            <span className="text-xl font-black text-amber-800">{user.xp.toLocaleString()}</span>
            <p className="text-[11px] text-amber-700 font-medium">Total XP</p>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <span className="text-xl font-black text-emerald-800">{user.streak} Days</span>
            <p className="text-[11px] text-emerald-700 font-medium">Daily Streak 🔥</p>
          </div>
          <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-center">
            <span className="text-xl font-black text-blue-800">14 Matches</span>
            <p className="text-[11px] text-blue-700 font-medium">Tournaments</p>
          </div>
          <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-center">
            <span className="text-xl font-black text-purple-800">8 Trophies</span>
            <p className="text-[11px] text-purple-700 font-medium">Victories Won</p>
          </div>
        </div>

        {/* Gamer Journey & Match History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> Recent Gaming Journey & Match History
            </h4>
            <span className="text-[11px] text-emerald-700 font-bold">Fastest Finger ×3 ⚡</span>
          </div>

          <div className="space-y-2">
            {matchHistory.map((match) => (
              <div
                key={match.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition text-xs"
              >
                <div className="space-y-0.5">
                  <h5 className="font-bold text-slate-900">{match.title}</h5>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{match.date}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{match.scope}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{match.winner}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 text-sm">+{match.score} pts</span>
                  <span className="text-[11px] text-slate-500 block">{match.accuracy}% Accuracy</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Earned */}
        <div className="pt-6 mt-6 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Medal className="w-3.5 h-3.5 text-emerald-600" /> Badges & Honors
          </h4>
          <div className="flex flex-wrap gap-2">
            {(user.badges || []).map((badge) => (
              <span
                key={badge}
                className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold"
              >
                {badge}
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600" /> Fastest Finger Winner
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
