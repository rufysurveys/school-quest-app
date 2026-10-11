import React, { useRef, useEffect } from 'react';
import { X, Download, Share2, Award, Trophy, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface ShareableBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  badgeTitle: string;
  badgeSubtitle?: string;
  score?: number;
  accuracy?: number;
  rank?: number;
  type?: 'winner' | 'fastest_finger' | 'mastery_80';
}

export const ShareableBadgeModal: React.FC<ShareableBadgeModalProps> = ({
  isOpen,
  onClose,
  user,
  badgeTitle,
  badgeSubtitle = 'Official FCT Academic Quest Award',
  score = 1250,
  accuracy = 95,
  rank = 1,
  type = 'winner'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size
    canvas.width = 600;
    canvas.height = 420;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 600, 420);
    bgGradient.addColorStop(0, '#064e3b');
    bgGradient.addColorStop(0.5, '#0f172a');
    bgGradient.addColorStop(1, '#78350f');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 600, 420);

    // Decorative Borders
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(16, 16, 568, 388);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#10b981';
    ctx.strokeRect(24, 24, 552, 372);

    // Top Header
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FEDERAL CAPITAL TERRITORY • SECONDARY SCHOOLS QUEST', 300, 60);

    // Trophy Icon Text
    ctx.font = '42px sans-serif';
    ctx.fillText('🏆', 300, 115);

    // Badge Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(badgeTitle.toUpperCase(), 300, 160);

    // Recipient Name
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(user.name, 300, 205);

    // School Name & Class
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px sans-serif';
    ctx.fillText(`${user.school} • ${user.classLevel || 'SS1'} (${user.classType || 'Science'})`, 300, 235);

    // Stat boxes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(80, 260, 440, 65);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(80, 260, 440, 65);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`${score} XP`, 150, 290);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('Total Score', 150, 310);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`${accuracy}%`, 300, 290);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('Accuracy Rate', 300, 310);

    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`Rank #${rank}`, 450, 290);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('Championship', 450, 310);

    // Footer Verified Stamp
    ctx.fillStyle = '#a7f3d0';
    ctx.font = 'italic 12px sans-serif';
    ctx.fillText('Verified by FCT Curriculum & Academic Integrity Board', 300, 360);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Issued: ${new Date().toLocaleDateString()} • https://school-quest-app.vercel.app`, 300, 380);
  }, [isOpen, user, badgeTitle, score, accuracy, rank]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `FCT_Quest_Badge_${user.name.replace(/\s+/g, '_')}.png`;
    link.href = url;
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FCT Secondary Schools Quest Badge',
        text: `I just won the ${badgeTitle} representing ${user.school} on FCT Secondary Schools Quest!`,
        url: window.location.href
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(
        `🏆 Check out my ${badgeTitle} from ${user.school} on FCT Secondary Schools Quest! Play at https://school-quest-app.vercel.app`
      );
      alert('Share link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-center text-slate-800">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-block">
            Verified Digital Achievement
          </span>
          <h3 className="text-xl font-black text-slate-900 font-display">
            Your Official Shareable Badge 🎖️
          </h3>
          <p className="text-xs text-slate-500">
            Download or share your academic certificate across WhatsApp and social media
          </p>
        </div>

        {/* Generated Canvas Preview */}
        <div className="w-full overflow-hidden rounded-2xl shadow-xl border border-slate-200 my-4 bg-slate-950 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-w-[540px] rounded-2xl"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res Badge</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Achievement</span>
          </button>
        </div>

      </div>
    </div>
  );
};
