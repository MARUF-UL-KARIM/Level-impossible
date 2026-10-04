import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface TouchControlsProps {
  onInput: (action: 'left' | 'right' | 'jump', active: boolean) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onInput }) => {
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);
  const [jumpActive, setJumpActive] = useState(false);

  const handleTouch = (action: 'left' | 'right' | 'jump', active: boolean, e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (action === 'left') setLeftActive(active);
    if (action === 'right') setRightActive(active);
    if (action === 'jump') setJumpActive(active);

    if (active) {
      sounds.triggerHaptic(12);
    }
    onInput(action, active);
  };

  return (
    <div className="w-full flex-none px-4 py-3 select-none flex items-center justify-between touch-none max-w-md mx-auto">
      {/* Directional Pad (Left & Right) */}
      <div className="flex items-center gap-3">
        {/* Left Button */}
        <button
          type="button"
          onTouchStart={(e) => handleTouch('left', true, e)}
          onTouchEnd={(e) => handleTouch('left', false, e)}
          onTouchCancel={(e) => handleTouch('left', false, e)}
          onMouseDown={(e) => handleTouch('left', true, e)}
          onMouseUp={(e) => handleTouch('left', false, e)}
          onMouseLeave={(e) => handleTouch('left', false, e)}
          className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-75 border-2 shadow-lg active:scale-95 ${
            leftActive
              ? 'bg-sky-500/40 border-sky-400 text-sky-200 shadow-sky-500/30 scale-95'
              : 'bg-[#181a27] border-white/15 text-white/80 active:bg-sky-500/20 active:border-sky-400'
          }`}
          aria-label="Move Left"
        >
          <ArrowLeft className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>

        {/* Right Button */}
        <button
          type="button"
          onTouchStart={(e) => handleTouch('right', true, e)}
          onTouchEnd={(e) => handleTouch('right', false, e)}
          onTouchCancel={(e) => handleTouch('right', false, e)}
          onMouseDown={(e) => handleTouch('right', true, e)}
          onMouseUp={(e) => handleTouch('right', false, e)}
          onMouseLeave={(e) => handleTouch('right', false, e)}
          className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-75 border-2 shadow-lg active:scale-95 ${
            rightActive
              ? 'bg-sky-500/40 border-sky-400 text-sky-200 shadow-sky-500/30 scale-95'
              : 'bg-[#181a27] border-white/15 text-white/80 active:bg-sky-500/20 active:border-sky-400'
          }`}
          aria-label="Move Right"
        >
          <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>
      </div>

      {/* Jump Button (Right Thumb) */}
      <div className="flex items-center">
        <button
          type="button"
          onTouchStart={(e) => handleTouch('jump', true, e)}
          onTouchEnd={(e) => handleTouch('jump', false, e)}
          onTouchCancel={(e) => handleTouch('jump', false, e)}
          onMouseDown={(e) => handleTouch('jump', true, e)}
          onMouseUp={(e) => handleTouch('jump', false, e)}
          onMouseLeave={(e) => handleTouch('jump', false, e)}
          className={`w-22 h-22 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center transition-all duration-75 border-2 shadow-xl active:scale-95 ${
            jumpActive
              ? 'bg-emerald-500/40 border-emerald-400 text-emerald-100 shadow-emerald-500/30 scale-95'
              : 'bg-[#181a27] border-emerald-500/30 text-emerald-400 active:bg-emerald-500/30'
          }`}
          aria-label="Jump"
        >
          <ArrowUp className="w-9 h-9 sm:w-10 sm:h-10" />
          <span className="text-[11px] font-bold tracking-wider uppercase font-arcade mt-0.5">
            JUMP
          </span>
        </button>
      </div>
    </div>
  );
};
