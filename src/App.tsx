/**
 * Level Deceit - A hilarious 20-level troll-platformer
 * Tailored for Android 8.1+ & 720x1520 screens, responsive across all devices.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LEVELS } from './levels/levelData';
import { GameCanvas } from './components/GameCanvas';
import { TouchControls } from './components/TouchControls';
import { HeaderBar } from './components/HeaderBar';
import { LevelSelectModal } from './components/LevelSelectModal';
import { VictoryModal } from './components/VictoryModal';
import { GameCompleteModal } from './components/GameCompleteModal';
import { HintModal } from './components/HintModal';
import { sounds } from './audio/soundManager';

const STORAGE_KEY = 'level_deceit_save_v1';

export default function App() {
  // Current playing level ID (1 to 20)
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [levelDeaths, setLevelDeaths] = useState<Record<number, number>>({});
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals state
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [showGameComplete, setShowGameComplete] = useState<boolean>(false);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);

  // Restart key trigger to force GameCanvas re-mount/reset
  const [canvasKey, setCanvasKey] = useState<number>(0);

  // Input state
  const [inputState, setInputState] = useState<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  // Load progress from localStorage on boot
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.unlockedLevel) setUnlockedLevel(Math.min(20, Math.max(1, parsed.unlockedLevel)));
        if (parsed.currentLevelId) setCurrentLevelId(Math.min(20, Math.max(1, parsed.currentLevelId)));
        if (parsed.levelDeaths) setLevelDeaths(parsed.levelDeaths);
        if (parsed.soundEnabled !== undefined) {
          setSoundEnabled(parsed.soundEnabled);
          sounds.setEnabled(parsed.soundEnabled);
        }
      }
    } catch {}
  }, []);

  // Save progress helper
  const saveProgress = useCallback((newUnlocked: number, newDeaths: Record<number, number>, currentId: number) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          unlockedLevel: newUnlocked,
          currentLevelId: currentId,
          levelDeaths: newDeaths,
          soundEnabled: sounds.enabled,
        })
      );
    } catch {}
  }, []);

  // Current level definition
  const currentLevel = useMemo(() => {
    return LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];
  }, [currentLevelId]);

  // Restart current level
  const handleRestart = useCallback(() => {
    setCanvasKey((prev) => prev + 1);
  }, []);

  // Player died
  const handlePlayerDeath = useCallback(() => {
    setLevelDeaths((prev) => {
      const updated = {
        ...prev,
        [currentLevelId]: (prev[currentLevelId] || 0) + 1,
      };
      saveProgress(unlockedLevel, updated, currentLevelId);
      return updated;
    });
  }, [currentLevelId, saveProgress, unlockedLevel]);

  // Level completed
  const handleLevelComplete = useCallback(() => {
    if (currentLevelId === 20) {
      setShowGameComplete(true);
    } else {
      setShowVictoryModal(true);
    }

    const nextUnlocked = Math.max(unlockedLevel, currentLevelId + 1);
    setUnlockedLevel(nextUnlocked);
    saveProgress(nextUnlocked, levelDeaths, currentLevelId);
  }, [currentLevelId, levelDeaths, saveProgress, unlockedLevel]);

  // Proceed to next level
  const handleNextLevel = useCallback(() => {
    setShowVictoryModal(false);
    if (currentLevelId < 20) {
      const nextId = currentLevelId + 1;
      setCurrentLevelId(nextId);
      setCanvasKey((prev) => prev + 1);
      saveProgress(Math.max(unlockedLevel, nextId), levelDeaths, nextId);
    } else {
      setShowGameComplete(true);
    }
  }, [currentLevelId, levelDeaths, saveProgress, unlockedLevel]);

  // Skip level (available after 4+ deaths)
  const handleSkipLevel = useCallback(() => {
    if (currentLevelId < 20) {
      const nextId = currentLevelId + 1;
      setCurrentLevelId(nextId);
      setCanvasKey((prev) => prev + 1);
      const nextUnlocked = Math.max(unlockedLevel, nextId);
      setUnlockedLevel(nextUnlocked);
      saveProgress(nextUnlocked, levelDeaths, nextId);
    }
  }, [currentLevelId, levelDeaths, saveProgress, unlockedLevel]);

  // Select level from modal
  const handleSelectLevel = useCallback((levelId: number) => {
    setCurrentLevelId(levelId);
    setCanvasKey((prev) => prev + 1);
    setShowVictoryModal(false);
    setShowGameComplete(false);
  }, []);

  // Reset entire progress
  const handleResetProgress = useCallback(() => {
    setUnlockedLevel(1);
    setCurrentLevelId(1);
    setLevelDeaths({});
    setCanvasKey((prev) => prev + 1);
    setShowLevelSelect(false);
    setShowGameComplete(false);
    setShowVictoryModal(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  // Toggle sound
  const handleToggleSound = useCallback(() => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sounds.setEnabled(nextVal);
  }, [soundEnabled]);

  // Handle hardware / keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling on arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setInputState((prev) => ({ ...prev, left: true }));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setInputState((prev) => ({ ...prev, right: true }));
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        setInputState((prev) => ({ ...prev, jump: true }));
      } else if (e.key === 'r' || e.key === 'R') {
        handleRestart();
      } else if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') {
        setShowLevelSelect((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setInputState((prev) => ({ ...prev, left: false }));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setInputState((prev) => ({ ...prev, right: false }));
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        setInputState((prev) => ({ ...prev, jump: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleRestart]);

  // Handle on-screen touch inputs
  const handleTouchInput = useCallback((action: 'left' | 'right' | 'jump', active: boolean) => {
    setInputState((prev) => ({
      ...prev,
      [action]: active,
    }));
  }, []);

  const totalDeaths = useMemo(() => {
    return Object.values(levelDeaths).reduce((a, b) => a + b, 0);
  }, [levelDeaths]);

  const currentLevelDeaths = levelDeaths[currentLevelId] || 0;

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-between bg-[#0b0c13] text-white overflow-hidden select-none touch-none">
      {/* 720x1520 Phone frame wrapper */}
      <div className="w-full h-full max-w-[720px] max-h-[1520px] flex flex-col justify-between relative shadow-2xl overflow-hidden border-x border-white/5">
        {/* Top Header Bar */}
        <HeaderBar
          levelId={currentLevelId}
          totalLevels={LEVELS.length}
          levelTitle={currentLevel.title}
          deaths={currentLevelDeaths}
          totalDeaths={totalDeaths}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onRestart={handleRestart}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          onSkipLevel={currentLevelDeaths >= 4 ? handleSkipLevel : undefined}
          onShowHint={() => setShowHintModal(true)}
        />

        {/* Subtitle / Tease bar */}
        <div className="w-full px-4 py-1 text-center bg-black/40 text-xs text-white/50 border-b border-white/5 truncate font-mono">
          <span>{currentLevel.subtitle}</span>
        </div>

        {/* Game Canvas Viewport */}
        <main className="flex-1 w-full min-h-0 relative p-2 sm:p-4 flex items-center justify-center">
          <GameCanvas
            key={canvasKey}
            level={currentLevel}
            onLevelComplete={handleLevelComplete}
            onPlayerDeath={handlePlayerDeath}
            isPaused={showLevelSelect || showVictoryModal || showGameComplete || showHintModal}
            inputState={inputState}
            onRestart={handleRestart}
          />
        </main>

        {/* Ergonomic Mobile Touch Controls Deck */}
        <footer className="w-full flex-none pb-4 pt-1 bg-gradient-to-t from-black via-[#0d0e19] to-transparent">
          <TouchControls onInput={handleTouchInput} />
        </footer>
      </div>

      {/* Modals */}
      <LevelSelectModal
        isOpen={showLevelSelect}
        onClose={() => setShowLevelSelect(false)}
        levels={LEVELS}
        currentLevelId={currentLevelId}
        unlockedLevel={unlockedLevel}
        deaths={levelDeaths}
        onSelectLevel={handleSelectLevel}
        onResetProgress={handleResetProgress}
      />

      <VictoryModal
        isOpen={showVictoryModal}
        levelId={currentLevelId}
        deathsThisLevel={currentLevelDeaths}
        onNextLevel={handleNextLevel}
        onReplay={() => {
          setShowVictoryModal(false);
          handleRestart();
        }}
      />

      <GameCompleteModal
        isOpen={showGameComplete}
        totalDeaths={totalDeaths}
        onRestartGame={handleResetProgress}
        onOpenLevelSelect={() => {
          setShowGameComplete(false);
          setShowLevelSelect(true);
        }}
      />

      <HintModal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        levelId={currentLevelId}
        levelTitle={currentLevel.title}
        hint={currentLevel.hint || 'Watch out for sudden movements!'}
        trollName={currentLevel.trollName}
      />
    </div>
  );
}
