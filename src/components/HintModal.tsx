import React from 'react';
import { X, Lightbulb } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelTitle: string;
  levelId: number;
  hint: string;
  trollName: string;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  levelTitle,
  levelId,
  hint,
  trollName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#161827] border border-amber-400/40 rounded-3xl p-5 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span className="font-arcade font-bold text-white text-sm">
              LEVEL {levelId} HINT
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-4 space-y-3">
          <div className="text-xs text-white/50 uppercase tracking-wider font-semibold">
            Trap Identified: <span className="text-rose-400">{trollName}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm leading-relaxed">
            {hint}
          </div>
          <div className="text-[11px] text-white/40 italic">
            "Every trap has a weakness. Keep your eyes sharp!"
          </div>
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-all"
        >
          Got It, Let Me Try!
        </button>
      </div>
    </div>
  );
};
