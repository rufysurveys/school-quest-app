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
  RotateCcw, 
  Trophy, 
  ArrowRight,
  Flame,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Question, UserProfile } from '../types';
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
  const [activeSubject, setActiveSubject] = useState<string>(initialSubject);
  const [activeTopic, setActiveTopic] = useState<string>(initialTopic || '');
  const [topicJumpOpen, setTopicJumpOpen] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(user.bookmarks || []);
  
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [quizFinished, setQuizFinished] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const faceMonitorRef = useRef<FaceMonitor | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [latestWarning, setLatestWarning] = useState<string | null>(null);

  useEffect(() => {
    let pool = SCHEME_QUESTIONS.filter(q => q.subject === activeSubject);
    if (activeTopic) {
      const topicMatches = pool.filter(q => q.topic.toLowerCase() === activeTopic.toLowerCase());
      if (topicMatches.length > 0) {
        pool = topicMatches;
      }
    }
    if (pool.length === 0) {
      pool = SCHEME_QUESTIONS;
    }
    setQuestions([...pool].sort(() => 0.5 - Math.random()));
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation({});
    setQuizFinished(false);
    setTimeLeft(pool.length * 60);
  }, [activeSubject, activeTopic]);

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

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIdx }));
    setShowExplanation(prev => ({ ...prev, [currentIndex]: true }));

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

  const totalAnswered = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(([idx, ans]) => {
    return questions[Number(idx)]?.correctAnswer === ans;
  }).length;
  const accuracyPct = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  if (!currentQ && !quizFinished) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-500 font-medium">Loading questions from Scheme of Work...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Quiz Top Action & Status Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Mode Title & Topic Jumper Trigger */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setTopicJumpOpen(!topicJumpOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition shadow-sm"
              title="Click to jump between topics instantly"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Jump Topic</span>
            </button>

            {/* In-Quiz Topic Jump Flyout */}
            {topicJumpOpen && (
              <div className="absolute left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-50 animate-fadeIn text-xs">
                <div className="px-2 py-1 text-[11px] font-black uppercase text-slate-500 flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1">
                  <span>Switch Topic</span>
                  <span className="text-emerald-700 font-bold">{activeSubject}</span>
                </div>
                <div className="space-y-1">
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
                          : 'text-slate-700 hover:bg-slate-50'
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
            <span className="text-xs font-black text-slate-900 block truncate max-w-[200px] sm:max-w-xs">
              {modeTitle || `${activeSubject} • ${activeTopic || 'Comprehensive'}`}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {/* Center: Team Indicator (Alpha/Beta/Omega) */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800 shadow-sm`}>
          <span>{userTeam.badgeIcon}</span>
          <span>{userTeam.name}</span>
          <span className="text-[10px] text-emerald-700 font-bold">| +{earnedXP} XP</span>
        </div>

        {/* Right: Timer & Proctored State */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-900 shadow-sm">
            <Timer className="w-3.5 h-3.5 text-amber-600" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {isProctored && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
              violationCount > 0 
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-700'
            }`}>
              <Camera className="w-3.5 h-3.5" />
              <span>{violationCount > 0 ? `${violationCount} Alert(s)` : 'Proctored Active'}</span>
            </div>
          )}
        </div>

      </div>

      {/* Proctored Video Overlay Bar (If proctored mode) */}
      {isProctored && (
        <div className="bg-white border border-blue-200 rounded-2xl p-3 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-900 border border-blue-400 flex-shrink-0">
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
              <p className="text-xs font-bold text-blue-900 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" /> Biometric Identity & Focus Monitor
              </p>
              <p className="text-[11px] text-slate-500">
                {latestWarning ? (
                  <span className="text-rose-600 font-bold">{latestWarning}</span>
                ) : (
                  'Gaze and integrity verified. Academic fair play active.'
                )}
              </p>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline font-bold">
            WebRTC Secure
          </span>
        </div>
      )}

      {/* Main Question Card or Final Result */}
      {!quizFinished ? (
        <div className="space-y-6">
          
          {/* Question Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md relative">
            
            {/* Header info: Topic badge & Bookmark button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {currentQ.topic}
                </span>
                {currentQ.subtopic && (
                  <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                    • {currentQ.subtopic}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleToggleBookmark(currentQ.id)}
                className={`p-2 rounded-xl transition ${
                  bookmarkedIds.includes(currentQ.id)
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'text-slate-400 hover:text-slate-700 bg-slate-100'
                }`}
                title="Bookmark question for review"
              >
                {bookmarkedIds.includes(currentQ.id) ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-600" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed mb-6 font-display">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const isAnswered = selectedAnswers[currentIndex] !== undefined;
                const isCorrect = optIdx === currentQ.correctAnswer;

                let optionStyles = 'bg-slate-50/80 border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-slate-800';
                if (isAnswered) {
                  if (isCorrect) {
                    optionStyles = 'bg-emerald-100/80 border-emerald-500 text-emerald-950 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'bg-rose-100/80 border-rose-500 text-rose-950 font-bold';
                  } else {
                    optionStyles = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
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
                          ? 'bg-emerald-600 text-white' 
                          : isAnswered && isSelected && !isCorrect 
                            ? 'bg-rose-600 text-white' 
                            : 'bg-white border border-slate-300 text-slate-700'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm md:text-base">{option}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Explanation Card */}
            {showExplanation[currentIndex] && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs md:text-sm text-slate-800 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>Curriculum Explanation</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
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
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 flex items-center gap-1.5 transition shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-sm"
              >
                <span>Finish & Submit</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Results Summary Card */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl text-center space-y-6 animate-fadeIn">
          
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl shadow-sm">
            🏆
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
              Quest Session Completed!
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Demonstration of curriculum mastery for <strong className="text-emerald-700">{user.school}</strong>
            </p>
          </div>

          {/* Key Metric Podia */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <span className="text-2xl font-black text-amber-800">+{earnedXP}</span>
              <p className="text-[11px] text-amber-700 font-medium mt-1">XP Earned</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <span className="text-2xl font-black text-emerald-800">{accuracyPct}%</span>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">Accuracy</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
              <span className="text-2xl font-black text-blue-800">{correctCount}/{totalAnswered}</span>
              <p className="text-[11px] text-blue-700 font-medium mt-1">Correct Answers</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
              <span className="text-2xl font-black text-purple-800 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-amber-500" /> {user.streak}d
              </span>
              <p className="text-[11px] text-purple-700 font-medium mt-1">Daily Streak</p>
            </div>
          </div>

          {/* Team Contribution Banner */}
          <div className={`p-4 rounded-2xl border border-slate-200 bg-slate-50 max-w-lg mx-auto flex items-center justify-between text-left`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{userTeam.badgeIcon}</span>
              <div>
                <p className={`text-xs font-bold text-slate-900`}>{userTeam.name}</p>
                <p className="text-[11px] text-slate-500">You contributed +{earnedXP} XP to team standings</p>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
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
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry This Session</span>
            </button>

            <button
              onClick={onReturnToDashboard}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition"
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
