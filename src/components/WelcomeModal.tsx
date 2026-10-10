import React from 'react';
import { X, Sparkles, Trophy, BookOpen, ShieldCheck, Flame, Users } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onOpenSignUp
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-950/40 text-slate-100 p-6 md:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Image Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/10">
              <img
                src="/hero_welcome.jpg"
                alt="FCT Secondary Schools Quest Champion"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback if public image path fails
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-900/90 border border-emerald-400/30 backdrop-blur-sm">
                <span className="font-semibold text-emerald-300 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> FCT Secondary Quest
                </span>
                <span className="text-amber-400 font-bold">SS1 - SS3</span>
              </div>
            </div>

            {/* Quick Badges below image */}
            <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center text-xs">
              <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-2.5">
                <Users className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                <span className="font-medium text-slate-300 block">Inter-Team</span>
                <span className="text-[10px] text-amber-400 font-semibold">Alpha/Beta/Omega</span>
              </div>
              <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-2.5">
                <BookOpen className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                <span className="font-medium text-slate-300 block">Topic Jump</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Self-Paced</span>
              </div>
              <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-2.5">
                <ShieldCheck className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                <span className="font-medium text-slate-300 block">Proctored</span>
                <span className="text-[10px] text-blue-400 font-semibold">AI Camera</span>
              </div>
            </div>
          </div>

          {/* Text Message Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold w-fit mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official FCT Secondary Schools Academic League</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">
              🎮 Welcome to the Future of Learning!
            </h1>

            <div className="space-y-3.5 text-slate-300 text-sm md:text-base leading-relaxed">
              <p className="font-medium text-emerald-200">
                Where learning meets gaming, knowledge becomes an adventure, and every question brings you closer to victory!
              </p>

              <p>
                Challenge your classmates, compete with other schools, and test your knowledge through exciting, game-show-style rounds based on your school’s scheme of work. Prefer learning at your own pace? Explore interactive questions designed to help you practise, improve, and master each topic.
              </p>

              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs md:text-sm text-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-400">Ready for a bigger challenge?</span>
                  <p className="mt-0.5 text-slate-300">
                    Enter proctored competitions where fairness, focus, and academic integrity come first.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-center md:text-left">
                <p className="text-base md:text-lg font-bold text-amber-400 flex items-center justify-center md:justify-start gap-2">
                  <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                  📚 Learn. Play. Compete. Improve. Win.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Your classroom is now a game arena. Are you ready to play your way to excellence?
                </p>
              </div>

              <p className="font-bold text-emerald-400 text-sm md:text-base">
                Let the learning games begin! 🏆
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenSignUp();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2 transition"
              >
                <span>Register as Student / Teacher</span>
                <span className="text-lg">→</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition"
              >
                Explore Arena First
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
