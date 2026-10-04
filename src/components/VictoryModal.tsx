import React from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface VictoryModalProps {
  isOpen: boolean;
  levelId: number;
  deathsThisLevel: number;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  levelId,
  deathsThisLevel,
  onNextLevel,
  onReplay,
}) => {
  if (!isOpen) return null;

  const victoryRoasts = [
    'You saw right through the deceit!',
    'Fooled once, never twice!',
    'Look at you, dodging tricky traps!',
    'Reflexes of a champion!',
    'The trap tried its best, but failed.',
  ];
  const roast = victoryRoasts[levelId % victoryRoasts.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#151829] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Floating victory badge */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-emerald-500/20 animate-bounce">
          🎉
        </div>

        <h2 className="text-xl font-bold font-arcade tracking-wider text-white">
          LEVEL {String(levelId).padStart(2, '0')} CLEARED!
        </h2>

        <p className="text-xs text-white/60 mt-1 mb-4 italic">"{roast}"</p>

        {/* Stats card */}
        <div className="w-full bg-black/30 border border-white/10 rounded-2xl p-3 flex justify-around items-center mb-5 text-sm">
          <div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">Deaths</div>
            <div className="font-arcade font-bold text-rose-400 text-lg">
              💀 {deathsThisLevel}
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider">Rating</div>
            <div className="font-arcade font-bold text-amber-300 text-lg">
              {deathsThisLevel === 0 ? 'FLAWLESS 🌟' : deathsThisLevel <= 3 ? 'GREAT ⚡' : 'SURVIVED 🛡️'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onReplay();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white/90 text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onNextLevel();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
          >
            <span>Next Level</span>
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
