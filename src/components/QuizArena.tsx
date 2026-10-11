import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Timer, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  BookmarkCheck, 
  ChevronRight, 
  Sparkles, 
  ShieldAlert, 
  Camera, 
  RotateCcw, 
  Trophy, 
  ArrowRight, 
  Flame, 
  Layers, 
  HelpCircle, 
  Maximize, 
  Lock, 
  Zap, 
  Award,
  Users,
  Share2
} from 'lucide-react';
import { Question, UserProfile, TeamType } from '../types';
import { SCHEME_QUESTIONS, SUBJECT_TOPICS } from '../data/schemeQuestions';
import { TEAMS_INFO } from '../data/teams';
import { getStreakMultiplier } from '../utils/gamification';
import { FaceMonitor } from '../utils/faceMonitor';
import { SpinWheel } from './SpinWheel';
import { ShareableBadgeModal } from './ShareableBadgeModal';

interface QuizArenaProps {
  initialSubject?: string;
  initialTopic?: string;
  isProctored?: boolean;
  isCompetitionMode?: boolean;
  scope?: 'inter_team' | 'inter_school' | 'intra_school';
  modeTitle?: string;
  user: UserProfile;
  onUpdateUserXP: (earnedXP: number) => void;
  onReturnToDashboard: () => void;
  onViewUserProfile?: (name: string) => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  initialSubject = 'General Mathematics',
  initialTopic,
  isProctored = false,
  isCompetitionMode = false,
  scope = 'inter_team',
  modeTitle,
  user,
  onUpdateUserXP,
  onReturnToDashboard,
  onViewUserProfile
}) => {
  const [activeSubject, setActiveSubject] = useState<string>(initialSubject);
  const [activeTopic, setActiveTopic] = useState<string>(initialTopic || '');
  const [topicJumpOpen, setTopicJumpOpen] = useState(false);

  // Question & Session State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(user.bookmarks || []);
  
  // Game Show Lifelines
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [audienceHintUsed, setAudienceHintUsed] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [activeHint, setActiveHint] = useState<string | null>(null);

  // Round 4 (Confidence Wager) & Round 5 (Combo Streak)
  const [wagerSelected, setWagerSelected] = useState<number>(100);
  const [wagerConfirmed, setWagerConfirmed] = useState<boolean>(false);
  const [comboStreak, setComboStreak] = useState<number>(0);

  // Spin Wheel Perk
  const [spinWheelOpen, setSpinWheelOpen] = useState(false);
  const [activePerk, setActivePerk] = useState<{ label: string; multiplier: number; icon: string } | null>(null);

  // Timing & Auto-Advance
  const [timerDuration, setTimerDuration] = useState<number>(30); // 30s per question
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [fastestAnswerTimes, setFastestAnswerTimes] = useState<number[]>([]);

  // Scores
  const [totalScore, setTotalScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [shareBadgeOpen, setShareBadgeOpen] = useState(false);

  // Strict Proctored States
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceMonitorRef = useRef<FaceMonitor | null>(null);
  const [violationCount, setViolationCount] = useState(0);
  const [latestWarning, setLatestWarning] = useState<string | null>(null);
  const [keyboardFrozen, setKeyboardFrozen] = useState(false);
  const [freezeCountdown, setFreezeCountdown] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load questions and structure into 5 rounds
  useEffect(() => {
    let pool = SCHEME_QUESTIONS.filter(q => q.subject === activeSubject);
    if (activeTopic) {
      const topicMatches = pool.filter(q => q.topic.toLowerCase() === activeTopic.toLowerCase());
      if (topicMatches.length > 0) pool = topicMatches;
    }
    if (pool.length === 0) pool = SCHEME_QUESTIONS;

    // Pick 10 questions (2 questions per round across 5 rounds)
    const selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(selected);
    setCurrentIndex(0);
    setCurrentRound(1);
    setSelectedAnswers({});
    setShowExplanation({});
    setQuizFinished(false);
    resetTimerForQuestion(1);
  }, [activeSubject, activeTopic]);

  // Determine current round (2 questions per round)
  useEffect(() => {
    const roundNumber = Math.min(5, Math.floor(currentIndex / 2) + 1);
    setCurrentRound(roundNumber);
    resetTimerForQuestion(roundNumber);
    setEliminatedOptions([]);
    setActiveHint(null);
    setWagerConfirmed(false);
  }, [currentIndex]);

  const resetTimerForQuestion = (roundNum: number) => {
    // Round 3 is Speed Burst (15 seconds), others 30s
    const dur = roundNum === 3 ? 15 : 30;
    setTimerDuration(dur);
    setTimeLeft(dur);
    setQuestionStartTime(Date.now());
  };

  // Full Screen & Strict Proctoring Setup
  useEffect(() => {
    if (isProctored) {
      // Request full screen
      try {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        }
      } catch (e) {}

      // Visibility change / tab switch detection
      const handleVisibilityChange = () => {
        if (document.hidden) {
          triggerViolationStrike('EXAM INTEGRITY BREACH: Switched browser tabs or minimized window!');
        }
      };

      const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
          setIsFullscreen(false);
          triggerViolationStrike('EXAM INTEGRITY BREACH: Exited mandatory Full-Screen mode!');
        } else {
          setIsFullscreen(true);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('fullscreenchange', handleFullscreenChange);

      if (videoRef.current) {
        const monitor = new FaceMonitor(videoRef.current, (report) => {
          triggerViolationStrike(`CAMERA INTEGRITY ALERT: ${report.reason}`);
        });
        faceMonitorRef.current = monitor;
        monitor.startMonitoring();
      }

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        if (faceMonitorRef.current) faceMonitorRef.current.stopMonitoring();
      };
    }
  }, [isProctored]);

  // Strict Violation penalty (Freezes keyboard/inputs for 5 seconds)
  const triggerViolationStrike = (reason: string) => {
    setViolationCount(prev => prev + 1);
    setLatestWarning(reason);
    setKeyboardFrozen(true);
    setFreezeCountdown(5);

    const freezeTimer = setInterval(() => {
      setFreezeCountdown(c => {
        if (c <= 1) {
          clearInterval(freezeTimer);
          setKeyboardFrozen(false);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  // Auto-advance Countdown Timer
  useEffect(() => {
    if (quizFinished || keyboardFrozen) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer expired: Auto move to next question!
          handleAutoAdvance();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizFinished, keyboardFrozen, currentIndex, questions]);

  const handleAutoAdvance = () => {
    // If not answered, mark as unanswered (-1)
    if (selectedAnswers[currentIndex] === undefined) {
      setSelectedAnswers(prev => ({ ...prev, [currentIndex]: -1 }));
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const currentQ = questions[currentIndex];
  const userTeam = TEAMS_INFO[user.team || 'Alpha'];
  const streakMult = getStreakMultiplier(user.streak);

  // Lifeline 50:50
  const handleUse5050 = () => {
    if (fiftyFiftyUsed || !currentQ) return;
    setFiftyFiftyUsed(true);

    const wrongIndexes = [0, 1, 2, 3].filter(idx => idx !== currentQ.correctAnswer);
    const toEliminate = wrongIndexes.slice(0, 2);
    setEliminatedOptions(toEliminate);
  };

  // Lifeline Audience Hint
  const handleUseAudienceHint = () => {
    if (audienceHintUsed || !currentQ) return;
    setAudienceHintUsed(true);
    setActiveHint(`Audience & Syllabus Hint: Focus on core principle of "${currentQ.topic}". Option ${String.fromCharCode(65 + currentQ.correctAnswer)} aligns with WAEC/FCT standard definition.`);
  };

  // Answer Selection
  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswers[currentIndex] !== undefined || keyboardFrozen) return;

    const timeTakenSeconds = (Date.now() - questionStartTime) / 1000;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIdx }));
    setShowExplanation(prev => ({ ...prev, [currentIndex]: true }));

    const isCorrect = optionIdx === currentQ.correctAnswer;
    let questionScore = 0;

    if (isCorrect) {
      setFastestAnswerTimes(prev => [...prev, timeTakenSeconds]);
      const basePoints = 100;
      const speedBonus = Math.max(0, Math.round((timeLeft / timerDuration) * 50));
      let points = basePoints + speedBonus;

      // Round 4 Wager
      if (currentRound === 4 && wagerConfirmed) {
        points += wagerSelected;
      }

      // Round 5 Combo Multiplier
      if (currentRound === 5) {
        const nextCombo = comboStreak + 1;
        setComboStreak(nextCombo);
        points = Math.round(points * (1 + nextCombo * 0.5));
      }

      // Perk Multiplier from Spin Wheel
      if (activePerk) {
        points = Math.round(points * activePerk.multiplier);
      }

      questionScore = points;
      setTotalScore(prev => prev + questionScore);
    } else {
      // Wrong answer
      if (currentRound === 4 && wagerConfirmed) {
        setTotalScore(prev => Math.max(0, prev - wagerSelected));
      }
      setComboStreak(0);
    }

    // Auto-advance after brief 1.8s delay to see instant feedback
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        handleFinishQuiz();
      }
    }, 1800);
  };

  const handleFinishQuiz = () => {
    setQuizFinished(true);
    if (faceMonitorRef.current) faceMonitorRef.current.stopMonitoring();
    if (document.fullscreenElement) {
      try { document.exitFullscreen(); } catch (e) {}
    }
    onUpdateUserXP(totalScore);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Metrics
  const totalAnswered = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(([idx, ans]) => {
    return questions[Number(idx)]?.correctAnswer === ans;
  }).length;
  const accuracyPct = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const avgSpeedSeconds = fastestAnswerTimes.length > 0 
    ? (fastestAnswerTimes.reduce((a, b) => a + b, 0) / fastestAnswerTimes.length).toFixed(1)
    : '4.2';

  // Winning Team / School / Class mock members calculation
  const mockTeamMembers = {
    Alpha: ['Aisha Bello (You)', 'Chukwudi Okafor', 'Samuel Kalu', 'Zainab Danjuma', 'Tariq Al-Mansoor'],
    Beta: ['Emeka Nwosu', 'Favour Adebayo', 'Blessing Musa', 'David Okon', 'Fatima Garba'],
    Omega: ['Amina Bello', 'Grace Yakubu', 'Oluwaseun Adeleke', 'Farooq Sanusi', 'Esther Paul']
  };

  const winningTeam: TeamType = totalScore >= 700 ? user.team : (user.team === 'Alpha' ? 'Omega' : 'Alpha');

  if (!currentQ && !quizFinished) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-slate-500 font-bold">Preparing TV Game Show Arena...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Strict Keyboard Freeze Banner */}
      {keyboardFrozen && (
        <div className="p-4 rounded-2xl bg-rose-600 text-white shadow-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6" />
            <div>
              <h4 className="font-black text-sm uppercase">PROCTOR INTEGRITY LOCK ACTIVATED</h4>
              <p className="text-xs text-rose-100">{latestWarning}</p>
            </div>
          </div>
          <span className="font-mono text-xl font-black bg-rose-800 px-3 py-1 rounded-xl">
            {freezeCountdown}s
          </span>
        </div>
      )}

      {/* Top TV Game Show HUD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Round Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <Trophy className="w-4 h-4" />
            <span>Round {currentRound}: {
              currentRound === 1 ? 'Rapid Objectives' :
              currentRound === 2 ? 'Concept Mastery' :
              currentRound === 3 ? '⚡ Speed Arena' :
              currentRound === 4 ? '🔥 Confidence Wager' : '👑 Combo Surge'
            }</span>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Q{currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Lifelines Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUse5050}
            disabled={fiftyFiftyUsed || selectedAnswers[currentIndex] !== undefined}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
              fiftyFiftyUsed 
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
            }`}
            title="50:50 Lifeline (Eliminate 2 wrong answers)"
          >
            <span>50:50</span>
          </button>

          <button
            onClick={handleUseAudienceHint}
            disabled={audienceHintUsed || selectedAnswers[currentIndex] !== undefined}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
              audienceHintUsed 
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100'
            }`}
            title="Audience / Scheme Tip"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>

          {/* Spin Wheel Perk Trigger */}
          <button
            onClick={() => setSpinWheelOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black uppercase flex items-center gap-1 shadow-xs hover:scale-105 transition"
            title="Spin Bonus Perk Wheel"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spin Wheel</span>
          </button>
        </div>

        {/* Right: Timer & Score */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold text-xs flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-amber-600" />
            <span>{timeLeft}s</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs">
            Score: <span className="font-black">{totalScore}</span> pts
          </div>
        </div>

      </div>

      {/* Round 4 Twist: Confidence Wager Dialog */}
      {currentRound === 4 && !wagerConfirmed && selectedAnswers[currentIndex] === undefined && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-center space-y-3 animate-fadeIn shadow-sm">
          <div className="flex items-center justify-center gap-2 text-amber-950 font-black text-sm uppercase">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Round 4 Twist: Confidence Wager</span>
          </div>
          <p className="text-xs text-amber-900">
            Wager your score before seeing the question! Correct answer wins the wager; incorrect deducts it.
          </p>
          <div className="flex items-center justify-center gap-3">
            {[50, 100, 200].map(amt => (
              <button
                key={amt}
                onClick={() => setWagerSelected(amt)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  wagerSelected === amt 
                    ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-600' 
                    : 'bg-white border border-amber-300 text-amber-900'
                }`}
              >
                Wager {amt} pts
              </button>
            ))}
          </div>
          <button
            onClick={() => setWagerConfirmed(true)}
            className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs transition hover:bg-emerald-700"
          >
            Lock In Wager ({wagerSelected} pts) →
          </button>
        </div>
      )}

      {/* Round 5 Twist: Combo Streak Banner */}
      {currentRound === 5 && (
        <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs text-purple-900">
          <span className="font-bold flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-600" />
            Round 5 Grand Twist: Combo Surge Gauntlet!
          </span>
          <span className="font-black px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-950">
            Streak Combo: {comboStreak}x Multiplier
          </span>
        </div>
      )}

      {/* Lifeline Hint Toast */}
      {activeHint && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 animate-fadeIn">
          {activeHint}
        </div>
      )}

      {/* Proctored Video Overlay Bar */}
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
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" /> Live WebRTC Proctored Feed
              </p>
              <p className="text-[11px] text-slate-500">
                Full-screen mandatory. Looking away or switching screens triggers keyboard locks.
              </p>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
            {violationCount} Strikes
          </span>
        </div>
      )}

      {/* Main Question Card or Final Ceremony */}
      {!quizFinished ? (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md relative">
            
            {/* Header info */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                {currentQ.topic}
              </span>

              {/* In Practice Mode: Allow Bookmark */}
              {!isCompetitionMode && (
                <button
                  onClick={() => setBookmarkedIds(prev => prev.includes(currentQ.id) ? prev.filter(i => i !== currentQ.id) : [...prev, currentQ.id])}
                  className={`p-2 rounded-xl transition ${
                    bookmarkedIds.includes(currentQ.id)
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'text-slate-400 hover:text-slate-700 bg-slate-100'
                  }`}
                >
                  {bookmarkedIds.includes(currentQ.id) ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Question Prompt */}
            <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed mb-6 font-display">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const isAnswered = selectedAnswers[currentIndex] !== undefined;
                const isCorrect = optIdx === currentQ.correctAnswer;
                const isEliminated = eliminatedOptions.includes(optIdx);

                if (isEliminated) {
                  return (
                    <div
                      key={optIdx}
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 line-through text-xs font-medium cursor-not-allowed"
                    >
                      {String.fromCharCode(65 + optIdx)}. [Eliminated by 50:50 Lifeline]
                    </div>
                  );
                }

                let style = 'bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-slate-800';
                if (isAnswered) {
                  if (isCorrect) style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                  else if (isSelected) style = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                  else style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isAnswered || keyboardFrozen}
                    onClick={() => handleSelectAnswer(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${style}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                        isAnswered && isCorrect ? 'bg-emerald-600 text-white' :
                        isAnswered && isSelected && !isCorrect ? 'bg-rose-600 text-white' :
                        'bg-white border border-slate-300 text-slate-700'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm md:text-base">{option}</span>
                    </div>

                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation[currentIndex] && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs md:text-sm text-slate-800 space-y-1 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>Curriculum Answer Explanation</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

          </div>

          {/* Navigation Controls: Only allow PREVIOUS in Practice mode */}
          <div className="flex items-center justify-between gap-4">
            {!isCompetitionMode ? (
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 text-xs font-bold text-slate-700"
              >
                Previous
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">
                ⚡ Competition Mode: Forward auto-progression only
              </span>
            )}

            <button
              onClick={handleAutoAdvance}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Match'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* END OF MATCH WINNER CEREMONY & ROSTER */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 text-center animate-fadeIn">
          
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center text-4xl shadow-sm">
            🏆
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block">
              {scope === 'inter_team' ? 'Inter-Team Tournament Victory' : scope === 'inter_school' ? 'Inter-School Championship' : 'Intra-School Stream Battle'}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
              {scope === 'inter_team' && `VICTORY FOR TEAM ${winningTeam.toUpperCase()}! 🥇`}
              {scope === 'inter_school' && `${user.school} Triumphs as Champion! 🥇`}
              {scope === 'intra_school' && `Science Stream Crowned Champions! 🥇`}
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Fair scoring applied: Final score is the calculated average of all contributing members.
            </p>
          </div>

          {/* Roster of Winning Members */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 max-w-xl mx-auto shadow-2xs">
            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              Winning Roster & Contributing Scholars:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(mockTeamMembers[winningTeam] || []).map((memberName, idx) => (
                <div 
                  key={idx}
                  onClick={() => onViewUserProfile && onViewUserProfile(memberName)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 cursor-pointer transition"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800 truncate">{memberName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fastest Finger Recognition Award */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 max-w-xl mx-auto flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-black shadow-xs">
                ⚡
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                  FASTEST FINGER RECOGNITION
                </span>
                <h5 className="font-bold text-slate-900 text-sm">{user.name} ({user.school})</h5>
                <p className="text-[11px] text-amber-800">Fastest response speed: {avgSpeedSeconds}s • {accuracyPct}% Accuracy</p>
              </div>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-lg bg-amber-400 text-slate-950 shadow-xs">
              Honored 🎖️
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {/* Shareable Badge */}
            <button
              onClick={() => setShareBadgeOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Claim Shareable Victory Badge</span>
            </button>

            <button
              onClick={onReturnToDashboard}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
            >
              <span>Return to Learning Arena</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Spin Wheel Modal */}
      {spinWheelOpen && (
        <SpinWheel
          onClose={() => setSpinWheelOpen(false)}
          onSpinComplete={(perk) => {
            setActivePerk(perk);
            setSpinWheelOpen(false);
          }}
        />
      )}

      {/* Shareable Badge Modal */}
      <ShareableBadgeModal
        isOpen={shareBadgeOpen}
        onClose={() => setShareBadgeOpen(false)}
        user={user}
        badgeTitle={scope === 'inter_team' ? `Team ${winningTeam} Tournament Champion` : `${user.school} Academic Champion`}
        score={totalScore}
        accuracy={accuracyPct}
        rank={1}
        type="winner"
      />

    </div>
  );
};
