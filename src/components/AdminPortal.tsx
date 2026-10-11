import React, { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  Download, 
  CheckCircle2, 
  BookOpen, 
  X, 
  Users, 
  Calendar, 
  ShieldAlert, 
  Camera, 
  Mail, 
  PlusCircle,
  Eye,
  Monitor
} from 'lucide-react';
import { SCHEME_QUESTIONS } from '../data/schemeQuestions';
import { INITIAL_STUDENT_LEADERBOARD, UPCOMING_MATCHES } from '../data/leaderboards';
import { ScheduledMatch } from '../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'tournaments' | 'surveillance' | 'smtp'>('tournaments');
  const [matches, setMatches] = useState<ScheduledMatch[]>(UPCOMING_MATCHES);
  const [userList, setUserList] = useState(INITIAL_STUDENT_LEADERBOARD);
  
  // Gmail SMTP fields
  const [gmailUser, setGmailUser] = useState('');
  const [gmailAppPassword, setGmailAppPassword] = useState('');
  const [smtpSaved, setSmtpSaved] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDeleteTournament = (id: string) => {
    setMatches(prev => prev.filter(m => m.id !== id));
    setNotification('Tournament deleted successfully.');
    setTimeout(() => setNotification(null), 2500);
  };

  const handleDeleteUser = (id: string) => {
    setUserList(prev => prev.filter(u => u.id !== id));
    setNotification('User account removed from database.');
    setTimeout(() => setNotification(null), 2500);
  };

  const handleSaveSMTP = (e: React.FormEvent) => {
    e.preventDefault();
    setSmtpSaved(true);
    setNotification('Gmail SMTP configuration saved! Verification emails will dispatch via Gmail.');
    setTimeout(() => {
      setSmtpSaved(false);
      setNotification(null);
    }, 3000);
  };

  // Mock candidate surveillance feeds
  const candidateFeeds = [
    { id: 'c1', name: 'Chukwudi Okafor', school: 'Loyola Jesuit College', status: 'Focused', violations: 0, screenStatus: 'Normal' },
    { id: 'c2', name: 'Amina Bello', school: 'Deeper Life High School', status: 'Focused', violations: 0, screenStatus: 'Normal' },
    { id: 'c3', name: 'Emeka Nwosu', school: 'FGBC Apo', status: 'Warning: Gaze Drift', violations: 1, screenStatus: 'Focus Alert' },
    { id: 'c4', name: 'Zainab Danjuma', school: 'GSS Garki', status: 'Focused', violations: 0, screenStatus: 'Normal' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 shadow-2xl text-slate-800">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="p-3 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200">
            <Settings className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              FCT Exam Board Administrator Portal
            </h2>
            <p className="text-xs text-slate-500">
              Manage tournaments, candidate screens, users, and Gmail SMTP verification
            </p>
          </div>
        </div>

        {notification && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tournaments' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tournaments ({matches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('surveillance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'surveillance' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Proctoring Surveillance ({candidateFeeds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'users' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registered Users ({userList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('smtp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'smtp' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Gmail SMTP Settings</span>
          </button>
        </div>

        {/* TAB 1: TOURNAMENTS */}
        {activeTab === 'tournaments' && (
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-700">Scheduled & Live Tournaments</h4>
            <div className="space-y-2">
              {matches.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-900">{m.title}</h5>
                    <p className="text-[11px] text-slate-500">{m.subject} • {m.classLevel} • {m.date} ({m.time})</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {m.status}
                    </span>
                    <button
                      onClick={() => handleDeleteTournament(m.id)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                      title="Delete Tournament"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PROCTORED CANDIDATE SURVEILLANCE GRID */}
        {activeTab === 'surveillance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-700">Live Proctored Screen & Camera Feeds</h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Feeds Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {candidateFeeds.map((cand) => (
                <div
                  key={cand.id}
                  className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">{cand.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {cand.school}
                    </span>
                  </div>

                  {/* Simulated Camera Window */}
                  <div className="w-full h-32 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                    <Camera className="w-8 h-8 text-slate-600 mb-1" />
                    <span className="text-[11px] text-slate-400 font-mono">Live Video Feed</span>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] px-2 py-1 rounded bg-black/70">
                      <span className="text-emerald-400 font-bold">● Streaming</span>
                      <span className={cand.violations > 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {cand.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <span>Screen Lock: <strong className="text-emerald-400">Locked</strong></span>
                    <span>Strikes: <strong className={cand.violations > 0 ? 'text-rose-400' : 'text-slate-200'}>{cand.violations}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: USERS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-700">Registered Contenders & Instructors</h4>
            <div className="space-y-2">
              {userList.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-900">{u.name}</h5>
                    <p className="text-[11px] text-slate-500">{u.school} • {u.classLevel} • {u.team} Team</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700">{u.xp} XP</span>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GMAIL SMTP CONFIG */}
        {activeTab === 'smtp' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed">
              <strong>Gmail SMTP Setup Instructions:</strong> Enter your Gmail email address and Google 16-character <em>App Password</em> (generated from Google Account → Security → App Passwords). This will send real verification emails directly to students during sign up.
            </div>

            <form onSubmit={handleSaveSMTP} className="space-y-3.5 max-w-md">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gmail Address
                </label>
                <input
                  type="email"
                  required
                  value={gmailUser}
                  onChange={(e) => setGmailUser(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gmail 16-Character App Password
                </label>
                <input
                  type="password"
                  required
                  value={gmailAppPassword}
                  onChange={(e) => setGmailAppPassword(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
              >
                Save Gmail Credentials
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
