import React from 'react';
import { X, Sparkles, Trophy, BookOpen, ShieldCheck, Flame, Users, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onOpenSignUp: () => void;
  isGated?: boolean;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onOpenSignUp,
  isGated = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800 p-6 md:p-8">
        
        {/* Close button only available if user is already verified */}
        {!isGated && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100 hover:bg-slate-200 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Hero Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Image Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-xl shadow-emerald-500/10">
              <img
                src="/hero_welcome.jpg"
                alt="FCT Secondary Schools Quest Champion"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-white/95 border border-emerald-500/30 shadow-sm">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" /> FCT Secondary Quest
                </span>
                <span className="text-amber-700 font-extrabold">SS1 - SS3</span>
              </div>
            </div>

            {/* Quick Badges below image */}
            <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <Users className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">Inter-Team</span>
                <span className="text-[10px] text-amber-700 font-semibold">Alpha/Beta/Omega</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <BookOpen className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">Topic Jump</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Self-Paced</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <ShieldCheck className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">Proctored</span>
                <span className="text-[10px] text-blue-700 font-semibold">AI Camera</span>
              </div>
            </div>
          </div>

          {/* Text Message Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold w-fit mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official FCT Secondary Schools Academic League</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mb-3 font-display">
              🎮 Welcome to the Future of Learning!
            </h1>

            <div className="space-y-3.5 text-slate-600 text-sm leading-relaxed">
              <p className="font-medium text-emerald-800">
                Where learning meets gaming, knowledge becomes an adventure, and every question brings you closer to victory!
              </p>

              <p>
                Challenge your classmates, compete with other schools, and test your knowledge through exciting, game-show-style rounds based on your school’s scheme of work. Prefer learning at your own pace? Explore interactive questions designed to help you practise, improve, and master each topic.
              </p>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs md:text-sm text-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-900">Ready for a bigger challenge?</span>
                  <p className="mt-0.5 text-slate-700">
                    Enter proctored competitions where fairness, focus, and academic integrity come first.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-center md:text-left">
                <p className="text-base md:text-lg font-bold text-amber-600 flex items-center justify-center md:justify-start gap-2">
                  <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                  📚 Learn. Play. Compete. Improve. Win.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Your classroom is now a game arena. Are you ready to play your way to excellence?
                </p>
              </div>

              <p className="font-bold text-emerald-700 text-sm md:text-base">
                Let the learning games begin! 🏆
              </p>
            </div>

            {/* Action Buttons: Force Registration / Verification */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onOpenSignUp}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition"
              >
                <span>Register & Confirm Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
