import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Timer, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  BookmarkCheck, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShieldAlert, 
  Camera, 
  VideoOff, 
  RotateCcw, 
  Trophy, 
  Award,
  ArrowRight,
  Flame,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Question, UserProfile, TeamType } from '../types';
import { SCHEME_QUESTIONS, SUBJECT_TOPICS } from '../data/schemeQuestions';
import { TEAMS_INFO } from '../data/teams';
import { getStreakMultiplier } from '../utils/gamification';
import { FaceMonitor } from '../utils/faceMonitor';

interface QuizArenaProps {
  initialSubject?: string;
  initialTopic?: string;
  isProctored?: boolean;
  modeTitle?: string;
  user: UserProfile;
  onUpdateUserXP: (earnedXP: number) => void;
  onReturnToDashboard: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  initialSubject = 'General Mathematics',
  initialTopic,
  isProctored = false,
  modeTitle,
  user,
  onUpdateUserXP,
  onReturnToDashboard
}) => {
  // Active subject & topic for live topic jumping
  const [activeSubject, setActiveSubject] = useState<string>(initialSubject);
  const [activeTopic, setActiveTopic] = useState<string>(initialTopic || '');
  const [topicJumpOpen, setTopicJumpOpen] = useState(false);

  // Filter questions according to selection
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(user.bookmarks || []);
  
  // Timer & Exam states
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15 mins default
  const [quizFinished, setQuizFinished] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Proctored face monitor state
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceMonitorRef = useRef<FaceMonitor | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [latestWarning, setLatestWarning] = useState<string | null>(null);

  // Load questions based on subject & topic
  useEffect(() => {
    let pool = SCHEME_QUESTIONS.filter(q => q.subject === activeSubject);
    if (activeTopic) {
      const topicMatches = pool.filter(q => q.topic.toLowerCase() === activeTopic.toLowerCase());
      if (topicMatches.length > 0) {
        pool = topicMatches;
      }
    }
    // Fallback if empty
    if (pool.length === 0) {
      pool = SCHEME_QUESTIONS;
    }
    // Shuffle slightly for variance
    setQuestions([...pool].sort(() => 0.5 - Math.random()));
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation({});
    setQuizFinished(false);
    setTimeLeft(pool.length * 60); // 60s per question
  }, [activeSubject, activeTopic]);

  // Setup Proctored Camera if enabled
  useEffect(() => {
    if (isProctored && videoRef.current) {
      const monitor = new FaceMonitor(videoRef.current, (report) => {
        setViolationCount(report.count);
        setLatestWarning(report.reason);
      });
      faceMonitorRef.current = monitor;
      monitor.startMonitoring().then((res) => {
        setCameraActive(res.success || !!res.fallback);
      });
    }

    return () => {
      if (faceMonitorRef.current) {
        faceMonitorRef.current.stopMonitoring();
      }
    };
  }, [isProctored]);

  // Countdown timer interval
  useEffect(() => {
    if (quizFinished) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizFinished, questions]);

  const currentQ = questions[currentIndex];
  const userTeam = TEAMS_INFO[user.team || 'Alpha'];
  const streakMult = getStreakMultiplier(user.streak);

  // Answer selection handler
  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // already answered
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIdx }));
    setShowExplanation(prev => ({ ...prev, [currentIndex]: true }));

    // If correct, calculate XP
    if (currentQ && optionIdx === currentQ.correctAnswer) {
      const baseXP = 10;
      const bonusXP = Math.round(baseXP * streakMult);
      setEarnedXP(prev => prev + bonusXP);
    }
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleFinishQuiz = () => {
    setQuizFinished(true);
    if (faceMonitorRef.current) {
      faceMonitorRef.current.stopMonitoring();
    }
    onUpdateUserXP(earnedXP);

    // Confetti celebration
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Calculate statistics
  const totalAnswered = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(([idx, ans]) => {
    return questions[Number(idx)]?.correctAnswer === ans;
  }).length;
  const accuracyPct = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  if (!currentQ && !quizFinished) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-400">Loading questions from Scheme of Work...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Quiz Top Action & Status Bar */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Mode Title & Topic Jumper Trigger */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setTopicJumpOpen(!topicJumpOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-600/30 transition"
              title="Click to jump between topics instantly"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Jump Topic</span>
            </button>

            {/* In-Quiz Topic Jump Flyout */}
            {topicJumpOpen && (
              <div className="absolute left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 animate-fadeIn text-xs">
                <div className="px-2 py-1 text-[11px] font-black uppercase text-slate-400 flex items-center justify-between">
                  <span>Switch Topic</span>
                  <span className="text-emerald-400">{activeSubject}</span>
                </div>
                <div className="mt-1 space-y-1">
                  {(SUBJECT_TOPICS[activeSubject] || []).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setActiveTopic(t);
                        setTopicJumpOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition truncate ${
                        activeTopic === t
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-black text-white block">
              {modeTitle || `${activeSubject} • ${activeTopic || 'Comprehensive'}`}
            </span>
            <span className="text-[11px] text-slate-400">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {/* Center: Team Indicator (Alpha/Beta/Omega) */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${userTeam.borderColor} ${userTeam.textColor} bg-slate-950/70`}>
          <span>{userTeam.badgeIcon}</span>
          <span>{userTeam.name}</span>
          <span className="text-[10px] text-slate-400 font-normal">| +{earnedXP} XP</span>
        </div>

        {/* Right: Timer & Proctored State */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-400">
            <Timer className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {isProctored && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
              violationCount > 0 
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 animate-pulse' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <Camera className="w-3.5 h-3.5" />
              <span>{violationCount > 0 ? `${violationCount} Alert(s)` : 'Proctored Active'}</span>
            </div>
          )}
        </div>

      </div>

      {/* Proctored Video Overlay Bar (If proctored mode) */}
      {isProctored && (
        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-black border border-blue-400/40 flex-shrink-0">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-300 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Biometric Identity & Focus Monitor
              </p>
              <p className="text-[11px] text-slate-400">
                {latestWarning ? (
                  <span className="text-rose-400 font-medium">{latestWarning}</span>
                ) : (
                  'Gaze and integrity verified. Academic fair play active.'
                )}
              </p>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hidden sm:inline">
            WebRTC Secure
          </span>
        </div>
      )}

      {/* Main Question Card or Final Result */}
      {!quizFinished ? (
        <div className="space-y-6">
          
          {/* Question Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative">
            
            {/* Header info: Topic badge & Bookmark button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {currentQ.topic}
                </span>
                {currentQ.subtopic && (
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    • {currentQ.subtopic}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleToggleBookmark(currentQ.id)}
                className={`p-2 rounded-xl transition ${
                  bookmarkedIds.includes(currentQ.id)
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white bg-slate-800'
                }`}
                title="Bookmark question for review"
              >
                {bookmarkedIds.includes(currentQ.id) ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed mb-6">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const isAnswered = selectedAnswers[currentIndex] !== undefined;
                const isCorrect = optIdx === currentQ.correctAnswer;

                let optionStyles = 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200';
                if (isAnswered) {
                  if (isCorrect) {
                    optionStyles = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                  } else {
                    optionStyles = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${optionStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                        isAnswered && isCorrect 
                          ? 'bg-emerald-500 text-slate-950' 
                          : isAnswered && isSelected && !isCorrect 
                            ? 'bg-rose-500 text-white' 
                            : 'bg-slate-700/80 text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm md:text-base">{option}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Explanation Card */}
            {showExplanation[currentIndex] && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs md:text-sm text-slate-200 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <HelpCircle className="w-4 h-4" />
                  <span>Curriculum Explanation</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-300 flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-950/40"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-amber-950/40"
              >
                <span>Finish & Submit</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Results & Celebratory Summary Card */
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 animate-fadeIn">
          
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/20">
            🏆
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Quest Session Completed!
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Excellent demonstration of curriculum mastery for <strong className="text-emerald-400">{user.school}</strong>
            </p>
          </div>

          {/* Key Metric Podia */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-2xl font-black text-amber-400">+{earnedXP}</span>
              <p className="text-[11px] text-slate-400 mt-1">XP Earned</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-2xl font-black text-emerald-400">{accuracyPct}%</span>
              <p className="text-[11px] text-slate-400 mt-1">Accuracy</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-2xl font-black text-blue-400">{correctCount}/{totalAnswered}</span>
              <p className="text-[11px] text-slate-400 mt-1">Correct Answers</p>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-2xl font-black text-purple-400 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-amber-500" /> {user.streak}d
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Daily Streak</p>
            </div>
          </div>

          {/* Team Contribution Banner */}
          <div className={`p-4 rounded-2xl bg-gradient-to-r ${userTeam.bgGradient} border ${userTeam.borderColor} max-w-lg mx-auto flex items-center justify-between text-left`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{userTeam.badgeIcon}</span>
              <div>
                <p className={`text-xs font-bold ${userTeam.textColor}`}>{userTeam.name}</p>
                <p className="text-[11px] text-slate-300">You contributed +{earnedXP} XP to team standings</p>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-400">
              +{earnedXP} pts
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setQuizFinished(false);
                setCurrentIndex(0);
                setSelectedAnswers({});
                setShowExplanation({});
                setTimeLeft(questions.length * 60);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry This Session</span>
            </button>

            <button
              onClick={onReturnToDashboard}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition"
            >
              <span>Return to Learning Arena</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
