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
  Lock, 
  UserCheck,
  PlusCircle,
  Share2
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { WelcomeModal } from './components/WelcomeModal';
import { SignUpModal } from './components/SignUpModal';
import { PracticeHub } from './components/PracticeHub';
import { QuizArena } from './components/QuizArena';
import { Leaderboard } from './components/Leaderboard';
import { ScheduleView } from './components/ScheduleView';
import { ScheduleModal } from './components/ScheduleModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ShareableBadgeModal } from './components/ShareableBadgeModal';
import { AdminPortal } from './components/AdminPortal';
import { OperatingMode, UserProfile, ClassLevel, ScheduledMatch } from './types';
import { loadUserProfile, saveUserProfile, clearUserProfile, calculateLevel } from './utils/gamification';
import { TEAMS_INFO } from './data/teams';
import { joinTournamentRoomApi, verifyEmailApi } from './utils/api';

export function App() {
  const [user, setUser] = useState<UserProfile | null>(loadUserProfile);
  const [currentMode, setCurrentMode] = useState<OperatingMode>('inter_team');
  const [activeView, setActiveView] = useState<'dashboard' | 'quiz_arena' | 'schedule'>('dashboard');

  // Quiz parameters
  const [quizParams, setQuizParams] = useState<{
    subject?: string;
    topic?: string;
    classLevel?: ClassLevel;
    term?: 1 | 2 | 3;
    isProctored?: boolean;
    isCompetitionMode?: boolean;
    scope?: 'inter_team' | 'inter_school' | 'intra_school';
    modeTitle?: string;
  }>({});

  // Modals state
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState<UserProfile | null>(null);
  const [shareableMasteryBadgeOpen, setShareableMasteryBadgeOpen] = useState(false);

  // Parse URL Parameters (?room=XYZ or ?verifyToken=XYZ)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    const verifyToken = params.get('verifyToken');
    const emailParam = params.get('email');

    // Auto verify email from click link
    if (verifyToken && emailParam && user) {
      verifyEmailApi(emailParam, verifyToken).then(() => {
        const updated = { ...user, isVerified: true };
        setUser(updated);
        saveUserProfile(updated);
        alert('🎉 Account successfully verified from email link!');
      });
    }

    // Auto join room
    if (roomParam && user && user.isVerified) {
      joinTournamentRoomApi(roomParam, user).then((res) => {
        const assignedTeam = res.team || user.team;
        startQuizSession({
          subject: 'General Mathematics',
          classLevel: user.classLevel,
          term: 1,
          isProctored: true,
          isCompetitionMode: true,
          scope: 'inter_team',
          modeTitle: `Live Room ${roomParam} (Team ${assignedTeam})`
        });
      });
    }
  }, [user]);

  // First time prompt
  useEffect(() => {
    const hasSeen = localStorage.getItem('fct_quest_has_seen_welcome_v3');
    if (!hasSeen) {
      setWelcomeOpen(true);
      localStorage.setItem('fct_quest_has_seen_welcome_v3', 'true');
    }
  }, []);

  const handleAuthenticationSuccess = (verifiedUser: UserProfile) => {
    setUser(verifiedUser);
    saveUserProfile(verifiedUser);
    setSignUpOpen(false);
  };

  const handleLogout = () => {
    clearUserProfile();
    setUser(null);
    setSignUpOpen(true);
  };

  const handleUpdateXP = (earnedXP: number) => {
    if (!user) return;
    setUser(prev => {
      if (!prev) return null;
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
    isCompetitionMode?: boolean;
    scope?: 'inter_team' | 'inter_school' | 'intra_school';
    modeTitle?: string;
  }) => {
    if (!user || !user.isVerified) {
      setSignUpOpen(true);
      return;
    }
    setQuizParams(options);
    setActiveView('quiz_arena');
  };

  const handleJoinScheduledMatch = (match: ScheduledMatch) => {
    if (!user || !user.isVerified) {
      setSignUpOpen(true);
      return;
    }
    startQuizSession({
      subject: match.subject,
      classLevel: match.classLevel,
      term: match.term,
      isProctored: match.isProctored,
      isCompetitionMode: true,
      scope: (match.scope as any) || 'inter_team',
      modeTitle: `Match Arena: ${match.title} (${user.team} Team)`
    });
  };

  const handleViewProfileByName = (userName: string) => {
    if (!user) return;
    const profileToShow: UserProfile = {
      ...user,
      name: userName,
      school: userName === user.name ? user.school : 'Loyola Jesuit College, Abuja',
      xp: userName === user.name ? user.xp : 5420,
      level: 4
    };
    setSelectedProfileUser(profileToShow);
  };

  // Gated Auth Screen
  if (!user || !user.isVerified) {
    return (
      <div className="relative min-h-screen text-slate-800 flex flex-col justify-between overflow-hidden selection:bg-emerald-500 selection:text-white">
        
        {/* Full Screen Background Image */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ backgroundImage: `url('/signup_bg.jpg')` }}
        />
        
        {/* Crisp Contrast Overlay */}
        <div className="fixed inset-0 bg-gradient-to-tr from-slate-950/80 via-emerald-950/60 to-slate-900/85 backdrop-blur-[5px]" />

        {/* Top Header */}
        <header className="relative z-10 w-full bg-white/95 backdrop-blur-md border-b border-white/20 py-4 px-6 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-xl shadow-md">
                🏆
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 font-display">FCT ABUJA SECONDARY SCHOOLS QUEST</h1>
                <p className="text-xs text-slate-500 font-medium">JSS1 - SS3 Curriculum Gamification & Tournament Arena</p>
              </div>
            </div>

            <button
              onClick={() => setWelcomeOpen(true)}
              className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition shadow-xs"
            >
              Read Welcome Message 🎮
            </button>
          </div>
        </header>

        {/* Gated Hero Landing Screen */}
        <main className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center space-y-6 flex-1 flex flex-col items-center justify-center">
          
          <div className="w-20 h-20 rounded-3xl bg-white/95 border-2 border-emerald-400 text-emerald-700 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 shadow-md">
              Registration Required to Enter Arena
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display drop-shadow-md">
              Join Your Abuja School & Unlock The Arena
            </h2>
            <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto leading-relaxed drop-shadow">
              Equitably distributed team tournaments (Alpha, Omega, Beta), 5-round game shows with spinning wheels & lifelines, and proctored competitions.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setSignUpOpen(true)}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-emerald-500/40 transition transform hover:-translate-y-1"
            >
              <UserCheck className="w-5 h-5 text-slate-950" />
              <span>Sign Up / Sign In & Confirm Email</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* School badges preview */}
          <div className="pt-6 border-t border-white/20 max-w-2xl mx-auto text-xs">
            <p className="font-bold text-emerald-300 mb-2.5">Accommodating JSS1 to SS3 Across Abuja Schools:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Little Sprout International',
                'Destiny Christian Academy',
                'Deeper Life High School',
                'Faith Academy',
                'Stella Maris Schools',
                'Word of Faith Group',
                'The Regent Secondary',
                'Premiere Academy',
                'FGBC Apo',
                'FGGC Bwari',
                'GSS Garki'
              ].map((sch) => (
                <span key={sch} className="px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-sm text-slate-800 font-bold">
                  {sch}
                </span>
              ))}
            </div>
          </div>
        </main>

        <footer className="relative z-10 w-full bg-white/90 backdrop-blur-md border-t border-white/20 py-4 text-center text-xs text-slate-600 font-medium">
          FCT Abuja Secondary Schools Quest • Accommodating JSS1 - SS3
        </footer>

        <SignUpModal
          isOpen={signUpOpen}
          currentUser={user}
          onAuthenticationSuccess={handleAuthenticationSuccess}
          isGated={true}
        />

        <WelcomeModal
          isOpen={welcomeOpen}
          onClose={() => setWelcomeOpen(false)}
          onOpenSignUp={() => {
            setWelcomeOpen(false);
            setSignUpOpen(true);
          }}
          isGated={true}
        />

      </div>
    );
  }

  // Authenticated Layout
  const userTeam = TEAMS_INFO[user.team || 'Alpha'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      
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
        onLogout={handleLogout}
      />

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* VIEW 1: QUIZ ARENA */}
        {activeView === 'quiz_arena' && (
          <QuizArena
            initialSubject={quizParams.subject}
            initialTopic={quizParams.topic}
            isProctored={quizParams.isProctored}
            isCompetitionMode={quizParams.isCompetitionMode}
            scope={quizParams.scope}
            modeTitle={quizParams.modeTitle}
            user={user}
            onUpdateUserXP={handleUpdateXP}
            onReturnToDashboard={() => setActiveView('dashboard')}
            onViewUserProfile={handleViewProfileByName}
          />
        )}

        {/* VIEW 2: SCHEDULE VIEW */}
        {activeView === 'schedule' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveView('dashboard')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition"
              >
                ← Back to Main Arena
              </button>

              <button
                onClick={() => setScheduleModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-sm transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Host / Schedule Competition Room</span>
              </button>
            </div>

            <ScheduleView
              user={user}
              onJoinMatch={handleJoinScheduledMatch}
            />
          </div>
        )}

        {/* VIEW 3: MAIN DASHBOARD */}
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Hero Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/60 border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      FCT Teaching Scheme (JSS1 - SS3 Accommodated)
                    </span>
                    <span className={`px-3 py-1 rounded-full border border-slate-200 text-xs font-bold bg-white text-slate-900 shadow-sm`}>
                      {userTeam.badgeIcon} {userTeam.name}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 font-display">
                    Where Learning Meets Gaming! 🎮
                  </h1>

                  <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                    Challenge your classmates, compete with schools across Abuja, and master every syllabus unit through 5-round game shows with spinning wheels, 50:50 lifelines, and wager twists.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {/* Practice Topic Jumper */}
                    <button
                      onClick={() => {
                        setCurrentMode('practice_hub');
                        setActiveView('dashboard');
                      }}
                      className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-700/20 transition"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Practice by Topic</span>
                    </button>

                    {/* Schedule / Host Tournament */}
                    <button
                      onClick={() => setScheduleModalOpen(true)}
                      className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Host Match (Up to 1,000)</span>
                    </button>

                    {/* Quick Live Clash */}
                    <button
                      onClick={() => {
                        startQuizSession({
                          subject: 'General Mathematics',
                          classLevel: user.classLevel,
                          term: 1,
                          isProctored: false,
                          isCompetitionMode: true,
                          scope: 'inter_team',
                          modeTitle: `Inter-Team Game Show: ${userTeam.name}`
                        });
                      }}
                      className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>5-Round Live Clash</span>
                    </button>
                  </div>
                </div>

                {/* Hero Visual */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative group w-full max-w-xs rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl shadow-emerald-600/10">
                    <img
                      src="/hero_welcome.jpg"
                      alt="Student Learning Arena"
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 text-center">
                      <span className="text-xs font-bold text-slate-900 bg-white/95 px-3 py-1 rounded-full border border-emerald-300 shadow-sm">
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
                onStartQuiz={(opts) => {
                  startQuizSession({
                    ...opts,
                    isCompetitionMode: false
                  });
                }}
                userClass={user.classLevel}
              />
            ) : (
              <Leaderboard
                currentMode={currentMode}
                onSelectMode={setCurrentMode}
                user={user}
                onViewUserProfile={handleViewProfileByName}
              />
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            <School className="w-4 h-4 text-emerald-600" />
            <span>FCT Abuja Secondary Schools Quest • Accommodating JSS1 - SS3</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>SS1-SS3 Teaching Schemes</span>
            <span>•</span>
            <button onClick={() => setWelcomeOpen(true)} className="hover:text-emerald-700 underline">
              Welcome Guide
            </button>
            <span>•</span>
            <button onClick={() => setAdminOpen(true)} className="hover:text-purple-700 underline">
              Admin Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WelcomeModal
        isOpen={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
        onOpenSignUp={() => {
          setWelcomeOpen(false);
          setSignUpOpen(true);
        }}
        isGated={false}
      />

      <SignUpModal
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        currentUser={user}
        onAuthenticationSuccess={handleAuthenticationSuccess}
        isGated={false}
      />

      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        user={user}
        onMatchCreated={(m) => {
          handleJoinScheduledMatch(m);
        }}
      />

      {selectedProfileUser && (
        <UserProfileModal
          isOpen={!!selectedProfileUser}
          onClose={() => setSelectedProfileUser(null)}
          user={selectedProfileUser}
        />
      )}

      <ShareableBadgeModal
        isOpen={shareableMasteryBadgeOpen}
        onClose={() => setShareableMasteryBadgeOpen(false)}
        user={user}
        badgeTitle="Curriculum Topic Mastery 80%+"
        score={user.xp}
        accuracy={92}
        rank={1}
        type="mastery_80"
      />

      <AdminPortal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

    </div>
  );
}

export default App;
