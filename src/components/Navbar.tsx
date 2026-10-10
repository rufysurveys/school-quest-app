import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  BookOpen, 
  Users, 
  School, 
  Home, 
  Calendar, 
  Settings, 
  HelpCircle,
  ChevronDown,
  User,
  LogOut
} from 'lucide-react';
import { OperatingMode, UserProfile } from '../types';
import { TEAMS_INFO } from '../data/teams';
import { getTierForXP, getStreakMultiplier } from '../utils/gamification';

interface NavbarProps {
  currentMode: OperatingMode;
  onSelectMode: (mode: OperatingMode) => void;
  user: UserProfile;
  onOpenSignUp: () => void;
  onOpenWelcome: () => void;
  onOpenAdmin: () => void;
  onOpenSchedule: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  user,
  onOpenSignUp,
  onOpenWelcome,
  onOpenAdmin,
  onOpenSchedule,
  onLogout
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userTeam = TEAMS_INFO[user.team || 'Alpha'];
  const userTier = getTierForXP(user.xp);
  const streakMult = getStreakMultiplier(user.streak);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          {/* Logo & 3D Emblem */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onOpenWelcome}>
            <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-500 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center relative overflow-hidden">
                <span className="text-xl">🏆</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none" />
              </div>
            </div>
            
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900 font-display">
                  FCT ABUJA QUEST
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  SS1-SS3
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] md:max-w-[260px]">
                {user.school}
              </p>
            </div>
          </div>

          {/* Navigation Modes Switcher (Centered / Responsive) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            {/* Mode 1: Inter-Team (Default) */}
            <button
              onClick={() => onSelectMode('inter_team')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentMode === 'inter_team'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
              title="Equitable Tri-Team Battle (Alpha vs Beta vs Omega)"
            >
              <Users className="w-3.5 h-3.5 text-amber-800" />
              <span>Inter-Team (Default)</span>
            </button>

            {/* Mode 2: Inter-School */}
            <button
              onClick={() => onSelectMode('inter_school')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentMode === 'inter_school'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
              title="Compete against other schools in Abuja"
            >
              <School className="w-3.5 h-3.5" />
              <span>Inter-School</span>
            </button>

            {/* Mode 3: Intra-School */}
            <button
              onClick={() => onSelectMode('intra_school')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentMode === 'intra_school'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
              title="Within your school: Class vs Class"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Intra-School</span>
            </button>

            {/* Mode 4: Individual League */}
            <button
              onClick={() => onSelectMode('individual_league')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentMode === 'individual_league'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
              title="Individual Academic Championship"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>League</span>
            </button>

            {/* Mode 5: Practice & Mastery Hub */}
            <button
              onClick={() => onSelectMode('practice_hub')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentMode === 'practice_hub'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
              title="Practice & Topic Jumping"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Practice (Topic Jump)</span>
            </button>
          </nav>

          {/* User Gamification Stats & Profile Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Daily Streak Tracker */}
            <div 
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold select-none cursor-help shadow-sm"
              title={`Consecutive practice days! Active XP multiplier: ${streakMult}x`}
            >
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>{user.streak}</span>
              <span className="hidden sm:inline text-[10px] text-amber-700/80">({streakMult}x)</span>
            </div>

            {/* XP Counter */}
            <div 
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black select-none shadow-sm"
              title="Total Accumulated Academic XP"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{user.xp.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-600/80 font-normal">XP</span>
            </div>

            {/* Team Chip */}
            <div 
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 shadow-sm"
              title={`Assigned equitable team: ${userTeam.name}`}
            >
              <span>{userTeam.badgeIcon}</span>
              <span>{user.team}</span>
            </div>

            {/* User Profile & Options Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 shadow-sm transition"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <span className="font-semibold block truncate max-w-[100px] text-slate-900">{user.name}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{user.role} • {user.classLevel}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 text-xs space-y-1 z-50 animate-fadeIn">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-2">
                    <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{user.school}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200">
                      <span className="text-amber-700 font-bold">{userTier.name}</span>
                      <span className="text-slate-800 font-bold">Team {user.team} {userTeam.badgeIcon}</span>
                    </div>
                  </div>

                  {/* Mobile Mode Switchers */}
                  <div className="lg:hidden border-b border-slate-100 pb-2 mb-2 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Competition Modes</div>
                    <button
                      onClick={() => { onSelectMode('inter_team'); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-amber-700 font-medium"
                    >
                      <Users className="w-3.5 h-3.5" /> Inter-Team (Default)
                    </button>
                    <button
                      onClick={() => { onSelectMode('inter_school'); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-medium"
                    >
                      <School className="w-3.5 h-3.5" /> Inter-School
                    </button>
                    <button
                      onClick={() => { onSelectMode('intra_school'); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-cyan-700 font-medium"
                    >
                      <Home className="w-3.5 h-3.5" /> Intra-School
                    </button>
                    <button
                      onClick={() => { onSelectMode('individual_league'); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-purple-700 font-medium"
                    >
                      <Trophy className="w-3.5 h-3.5" /> Individual League
                    </button>
                    <button
                      onClick={() => { onSelectMode('practice_hub'); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-green-700 font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Practice (Topic Jump)
                    </button>
                  </div>

                  <button
                    onClick={() => { onOpenSignUp(); setDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Profile & School Settings</span>
                  </button>

                  <button
                    onClick={() => { onOpenSchedule(); setDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Championship Schedule</span>
                  </button>

                  <button
                    onClick={() => { onOpenWelcome(); setDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Welcome Message & Guide</span>
                  </button>

                  <button
                    onClick={() => { onOpenAdmin(); setDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Settings className="w-3.5 h-3.5 text-purple-600" />
                    <span>Teacher / Admin Portal</span>
                  </button>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => { onLogout(); setDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out & Reset</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
