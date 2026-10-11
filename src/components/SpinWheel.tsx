import React, { useState } from 'react';
import { Sparkles, Trophy, Flame, Shield, Clock, Zap } from 'lucide-react';

interface SpinWheelProps {
  onSpinComplete: (perk: { label: string; multiplier: number; description: string; icon: string }) => void;
  onClose: () => void;
}

const WHEEL_SECTORS = [
  { label: '2x Double XP', multiplier: 2.0, description: 'Earn double XP on all correct answers this round!', color: '#f59e0b', icon: '⚡' },
  { label: '50:50 Lifeline', multiplier: 1.0, description: 'Free 50:50 lifeline added to eliminate 2 wrong options!', color: '#10b981', icon: '🎯' },
  { label: '+10s Time Boost', multiplier: 1.0, description: 'Extra 10 seconds added to each question timer!', color: '#3b82f6', icon: '⏱️' },
  { label: 'Shield Protection', multiplier: 1.0, description: 'Your first incorrect answer will not deduct streak!', color: '#8b5cf6', icon: '🛡️' },
  { label: 'Speed Surge (+50%)', multiplier: 1.5, description: '+50% speed bonus points on fast answers!', color: '#ec4899', icon: '🚀' },
  { label: 'Golden Buzzer', multiplier: 1.25, description: 'Immediate +100 bonus points credited to your team!', color: '#eab308', icon: '👑' },
];

export const SpinWheel: React.FC<SpinWheelProps> = ({ onSpinComplete, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPerk, setSelectedPerk] = useState<typeof WHEEL_SECTORS[0] | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const randomIndex = Math.floor(Math.random() * WHEEL_SECTORS.length);
    const sectorAngle = 360 / WHEEL_SECTORS.length;
    // Extra full spins (5 to 8 rotations) + target angle
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const targetRotation = extraSpins + (360 - (randomIndex * sectorAngle + sectorAngle / 2));

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const perk = WHEEL_SECTORS[randomIndex];
      setSelectedPerk(perk);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-[32px] shadow-2xl p-6 sm:p-8 text-center text-slate-800">
        
        <div className="space-y-1 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-block">
            Round Perk Bonus Wheel
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Spin For Match Perks! 🎡
          </h3>
          <p className="text-xs text-slate-500">
            Spin the wheel to unlock game-show advantages for your team
          </p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 mx-auto my-6 flex items-center justify-center">
          
          {/* Pointer needle */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-500 filter drop-shadow-md" />

          {/* Wheel Graphic */}
          <div
            className="w-full h-full rounded-full border-4 border-slate-900 shadow-2xl relative overflow-hidden transition-all duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {WHEEL_SECTORS.map((sector, idx) => {
              const angle = (360 / WHEEL_SECTORS.length) * idx;
              return (
                <div
                  key={idx}
                  className="absolute w-1/2 h-full top-0 left-1/2 origin-left flex items-center justify-end pr-4 text-[10px] font-black text-white"
                  style={{
                    backgroundColor: sector.color,
                    transform: `rotate(${angle}deg)`
                  }}
                >
                  <span className="transform rotate-90 inline-block drop-shadow truncate max-w-[80px]">
                    {sector.icon} {sector.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Hub */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || !!selectedPerk}
            className="absolute z-10 w-16 h-16 rounded-full bg-slate-900 border-4 border-white text-white font-black text-xs uppercase shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition disabled:opacity-80"
          >
            {isSpinning ? '...' : selectedPerk ? '✓' : 'SPIN'}
          </button>
        </div>

        {/* Selected Perk Announcement */}
        {selectedPerk ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-left space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-sm font-black text-amber-950">
              <span className="text-xl">{selectedPerk.icon}</span>
              <span>{selectedPerk.label} Unlocked!</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              {selectedPerk.description}
            </p>
            <button
              onClick={() => onSpinComplete(selectedPerk)}
              className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase transition shadow-sm"
            >
              Apply Perk & Enter Round →
            </button>
          </div>
        ) : (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition"
          >
            {isSpinning ? 'Spinning The Wheel...' : 'Tap to Spin Wheel'}
          </button>
        )}

      </div>
    </div>
  );
};
