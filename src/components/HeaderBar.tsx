import React from 'react';
import { RotateCcw, Volume2, VolumeX, Grid, FastForward, HelpCircle } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface HeaderBarProps {
  levelId: number;
  totalLevels: number;
  levelTitle: string;
  deaths: number;
  totalDeaths: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
  onSkipLevel?: () => void;
  onShowHint: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  levelId,
  totalLevels,
  levelTitle,
  deaths,
  soundEnabled,
  onToggleSound,
  onRestart,
  onOpenLevelSelect,
  onSkipLevel,
  onShowHint,
}) => {
  return (
    <header className="w-full flex-none px-3 py-2 border-b border-white/10 bg-[#12141f]/90 backdrop-blur-md flex items-center justify-between z-20">
      {/* Left: Level Select & Level Number */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onOpenLevelSelect();
          }}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          title="Level Select"
          aria-label="Level Select"
        >
          <Grid className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-sky-400 font-arcade tracking-wider">
              LEVEL {String(levelId).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-white/40">/ {totalLevels}</span>
          </div>
          <div className="text-xs font-semibold text-white/90 truncate max-w-[120px] sm:max-w-[200px]">
            {levelTitle}
          </div>
        </div>
      </div>

      {/* Middle: Deaths counter & optional Skip button */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-arcade font-bold">
          <span>💀</span>
          <span>{deaths}</span>
        </div>

        {deaths >= 4 && onSkipLevel && (
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onSkipLevel();
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/30 active:scale-95 transition-all animate-pulse"
            title="Skip this tricky level"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Skip</span>
          </button>
        )}
      </div>

      {/* Right: Hint, Sound & Quick Restart */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onShowHint();
          }}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-amber-300 hover:bg-white/10 active:scale-95 transition-all"
          title="Hint"
          aria-label="Show Hint"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onToggleSound();
          }}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          title={soundEnabled ? 'Mute' : 'Unmute'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onRestart();
          }}
          className="p-2 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-300 hover:bg-sky-500/25 active:scale-95 transition-all"
          title="Restart Level (R)"
          aria-label="Restart Level"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
};
