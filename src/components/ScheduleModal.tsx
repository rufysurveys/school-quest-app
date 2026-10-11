import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  School, 
  Home, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  CheckCircle2,
  Share2
} from 'lucide-react';
import { UserProfile, ScheduledMatch, ClassLevel } from '../types';
import { createTournamentApi } from '../utils/api';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onMatchCreated: (match: ScheduledMatch) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  user,
  onMatchCreated
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('General Mathematics');
  const [scope, setScope] = useState<'inter_team' | 'inter_school' | 'intra_school'>('inter_team');
  const [intraType, setIntraType] = useState('SS1 vs SS2 Clash');
  const [classLevel, setClassLevel] = useState<ClassLevel>('SS1');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [isProctored, setIsProctored] = useState(false);
  const [generatedMatch, setGeneratedMatch] = useState<{ match: ScheduledMatch; roomLink: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createTournamentApi({
      title: title.trim() || `${user.school} ${scope === 'inter_team' ? 'Tri-Team Clash' : 'Championship'}`,
      subject,
      scope,
      intraType: scope === 'intra_school' ? intraType : null,
      classLevel,
      durationMinutes,
      isProctored,
      creatorId: user.id,
      creatorName: user.name
    });

    if (response && response.tournament) {
      setGeneratedMatch({
        match: response.tournament,
        roomLink: response.roomLink
      });
      onMatchCreated(response.tournament);
    }
  };

  const handleCopyLink = () => {
    if (!generatedMatch) return;
    navigator.clipboard.writeText(generatedMatch.roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-[32px] shadow-2xl p-6 sm:p-8 text-slate-800 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!generatedMatch ? (
          <div>
            <div className="mb-6 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block">
                Host An Academic Competition
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Schedule a Match Room (Up to 1,000 Players)
              </h3>
              <p className="text-xs text-slate-500">
                Created competitions will appear on the dashboard with a shareable room link for remote joiners.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Competition Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tournament Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Abuja STEM Grand Prix or SS2 Science vs Commercial"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs"
                />
              </div>

              {/* Scope Selection (Inter-Team is DEFAULT) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Competition Scope:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setScope('inter_team')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 text-center ${
                      scope === 'inter_team'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Inter-Team (Default)</span>
                    <span className="text-[10px] opacity-80">Alpha / Beta / Omega</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScope('inter_school')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 text-center ${
                      scope === 'inter_school'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <School className="w-4 h-4" />
                    <span>Inter-School</span>
                    <span className="text-[10px] opacity-80">Abuja Schools</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScope('intra_school')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 text-center ${
                      scope === 'intra_school'
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Intra-School</span>
                    <span className="text-[10px] opacity-80">Within School</span>
                  </button>
                </div>
              </div>

              {/* If Intra-School: Select Match format */}
              {scope === 'intra_school' && (
                <div className="p-3.5 bg-cyan-50 border border-cyan-200 rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-cyan-900">
                    Intra-School Battle Setup:
                  </label>
                  <select
                    value={intraType}
                    onChange={(e) => setIntraType(e.target.value)}
                    className="w-full bg-white border border-cyan-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="SS1 vs SS2 Clash">Class Battle: SS1 vs SS2</option>
                    <option value="JSS2 vs JSS3 Clash">Class Battle: JSS2 vs JSS3</option>
                    <option value="Science vs Commercial (SS3)">Stream Battle: Science vs Commercial (SS3)</option>
                    <option value="Science vs Art Stream">Stream Battle: Science vs Art</option>
                    <option value="Inter-House Academic Derby">Inter-House Academic Derby</option>
                  </select>
                </div>
              )}

              {/* Subject & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Curriculum Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="General Mathematics">General Mathematics</option>
                    <option value="English Studies">English Studies</option>
                    <option value="Biology">Biology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Physics">Physics</option>
                    <option value="Civic Education">Civic Education</option>
                    <option value="Economics">Economics</option>
                    <option value="Computer Studies">Computer Studies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Class (JSS1 - SS3)
                  </label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="SS1">SS1</option>
                    <option value="SS2">SS2</option>
                    <option value="SS3">SS3</option>
                    <option value="JSS1">JSS1</option>
                    <option value="JSS2">JSS2</option>
                    <option value="JSS3">JSS3</option>
                  </select>
                </div>
              </div>

              {/* Duration & Proctored Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 mt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">Strict Proctored</label>
                    <span className="text-[10px] text-slate-500">Camera & Full-Screen</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isProctored}
                    onChange={(e) => setIsProctored(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create & Generate Room Link</span>
              </button>

            </form>
          </div>
        ) : (
          /* Success Screen with Room Link */
          <div className="text-center space-y-4 py-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Competition Room Created!
              </h3>
              <p className="text-xs text-slate-500">
                Share this link with up to 1,000 students to join remotely.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">Room Code:</span>
                <span className="font-mono font-black text-emerald-700 text-base">{generatedMatch.match.roomCode}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">Room Scope:</span>
                <span className="font-semibold text-slate-900 capitalize">{(generatedMatch.match.scope || 'inter_team').replace('_', '-')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">Capacity:</span>
                <span className="font-semibold text-slate-900">Up to 1,000 Remote Players</span>
              </div>
            </div>

            {/* Room Link Box */}
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-2">
              <input
                type="text"
                readOnly
                value={generatedMatch.roomLink}
                className="bg-transparent text-xs text-emerald-950 font-mono w-full truncate focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Done & Return to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
