import React from 'react';
import { Calendar, Clock, ShieldCheck, Users, Play, CheckCircle2, Trophy } from 'lucide-react';
import { UPCOMING_MATCHES } from '../data/leaderboards';
import { TEAMS_INFO } from '../data/teams';
import { ScheduledMatch, UserProfile } from '../types';

interface ScheduleViewProps {
  user: UserProfile;
  onJoinMatch: (match: ScheduledMatch) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  user,
  onJoinMatch
}) => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Schedule Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-blue-500/30 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Abuja Secondary Championship Fixtures</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Official Match Timetable & Tournaments
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Scheduled inter-school and inter-team clashes. Joining any match automatically places you into <strong className="text-amber-400">Team Alpha</strong>, <strong className="text-emerald-400">Team Beta</strong>, or <strong className="text-blue-400">Team Omega</strong> for equitable competition.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Your Team Assignment:</span>
            <span className="text-sm font-bold text-amber-400">
              {TEAMS_INFO[user.team].badgeIcon} {TEAMS_INFO[user.team].name}
            </span>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {UPCOMING_MATCHES.map((match) => {
          const isLive = match.status === 'live';

          return (
            <div
              key={match.id}
              className={`bg-slate-900/90 border rounded-3xl p-5 md:p-6 transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                isLive
                  ? 'border-emerald-500/60 shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {isLive ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-slate-950" /> Live Match Arena
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 font-bold text-[10px] uppercase">
                      Upcoming Match
                    </span>
                  )}

                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
                    {match.classLevel} • {match.subject}
                  </span>

                  {match.isProctored ? (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Proctored AI Session
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 font-medium">
                      Regular Format
                    </span>
                  )}
                </div>

                {/* Match Title */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {match.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> {match.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {match.time} ({match.durationMinutes} mins)
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" /> {match.registeredCount} Contenders
                    </span>
                  </div>
                </div>

                {/* Tri-Team Live Points Preview */}
                {isLive && (
                  <div className="pt-2 flex items-center gap-4 text-xs">
                    <span className="font-bold text-amber-400">🦅 Alpha: {match.alphaPoints}</span>
                    <span className="font-bold text-emerald-400">🐍 Beta: {match.betaPoints}</span>
                    <span className="font-bold text-blue-400">⚡ Omega: {match.omegaPoints}</span>
                  </div>
                )}

              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => onJoinMatch(match)}
                  className={`w-full md:w-auto px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg ${
                    isLive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-950/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isLive ? 'Join Live Arena' : 'Preview Match Room'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
