import React from 'react';
import { Calendar, Clock, ShieldCheck, Users, Play } from 'lucide-react';
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
      <div className="bg-gradient-to-r from-blue-50/70 via-white to-cyan-50/70 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Abuja Secondary Championship Fixtures</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
              Official Match Timetable & Tournaments
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-xl">
              Scheduled inter-school and inter-team clashes. Joining any match automatically places you into <strong className="text-amber-700">Team Alpha</strong>, <strong className="text-emerald-700">Team Beta</strong>, or <strong className="text-blue-700">Team Omega</strong> for equitable competition.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
            <span className="text-xs text-slate-500 block mb-1 font-medium">Your Team Assignment:</span>
            <span className="text-sm font-bold text-slate-900">
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
              className={`bg-white border rounded-3xl p-5 md:p-6 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                isLive
                  ? 'border-emerald-400 ring-2 ring-emerald-400/20 shadow-md'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {isLive ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-[10px] uppercase flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" /> Live Match Arena
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                      Upcoming Match
                    </span>
                  )}

                  <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                    {match.classLevel} • {match.subject}
                  </span>

                  {match.isProctored ? (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Proctored AI Session
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                      Regular Format
                    </span>
                  )}
                </div>

                {/* Match Title */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 font-display">
                    {match.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {match.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {match.time} ({match.durationMinutes} mins)
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {match.registeredCount} Contenders
                    </span>
                  </div>
                </div>

                {/* Tri-Team Live Points Preview */}
                {isLive && (
                  <div className="pt-2 flex items-center gap-4 text-xs font-semibold">
                    <span className="text-amber-800">🦅 Alpha: {match.alphaPoints}</span>
                    <span className="text-emerald-800">🐍 Beta: {match.betaPoints}</span>
                    <span className="text-blue-800">⚡ Omega: {match.omegaPoints}</span>
                  </div>
                )}

              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => onJoinMatch(match)}
                  className={`w-full md:w-auto px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-sm ${
                    isLive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
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
