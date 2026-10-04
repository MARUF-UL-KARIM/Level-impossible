import React from 'react';
import { X, Lock, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { LevelDefinition } from '../types/game';
import { sounds } from '../audio/soundManager';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  levels: LevelDefinition[];
  currentLevelId: number;
  unlockedLevel: number;
  deaths: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
  onResetProgress: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  levels,
  currentLevelId,
  unlockedLevel,
  deaths,
  onSelectLevel,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const totalDeaths = Object.values(deaths).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[85vh] bg-[#141624] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#1a1d30]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white font-arcade tracking-wider">
              SELECT LEVEL (1 - 20)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats summary bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-black/20 border-b border-white/5 text-xs text-white/60">
          <div>
            Progress: <span className="text-emerald-400 font-bold">{unlockedLevel} / 20</span>
          </div>
          <div>
            Total Deaths: <span className="text-rose-400 font-bold">{totalDeaths}</span>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 gap-2.5">
          {levels.map((lvl) => {
            const isUnlocked = lvl.id <= unlockedLevel;
            const isCurrent = lvl.id === currentLevelId;
            const isCompleted = lvl.id < unlockedLevel;
            const lvlDeaths = deaths[lvl.id] || 0;

            return (
              <button
                key={lvl.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  sounds.playClick();
                  onSelectLevel(lvl.id);
                  onClose();
                }}
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-150 active:scale-95 ${
                  isCurrent
                    ? 'bg-sky-500/25 border-sky-400 shadow-lg shadow-sky-500/20 text-white'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/20'
                    : isUnlocked
                    ? 'bg-white/5 border-white/15 text-white/90 hover:bg-white/10'
                    : 'bg-white/[0.02] border-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                {/* Level number or lock */}
                <div className="text-base font-bold font-arcade">
                  {isUnlocked ? (
                    String(lvl.id).padStart(2, '0')
                  ) : (
                    <Lock className="w-4 h-4 text-white/30 my-0.5" />
                  )}
                </div>

                {/* Subtitle / Deaths badge */}
                <div className="text-[10px] mt-0.5 truncate max-w-full font-medium">
                  {isUnlocked ? (
                    isCompleted ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> {lvlDeaths}💀
                      </span>
                    ) : (
                      <span className="text-sky-300">Play</span>
                    )
                  ) : (
                    <span className="text-white/20">Lock</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-white/10 bg-[#1a1d30] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all progress and deaths?')) {
                sounds.playClick();
                onResetProgress();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
};
