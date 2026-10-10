import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  BookOpen, 
  Users, 
  School, 
  ShieldCheck, 
  Play, 
  Calendar, 
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { WelcomeModal } from './components/WelcomeModal';
import { SignUpModal } from './components/SignUpModal';
import { PracticeHub } from './components/PracticeHub';
import { QuizArena } from './components/QuizArena';
import { Leaderboard } from './components/Leaderboard';
import { ScheduleView } from './components/ScheduleView';
import { AdminPortal } from './components/AdminPortal';
import { OperatingMode, UserProfile, ClassLevel, ScheduledMatch } from './types';
import { loadUserProfile, saveUserProfile, calculateLevel } from './utils/gamification';
import { TEAMS_INFO } from './data/teams';

export function App() {
  const [user, setUser] = useState<UserProfile>(loadUserProfile);
  const [currentMode, setCurrentMode] = useState<OperatingMode>('inter_team'); // Default mode: Inter-Team
  const [activeView, setActiveView] = useState<'dashboard' | 'quiz_arena' | 'schedule'>('dashboard');

  // Quiz Arena session parameters
  const [quizParams, setQuizParams] = useState<{
    subject?: string;
    topic?: string;
    classLevel?: ClassLevel;
    term?: 1 | 2 | 3;
    isProctored?: boolean;
    modeTitle?: string;
  }>({});

  // Modals state
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Check if first-time user to show welcome message
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('fct_quest_has_seen_welcome');
    if (!hasSeenWelcome) {
      setWelcomeOpen(true);
      localStorage.setItem('fct_quest_has_seen_welcome', 'true');
    }
  }, []);

  const handleSaveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveUserProfile(updatedUser);
  };

  const handleUpdateXP = (earnedXP: number) => {
    setUser(prev => {
      const newXP = prev.xp + earnedXP;
      const newLevel = calculateLevel(newXP);
      const updated: UserProfile = {
        ...prev,
        xp: newXP,
        level: newLevel
      };
      saveUserProfile(updated);
      return updated;
    });
  };

  const startQuizSession = (options: {
    subject?: string;
    topic?: string;
    classLevel?: ClassLevel;
    term?: 1 | 2 | 3;
    isProctored?: boolean;
    modeTitle?: string;
  }) => {
    setQuizParams(options);
    setActiveView('quiz_arena');
  };

  const handleJoinScheduledMatch = (match: ScheduledMatch) => {
    startQuizSession({
      subject: match.subject,
      classLevel: match.classLevel,
      term: match.term,
      isProctored: match.isProctored,
      modeTitle: `Match Arena: ${match.title} (Team ${user.team})`
    });
  };

  const userTeam = TEAMS_INFO[user.team || 'Alpha'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Sticky Top Header */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setActiveView('dashboard');
        }}
        user={user}
        onOpenSignUp={() => setSignUpOpen(true)}
        onOpenWelcome={() => setWelcomeOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenSchedule={() => setActiveView('schedule')}
      />

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* VIEW 1: QUIZ ARENA (Practice, Regular, or Proctored) */}
        {activeView === 'quiz_arena' && (
          <QuizArena
            initialSubject={quizParams.subject}
            initialTopic={quizParams.topic}
            isProctored={quizParams.isProctored}
            modeTitle={quizParams.modeTitle}
            user={user}
            onUpdateUserXP={handleUpdateXP}
            onReturnToDashboard={() => setActiveView('dashboard')}
          />
        )}

        {/* VIEW 2: SCHEDULE VIEW */}
        {activeView === 'schedule' && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
            >
              ← Back to Main Arena
            </button>
            <ScheduleView
              user={user}
              onJoinMatch={handleJoinScheduledMatch}
            />
          </div>
        )}

        {/* VIEW 3: MAIN DASHBOARD */}
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Hero Card with user uploaded photo & welcome message */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/60 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Hero Text */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      FCT Senior Secondary Teaching Scheme
                    </span>
                    <span className={`px-3 py-1 rounded-full border text-xs font-extrabold ${userTeam.borderColor} ${userTeam.textColor} bg-slate-950/80`}>
                      {userTeam.badgeIcon} {userTeam.name}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-display">
                    Where Learning Meets Gaming! 🎮
                  </h1>

                  <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
                    Challenge your classmates, compete with schools across Abuja, and master every unit of the <strong className="text-emerald-400">FCT Scheme of Work (SS1 - SS3)</strong> through game-show rounds and self-paced topic jumping.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {/* Practice Topic Jumper Action */}
                    <button
                      onClick={() => {
                        setCurrentMode('practice_hub');
                        setActiveView('dashboard');
                      }}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Jump to Practice Topics</span>
                    </button>

                    {/* Default Inter-Team Match Action */}
                    <button
                      onClick={() => {
                        startQuizSession({
                          subject: 'General Mathematics',
                          classLevel: user.classLevel,
                          term: 1,
                          isProctored: false,
                          modeTitle: `Inter-Team Match: ${userTeam.name}`
                        });
                      }}
                      className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950/40 transition"
                    >
                      <Users className="w-4 h-4" />
                      <span>Play for {user.team} Team</span>
                    </button>

                    {/* Proctored Exam Mode */}
                    <button
                      onClick={() => {
                        startQuizSession({
                          subject: 'General Mathematics',
                          classLevel: user.classLevel,
                          term: 1,
                          isProctored: true,
                          modeTitle: `Proctored Academic Championship (${user.classLevel})`
                        });
                      }}
                      className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold text-xs uppercase tracking-wider border border-blue-500/30 flex items-center gap-2 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>Proctored Exam Arena</span>
                    </button>
                  </div>
                </div>

                {/* Hero User Visual */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative group w-full max-w-xs rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/20">
                    <img
                      src="/hero_welcome.jpg"
                      alt="Student Learning Arena"
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 text-center">
                      <span className="text-xs font-bold text-emerald-300 bg-slate-950/90 px-3 py-1 rounded-full border border-emerald-400/30 backdrop-blur-md">
                        {user.school}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Mode Content Views */}
            {currentMode === 'practice_hub' ? (
              <PracticeHub
                onStartQuiz={startQuizSession}
                userClass={user.classLevel}
              />
            ) : (
              <Leaderboard
                currentMode={currentMode}
                onSelectMode={setCurrentMode}
                user={user}
              />
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <School className="w-4 h-4 text-emerald-400" />
            <span>FCT Abuja Secondary Schools Quest • Official Curriculum Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>SS1, SS2 & SS3 Teaching Schemes</span>
            <span>•</span>
            <button onClick={() => setWelcomeOpen(true)} className="hover:text-emerald-400 underline">
              Welcome Guide
            </button>
            <span>•</span>
            <button onClick={() => setAdminOpen(true)} className="hover:text-purple-400 underline">
              Admin Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
        onOpenSignUp={() => setSignUpOpen(true)}
      />

      {/* Sign Up / Edit Profile Modal */}
      <SignUpModal
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        currentUser={user}
        onSaveUser={handleSaveUser}
      />

      {/* Admin / Teacher Portal */}
      <AdminPortal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

    </div>
  );
}

export default App;
