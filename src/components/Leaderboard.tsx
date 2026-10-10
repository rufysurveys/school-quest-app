import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Search, 
  Users, 
  School, 
  Home, 
  Award, 
  Medal, 
  Filter, 
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { OperatingMode, UserProfile, SchoolRanking, StudentLeaderboardEntry } from '../types';
import { INITIAL_SCHOOL_RANKINGS, INITIAL_STUDENT_LEADERBOARD } from '../data/leaderboards';
import { INITIAL_TEAM_SCORES, TEAMS_INFO } from '../data/teams';

interface LeaderboardProps {
  currentMode: OperatingMode;
  onSelectMode: (mode: OperatingMode) => void;
  user: UserProfile;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentMode,
  onSelectMode,
  user
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Government' | 'Federal Unity' | 'Private'>('All');

  // Filter schools
  const filteredSchools = INITIAL_SCHOOL_RANKINGS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filter students
  const filteredStudents = INITIAL_STUDENT_LEADERBOARD.filter(std => {
    return std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           std.school.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Intra-school mock data for user's school
  const intraSchoolClasses = [
    { name: `${user.classLevel} - Diamond Stream`, points: 34500, students: 38, accuracy: 91.4, rank: 1 },
    { name: `${user.classLevel} - Emerald Stream`, points: 32100, students: 35, accuracy: 89.2, rank: 2 },
    { name: `${user.classLevel} - Gold Stream`, points: 30800, students: 36, accuracy: 87.8, rank: 3 },
    { name: `SS2 - Alpha Stream`, points: 28900, students: 34, accuracy: 86.5, rank: 4 },
    { name: `SS3 - Honours Stream`, points: 27500, students: 32, accuracy: 85.0, rank: 5 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Mode Switcher Pills */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Abuja Academic Championships & Standings</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {currentMode === 'inter_team' && 'Inter-Team Tournament Standings (Default)'}
              {currentMode === 'inter_school' && 'Inter-School Championship Board'}
              {currentMode === 'intra_school' && `Intra-School Leaderboard: ${user.school}`}
              {currentMode === 'individual_league' && 'Individual Student League of Excellence'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              Track real-time XP, accuracy percentages, and performance metrics across teams, schools, and individual scholars.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => onSelectMode('inter_team')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                currentMode === 'inter_team'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Inter-Team</span>
            </button>

            <button
              onClick={() => onSelectMode('inter_school')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                currentMode === 'inter_school'
                  ? 'bg-emerald-600 text-white font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Inter-School</span>
            </button>

            <button
              onClick={() => onSelectMode('intra_school')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                currentMode === 'intra_school'
                  ? 'bg-cyan-600 text-white font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Intra-School</span>
            </button>

            <button
              onClick={() => onSelectMode('individual_league')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                currentMode === 'individual_league'
                  ? 'bg-purple-600 text-white font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Individual</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          VIEW 1: INTER-TEAM MODE (DEFAULT OPTION)
          Team Alpha vs Team Beta vs Team Omega
          ============================================================ */}
      {currentMode === 'inter_team' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_TEAM_SCORES.map((teamData) => {
              const meta = TEAMS_INFO[teamData.team];
              const isUserTeam = user.team === teamData.team;

              return (
                <div
                  key={teamData.team}
                  className={`relative rounded-3xl p-6 border transition-all ${
                    isUserTeam
                      ? `${meta.borderColor} bg-slate-900 shadow-xl shadow-${teamData.team === 'Alpha' ? 'amber' : teamData.team === 'Beta' ? 'emerald' : 'blue'}-950/30 ring-2 ring-emerald-500/40`
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  {isUserTeam && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                      ★ Your Assigned Team
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{meta.badgeIcon}</span>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                      {teamData.memberCount} Scholars
                    </span>
                  </div>

                  <h3 className={`text-lg font-black ${meta.textColor}`}>
                    {meta.name}
                  </h3>
                  <p className="text-xs text-slate-400 italic mb-4">
                    "{meta.motto}"
                  </p>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Total Team XP:</span>
                      <span className="font-black text-amber-400 text-sm">
                        {teamData.totalXP.toLocaleString()} XP
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Average Accuracy:</span>
                      <span className="font-bold text-emerald-400">
                        {teamData.accuracyRate}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Lead Contributor:</span>
                      <span className="text-[11px] font-medium text-slate-300 truncate max-w-[150px]">
                        {teamData.leadSchool}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${teamData.team === 'Alpha' ? 'bg-amber-500' : teamData.team === 'Beta' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${(teamData.totalXP / 50000) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Equitable Balancing Explanatory Notice */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Equitable Roster Distribution:</strong> To ensure fairness in inter-school competitions, participants are distributed equally across Team Alpha, Beta, and Omega upon joining any scheduled match or tournament session. All members contribute directly to their team's live championship standings.
            </p>
          </div>

        </div>
      )}

      {/* ============================================================
          VIEW 2: INTER-SCHOOL MODE
          Rankings of Abuja Secondary Schools with 1st, 2nd, 3rd Podiums
          ============================================================ */}
      {currentMode === 'inter_school' && (
        <div className="space-y-8">
          
          {/* Top 3 Podiums */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-6">
            
            {/* 2nd Place */}
            {filteredSchools[1] && (
              <div className="order-2 md:order-1 bg-gradient-to-t from-slate-900 via-slate-800/80 to-slate-800 border border-slate-700 rounded-3xl p-6 text-center space-y-2 transform hover:-translate-y-1 transition shadow-xl">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-700 flex items-center justify-center text-xl text-slate-300 font-bold">
                  🥈 2nd
                </div>
                <h3 className="font-bold text-white text-base truncate">{filteredSchools[1].name}</h3>
                <p className="text-xs text-slate-400">{filteredSchools[1].location}</p>
                <div className="pt-2 text-emerald-400 font-black text-lg">
                  {filteredSchools[1].totalXP.toLocaleString()} XP
                </div>
                <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
                  {filteredSchools[1].accuracyRate}% Accuracy
                </span>
              </div>
            )}

            {/* 1st Place (Champion) */}
            {filteredSchools[0] && (
              <div className="order-1 md:order-2 bg-gradient-to-t from-slate-900 via-amber-950/40 to-slate-800 border-2 border-amber-500/60 rounded-3xl p-8 text-center space-y-2 transform md:-translate-y-4 shadow-2xl shadow-amber-500/10">
                <Crown className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl font-black">
                  🥇 1st
                </div>
                <h3 className="font-black text-white text-lg truncate">{filteredSchools[0].name}</h3>
                <p className="text-xs text-slate-300">{filteredSchools[0].location}</p>
                <div className="pt-2 text-amber-400 font-black text-2xl">
                  {filteredSchools[0].totalXP.toLocaleString()} XP
                </div>
                <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  {filteredSchools[0].badge}
                </span>
              </div>
            )}

            {/* 3rd Place */}
            {filteredSchools[2] && (
              <div className="order-3 bg-gradient-to-t from-slate-900 via-slate-800/80 to-slate-800 border border-amber-900/40 rounded-3xl p-6 text-center space-y-2 transform hover:-translate-y-1 transition shadow-xl">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-900/60 flex items-center justify-center text-xl text-amber-200 font-bold">
                  🥉 3rd
                </div>
                <h3 className="font-bold text-white text-base truncate">{filteredSchools[2].name}</h3>
                <p className="text-xs text-slate-400">{filteredSchools[2].location}</p>
                <div className="pt-2 text-amber-500 font-black text-lg">
                  {filteredSchools[2].totalXP.toLocaleString()} XP
                </div>
                <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
                  {filteredSchools[2].accuracyRate}% Accuracy
                </span>
              </div>
            )}

          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schools by name or area..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
              {(['All', 'Private', 'Federal Unity', 'Government'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                    categoryFilter === cat ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Complete Schools Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Secondary School</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 text-center">Active Scholars</th>
                    <th className="py-3.5 px-4 text-right">Avg Accuracy</th>
                    <th className="py-3.5 px-4 text-right">Total XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredSchools.map((sch) => {
                    const isUserSchool = user.school === sch.name;
                    return (
                      <tr 
                        key={sch.id}
                        className={`hover:bg-slate-800/40 transition ${
                          isUserSchool ? 'bg-emerald-950/30 border-l-4 border-l-emerald-500' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          #{sch.rank}
                        </td>
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-bold text-white block">{sch.name}</span>
                            <span className="text-[11px] text-slate-400">{sch.location}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700">
                            {sch.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {sch.studentCount}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                          {sch.accuracyRate}%
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-amber-400">
                          {sch.totalXP.toLocaleString()} XP
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================
          VIEW 3: INTRA-SCHOOL MODE (Within user's school)
          ============================================================ */}
      {currentMode === 'intra_school' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">School Roster</p>
              <h3 className="text-lg font-black text-white">{user.school}</h3>
            </div>
            <span className="text-xs px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
              Class vs Class Arena
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intraSchoolClasses.map((item) => (
              <div 
                key={item.name}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-cyan-500/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    #{item.rank}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.students} Active Students • {item.accuracy}% Accuracy</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-cyan-400">{item.points.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block">Class XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 4: INDIVIDUAL LEAGUE
          Individual student champions across Abuja
          ============================================================ */}
      {currentMode === 'individual_league' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((std) => (
              <div
                key={std.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-purple-500/40 transition shadow-lg"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-black text-sm">
                    #{std.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{std.name}</h4>
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-amber-500" /> {std.streak}d
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {std.school} ({std.classLevel})
                    </p>
                    <span className="text-[10px] text-purple-400 font-medium">
                      {std.badge}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-purple-400 block">
                    {std.xp.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">
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
