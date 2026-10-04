import React from 'react';
import { Trophy, RotateCcw, Share2, Award } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface GameCompleteModalProps {
  isOpen: boolean;
  totalDeaths: number;
  onRestartGame: () => void;
  onOpenLevelSelect: () => void;
}

export const GameCompleteModal: React.FC<GameCompleteModalProps> = ({
  isOpen,
  totalDeaths,
  onRestartGame,
  onOpenLevelSelect,
}) => {
  if (!isOpen) return null;

  // Grade calculation
  let grade = 'S - Master of Deceit';
  let gradeColor = 'text-amber-300';
  if (totalDeaths > 80) {
    grade = 'C - Unbreakable Will';
    gradeColor = 'text-rose-400';
  } else if (totalDeaths > 40) {
    grade = 'B - Trap Survivor';
    gradeColor = 'text-sky-300';
  } else if (totalDeaths > 15) {
    grade = 'A - Keen Observer';
    gradeColor = 'text-emerald-400';
  }

  const handleShare = () => {
    sounds.playClick();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `🏆 I conquered all 20 levels of Level Deceit with ${totalDeaths} deaths! Can you beat my score?`
      );
      alert('Score copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#16182a] border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Animated Trophy Icon */}
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 mb-3 shadow-xl shadow-amber-500/20 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-bold font-arcade tracking-wider text-amber-300">
          ALL 20 LEVELS CONQUERED!
        </h1>

        <p className="text-xs text-white/70 mt-1 mb-4">
          You outsmarted every deceptive floor, moving door, and sneaky spike!
        </p>

        {/* Stats card */}
        <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 mb-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60">Total Deaths:</span>
            <span className="font-arcade font-bold text-rose-400 text-lg">
              💀 {totalDeaths}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm border-t border-white/10 pt-2">
            <span className="text-white/60">Final Rank:</span>
            <span className={`font-arcade font-bold ${gradeColor}`}>{grade}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Achievement</span>
          </button>

          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenLevelSelect();
              }}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white/90 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Level Select</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onRestartGame();
              }}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white/90 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
