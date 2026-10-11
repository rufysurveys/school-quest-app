import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Search, 
  Users, 
  School, 
  Home, 
  ShieldCheck,
  User,
  Sparkles
} from 'lucide-react';
import { OperatingMode, UserProfile } from '../types';
import { INITIAL_SCHOOL_RANKINGS, INITIAL_STUDENT_LEADERBOARD } from '../data/leaderboards';
import { INITIAL_TEAM_SCORES, TEAMS_INFO } from '../data/teams';

interface LeaderboardProps {
  currentMode: OperatingMode;
  onSelectMode: (mode: OperatingMode) => void;
  user: UserProfile;
  onViewUserProfile: (name: string) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentMode,
  onSelectMode,
  user,
  onViewUserProfile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Government' | 'Federal Unity' | 'Private'>('All');

  const filteredSchools = INITIAL_SCHOOL_RANKINGS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredStudents = INITIAL_STUDENT_LEADERBOARD.filter(std => {
    return std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           std.school.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const intraSchoolClasses = [
    { name: `SS1 vs SS2 Battle Stream`, points: 34500, students: 38, accuracy: 91.4, rank: 1, type: 'Class Clash' },
    { name: `SS3 Science vs Commercial Stream`, points: 32100, students: 35, accuracy: 89.2, rank: 2, type: 'Stream Clash' },
    { name: `JSS2 vs JSS3 Academic Derby`, points: 30800, students: 36, accuracy: 87.8, rank: 3, type: 'Junior Clash' },
    { name: `SS2 - Alpha Stream`, points: 28900, students: 34, accuracy: 86.5, rank: 4, type: 'Inter-Stream' },
    { name: `SS3 - Honours Stream`, points: 27500, students: 32, accuracy: 85.0, rank: 5, type: 'Inter-Stream' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Mode Switcher Pills */}
      <div className="bg-gradient-to-r from-amber-50/70 via-white to-emerald-50/70 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Abuja Academic Championships & Standings (JSS1 - SS3)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
              {currentMode === 'inter_team' && 'Inter-Team Tournament Standings (Default)'}
              {currentMode === 'inter_school' && 'Inter-School Championship Board'}
              {currentMode === 'intra_school' && `Intra-School Leaderboard: ${user.school}`}
              {currentMode === 'individual_league' && 'Individual Student League of Excellence'}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
              Track real-time XP, accuracy percentages, and performance metrics across teams, schools, and individual scholars. Click on any student's name to view their gaming journey and won matches!
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => onSelectMode('inter_team')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                currentMode === 'inter_team'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Inter-Team</span>
            </button>

            <button
              onClick={() => onSelectMode('inter_school')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                currentMode === 'inter_school'
                  ? 'bg-emerald-600 text-white font-black shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Inter-School</span>
            </button>

            <button
              onClick={() => onSelectMode('intra_school')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                currentMode === 'intra_school'
                  ? 'bg-cyan-600 text-white font-black shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Intra-School</span>
            </button>

            <button
              onClick={() => onSelectMode('individual_league')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                currentMode === 'individual_league'
                  ? 'bg-purple-600 text-white font-black shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Individual</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: INTER-TEAM MODE (DEFAULT OPTION) */}
      {currentMode === 'inter_team' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_TEAM_SCORES.map((teamData) => {
              const meta = TEAMS_INFO[teamData.team];
              const isUserTeam = user.team === teamData.team;

              return (
                <div
                  key={teamData.team}
                  className={`relative rounded-3xl p-6 border transition-all bg-white shadow-sm ${
                    isUserTeam
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-slate-200'
                  }`}
                >
                  {isUserTeam && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider shadow-sm">
                      ★ Your Assigned Team
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{meta.badgeIcon}</span>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      {teamData.memberCount} Contenders
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 font-display">
                    {meta.name}
                  </h3>
                  <p className="text-xs text-slate-500 italic mb-4">
                    "{meta.motto}"
                  </p>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Average Team Score:</span>
                      <span className="font-black text-amber-700 text-sm">
                        {Math.round(teamData.totalXP / teamData.memberCount)} pts / member
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Average Accuracy:</span>
                      <span className="font-bold text-emerald-700">
                        {teamData.accuracyRate}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Lead Contributor:</span>
                      <span className="text-[11px] font-semibold text-slate-800 truncate max-w-[150px]">
                        {teamData.leadSchool}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${teamData.team === 'Alpha' ? 'bg-amber-500' : teamData.team === 'Beta' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${(teamData.totalXP / 50000) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900">Fair Average Scoring & Auto-Balancing:</strong> Teams Alpha, Omega, and Beta receive equitably balanced players when joining any scheduled competition. The final team score is calculated as the arithmetic average of all active team members' points.
            </p>
          </div>
        </div>
      )}

      {/* VIEW 2: INTER-SCHOOL MODE */}
      {currentMode === 'inter_school' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-6">
            {filteredSchools[1] && (
              <div className="order-2 md:order-1 bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-2 shadow-sm">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-xl text-slate-600 font-bold">
                  🥈 2nd
                </div>
                <h3 className="font-bold text-slate-900 text-base truncate">{filteredSchools[1].name}</h3>
                <p className="text-xs text-slate-500">{filteredSchools[1].location}</p>
                <div className="pt-2 text-emerald-700 font-black text-lg">
                  {filteredSchools[1].totalXP.toLocaleString()} XP
                </div>
              </div>
            )}

            {filteredSchools[0] && (
              <div className="order-1 md:order-2 bg-gradient-to-t from-amber-50 to-white border-2 border-amber-400 rounded-3xl p-8 text-center space-y-2 transform md:-translate-y-4 shadow-md">
                <Crown className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-sm">
                  🥇 1st
                </div>
                <h3 className="font-black text-slate-900 text-lg truncate font-display">{filteredSchools[0].name}</h3>
                <p className="text-xs text-slate-600">{filteredSchools[0].location}</p>
                <div className="pt-2 text-amber-700 font-black text-2xl">
                  {filteredSchools[0].totalXP.toLocaleString()} XP
                </div>
              </div>
            )}

            {filteredSchools[2] && (
              <div className="order-3 bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-2 shadow-sm">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100/60 flex items-center justify-center text-xl text-amber-800 font-bold">
                  🥉 3rd
                </div>
                <h3 className="font-bold text-slate-900 text-base truncate">{filteredSchools[2].name}</h3>
                <p className="text-xs text-slate-500">{filteredSchools[2].location}</p>
                <div className="pt-2 text-amber-600 font-black text-lg">
                  {filteredSchools[2].totalXP.toLocaleString()} XP
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Secondary School</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 text-center">Active Scholars</th>
                    <th className="py-3.5 px-4 text-right">Avg Accuracy</th>
                    <th className="py-3.5 px-4 text-right">Total XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchools.map((sch) => (
                    <tr key={sch.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">#{sch.rank}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{sch.name}</td>
                      <td className="py-3.5 px-4">{sch.category}</td>
                      <td className="py-3.5 px-4 text-center font-mono">{sch.studentCount}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-700">{sch.accuracyRate}%</td>
                      <td className="py-3.5 px-4 text-right font-black text-amber-700">{sch.totalXP.toLocaleString()} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: INTRA-SCHOOL MODE */}
      {currentMode === 'intra_school' && (
        <div className="space-y-6">
          <div className="bg-white border border-cyan-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">School Roster</p>
              <h3 className="text-lg font-black text-slate-900 font-display">{user.school}</h3>
            </div>
            <span className="text-xs px-3 py-1 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
              Class vs Class / Stream Clashes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intraSchoolClasses.map((item) => (
              <div 
                key={item.name}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-cyan-400 transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-sm">
                    #{item.rank}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200 inline-block mb-1">
                      {item.type}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">{item.students} Contenders • {item.accuracy}% Accuracy</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-cyan-800">{item.points.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Avg Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: INDIVIDUAL LEAGUE (CLICK TO VIEW PROFILE) */}
      {currentMode === 'individual_league' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((std) => (
              <div
                key={std.id}
                onClick={() => onViewUserProfile(std.name)}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-purple-400 hover:shadow-md cursor-pointer transition shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center font-black text-sm">
                    #{std.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 hover:text-purple-700 transition">{std.name}</h4>
                      <span className="text-xs text-amber-700 font-bold flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-amber-500" /> {std.streak}d
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                      {std.school} ({std.classLevel})
                    </p>
                    <span className="text-[10px] text-purple-700 font-semibold">
                      {std.badge} • Click to View Journey 👤
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-purple-700 block">
                    {std.xp.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {std.accuracy}% Accuracy
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
