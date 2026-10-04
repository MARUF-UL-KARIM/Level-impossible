import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LevelDefinition, Player, Particle, GameState } from '../types/game';
import { sounds } from '../audio/soundManager';

interface GameCanvasProps {
  level: LevelDefinition;
  onLevelComplete: () => void;
  onPlayerDeath: () => void;
  isPaused: boolean;
  inputState: { left: boolean; right: boolean; jump: boolean };
  onRestart: () => void;
}

const V_WIDTH = 800;
const V_HEIGHT = 500;
const GRAVITY = 0.58;
const MAX_FALL_SPEED = 12;
const RUN_SPEED = 4.8;
const ACCEL = 1.1;
const JUMP_FORCE = -11.2;

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level: initialLevel,
  onLevelComplete,
  onPlayerDeath,
  isPaused,
  inputState,
  onRestart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Deep clone level definition for current attempt so traps can mutate safely
  const currentLevelRef = useRef<LevelDefinition>(JSON.parse(JSON.stringify(initialLevel)));
  const gameStateRef = useRef<GameState>('playing');
  const [trollAlert, setTrollAlert] = useState<string | null>(null);

  // Player state
  const playerRef = useRef<Player>({
    x: initialLevel.playerStart.x,
    y: initialLevel.playerStart.y,
    width: 28,
    height: 28,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facing: 'right',
    squashX: 1,
    squashY: 1,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    eyeLookX: 0,
    eyeLookY: 0,
    blinkTimer: 0,
    isBlinking: false,
    gravityInverted: false,
  });

  // Shadow clone for Level 14
  const shadowRef = useRef<Player | null>(null);

  // Particles
  const particlesRef = useRef<Particle[]>([]);
  // Screen shake
  const shakeRef = useRef<number>(0);
  // Controls inversion active
  const invertedRef = useRef<boolean>(!!initialLevel.controlsInverted);
  // Real door revealed for fake door levels
  const realDoorRef = useRef<{ x: number; y: number; width: number; height: number; active: boolean } | null>(null);

  // Geyser timers for Level 13
  const geyserTimerRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Reset/Initialize level
  const resetLevel = useCallback(() => {
    currentLevelRef.current = JSON.parse(JSON.stringify(initialLevel));
    gameStateRef.current = 'playing';
    setTrollAlert(null);
    shakeRef.current = 0;
    frameCountRef.current = 0;
    geyserTimerRef.current = 0;
    invertedRef.current = !!initialLevel.controlsInverted;
    realDoorRef.current = null;

    playerRef.current = {
      x: initialLevel.playerStart.x,
      y: initialLevel.playerStart.y,
      width: 28,
      height: 28,
      vx: 0,
      vy: 0,
      isGrounded: false,
      facing: 'right',
      squashX: 1,
      squashY: 1,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      eyeLookX: 0,
      eyeLookY: 0,
      blinkTimer: 120,
      isBlinking: false,
      gravityInverted: false,
    };

    if (initialLevel.shadowClone) {
      shadowRef.current = {
        x: V_WIDTH - initialLevel.playerStart.x - 28,
        y: initialLevel.playerStart.y,
        width: 28,
        height: 28,
        vx: 0,
        vy: 0,
        isGrounded: false,
        facing: 'left',
        squashX: 1,
        squashY: 1,
        coyoteTimer: 0,
        jumpBufferTimer: 0,
        eyeLookX: 0,
        eyeLookY: 0,
        blinkTimer: 120,
        isBlinking: false,
      };
    } else {
      shadowRef.current = null;
    }
  }, [initialLevel]);

  // When initialLevel changes, reset
  useEffect(() => {
    resetLevel();
  }, [initialLevel, resetLevel]);

  // Trigger death
  const killPlayer = useCallback((customMsg?: string) => {
    if (gameStateRef.current === 'dead' || gameStateRef.current === 'level_cleared') return;
    gameStateRef.current = 'dead';
    shakeRef.current = 12;
    sounds.playDie();

    const p = playerRef.current;
    // Spawn death cubes
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particlesRef.current.push({
        x: p.x + p.width / 2,
        y: p.y + p.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 4 + Math.random() * 6,
        color: ['#38bdf8', '#0284c7', '#f43f5e', '#ffffff'][Math.floor(Math.random() * 4)],
        alpha: 1,
        life: 0,
        maxLife: 45 + Math.random() * 20,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.3,
      });
    }

    if (customMsg) {
      setTrollAlert(customMsg);
    } else {
      const deathQuotes = [
        'Gotcha!',
        'Did not see that coming, did you?',
        'Classic deceit!',
        'Almost had it... not really.',
        'Watch your step!',
        'It was a trap all along!',
        'Physics is a suggestion here.',
      ];
      setTrollAlert(deathQuotes[Math.floor(Math.random() * deathQuotes.length)]);
    }

    onPlayerDeath();

    // Auto respawn after brief funny pause
    setTimeout(() => {
      resetLevel();
    }, 700);
  }, [onPlayerDeath, resetLevel]);

  // Trigger win
  const completeLevel = useCallback(() => {
    if (gameStateRef.current === 'level_cleared' || gameStateRef.current === 'dead') return;
    gameStateRef.current = 'level_cleared';
    sounds.playWin();

    const door = currentLevelRef.current.door;
    // Confetti particles
    for (let i = 0; i < 36; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      particlesRef.current.push({
        x: door.x + door.width / 2,
        y: door.y + door.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 5 + Math.random() * 5,
        color: ['#10b981', '#f59e0b', '#38bdf8', '#ec4899', '#a855f7'][Math.floor(Math.random() * 5)],
        alpha: 1,
        life: 0,
        maxLife: 60,
        rotation: 0,
        vRot: 0.1,
      });
    }

    setTimeout(() => {
      onLevelComplete();
    }, 600);
  }, [onLevelComplete]);

  // Main game loop
  useEffect(() => {
    let animId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      frameCountRef.current++;
      const frame = frameCountRef.current;
      const lvl = currentLevelRef.current;
      const p = playerRef.current;
      const shadow = shadowRef.current;

      if (!isPaused && gameStateRef.current === 'playing') {
        // --- INPUT RESOLUTION ---
        let moveLeft = inputState.left;
        let moveRight = inputState.right;
        let jumpPressed = inputState.jump;

        if (invertedRef.current) {
          const temp = moveLeft;
          moveLeft = moveRight;
          moveRight = temp;
        }

        // Horizontal Acceleration
        let targetVx = 0;
        if (moveLeft && !moveRight) {
          targetVx = -RUN_SPEED;
          p.facing = 'left';
        } else if (moveRight && !moveLeft) {
          targetVx = RUN_SPEED;
          p.facing = 'right';
        }

        // Friction handling
        let friction = 0.78;
        if (lvl.icePhysics) friction = 0.95;

        // Check if player is standing on special platform
        let standingOnSticky = false;
        let standingOnIce = false;

        lvl.platforms.forEach((plat) => {
          if (
            plat.type === 'sticky' &&
            p.x + p.width > plat.x &&
            p.x < plat.x + plat.width &&
            Math.abs(p.y + p.height - plat.y) < 4
          ) {
            standingOnSticky = true;
          }
          if (
            plat.type === 'ice' &&
            p.x + p.width > plat.x &&
            p.x < plat.x + plat.width &&
            Math.abs(p.y + p.height - plat.y) < 4
          ) {
            standingOnIce = true;
          }
        });

        if (standingOnSticky) {
          friction = 0.45;
          targetVx *= 0.6;
        } else if (standingOnIce) {
          friction = 0.96;
        }

        p.vx += (targetVx - p.vx) * (1 - friction) * ACCEL;

        // Gravity
        const grav = p.gravityInverted ? -GRAVITY : GRAVITY;
        p.vy += grav;
        if (Math.abs(p.vy) > MAX_FALL_SPEED) {
          p.vy = Math.sign(p.vy) * MAX_FALL_SPEED;
        }

        // Coyote Timer & Jump Buffering
        if (p.isGrounded) {
          p.coyoteTimer = 6;
        } else if (p.coyoteTimer > 0) {
          p.coyoteTimer--;
        }

        if (jumpPressed) {
          p.jumpBufferTimer = 6;
        } else if (p.jumpBufferTimer > 0) {
          p.jumpBufferTimer--;
        }

        // Jump Execution
        if (p.jumpBufferTimer > 0 && p.coyoteTimer > 0) {
          const jumpPower = standingOnSticky ? JUMP_FORCE * 0.75 : JUMP_FORCE;
          p.vy = p.gravityInverted ? -jumpPower : jumpPower;
          p.coyoteTimer = 0;
          p.jumpBufferTimer = 0;
          p.isGrounded = false;
          p.squashX = 0.7;
          p.squashY = 1.35;
          sounds.playJump();

          // Sneaky Spikes Trigger (Level 7)
          if (lvl.id === 7) {
            lvl.spikes.forEach((spk) => {
              if (spk.id.startsWith('slide')) {
                spk.vx = -4.2;
              }
            });
            sounds.playTroll();
            setTrollAlert('Jumped right into the trap!');
          }
        }

        // Variable jump height: cut vertical boost if jump button is released early
        if (!jumpPressed && !p.gravityInverted && p.vy < -3) {
          p.vy *= 0.85;
        } else if (!jumpPressed && p.gravityInverted && p.vy > 3) {
          p.vy *= 0.85;
        }

        // --- PLATFORM COLLISIONS (X then Y sweep) ---
        // Predict X
        let newX = p.x + p.vx;
        let newY = p.y;

        lvl.platforms.forEach((plat) => {
          if (plat.type === 'fake' || (plat.type === 'hidden' && !plat.isRevealed)) return;
          if (plat.isCrumbled) return;

          // Check X collision
          if (
            newX < plat.x + plat.width &&
            newX + p.width > plat.x &&
            p.y < plat.y + plat.height &&
            p.y + p.height > plat.y
          ) {
            if (p.vx > 0) {
              newX = plat.x - p.width;
              p.vx = 0;
            } else if (p.vx < 0) {
              newX = plat.x + plat.width;
              p.vx = 0;
            }
          }
        });
        p.x = newX;

        // Predict Y
        newY = p.y + p.vy;
        p.isGrounded = false;

        lvl.platforms.forEach((plat) => {
          if (plat.type === 'fake') {
            // Check if player walked through hologram
            if (
              p.x + p.width > plat.x &&
              p.x < plat.x + plat.width &&
              p.y + p.height >= plat.y &&
              p.y <= plat.y + plat.height
            ) {
              plat.color = 'rgba(239, 68, 68, 0.4)';
              sounds.playTroll();
              setTrollAlert('PSYCH! Hologram floor!');
            }
            return;
          }

          if (plat.type === 'hidden' && !plat.isRevealed) {
            // Reveal if player hits underside or lands on it
            if (
              p.x + p.width > plat.x &&
              p.x < plat.x + plat.width &&
              newY < plat.y + plat.height &&
              newY + p.height > plat.y
            ) {
              plat.isRevealed = true;
              plat.color = '#38bdf8';
              sounds.playClick();
              setTrollAlert('Hidden step revealed!');
            } else {
              return;
            }
          }

          if (plat.isCrumbled) return;

          if (
            p.x < plat.x + plat.width &&
            p.x + p.width > plat.x &&
            newY < plat.y + plat.height &&
            newY + p.height > plat.y
          ) {
            if (!p.gravityInverted) {
              if (p.vy > 0 && p.y + p.height <= plat.y + 12) {
                // Landing on top
                newY = plat.y - p.height;
                p.vy = 0;
                p.isGrounded = true;

                // Squash on landing
                if (p.squashY < 0.85) {
                  p.squashX = 1.3;
                  p.squashY = 0.7;
                }

                // Crumbling platform logic
                if (plat.type === 'crumbling' && plat.crumbleTimer === undefined) {
                  plat.crumbleTimer = 22; // ~0.36 seconds
                  sounds.playWarning();
                }

                // Bounce pad logic
                if (plat.id.startsWith('bounce')) {
                  p.vy = -14.5;
                  p.isGrounded = false;
                  sounds.playJump();
                  sounds.triggerHaptic(30);
                  plat.targetY = plat.y + 6;
                }
              } else if (p.vy < 0) {
                // Hitting head
                newY = plat.y + plat.height;
                p.vy = 0;
              }
            } else {
              // Inverted gravity: landing on underside of ceiling
              if (p.vy < 0 && p.y >= plat.y + plat.height - 12) {
                newY = plat.y + plat.height;
                p.vy = 0;
                p.isGrounded = true;
              } else if (p.vy > 0) {
                newY = plat.y - p.height;
                p.vy = 0;
              }
            }
          }
        });
        p.y = newY;

        // Shadow clone update (Level 14)
        if (shadow) {
          shadow.vx = -p.vx;
          shadow.vy = p.vy;
          shadow.x += shadow.vx;
          shadow.y += shadow.vy;
          shadow.facing = p.facing === 'left' ? 'right' : 'left';

          // Clamp shadow within walls
          if (shadow.x < 30) shadow.x = 30;
          if (shadow.x > V_WIDTH - 60) shadow.x = V_WIDTH - 60;
        }

        // Platform animations & moving objects
        lvl.platforms.forEach((plat) => {
          // Crumbling timer
          if (plat.crumbleTimer !== undefined && plat.crumbleTimer > 0) {
            plat.crumbleTimer--;
            if (plat.crumbleTimer <= 0) {
              plat.isCrumbled = true;
              sounds.playTroll();
              // Spawn dust particles
              for (let i = 0; i < 10; i++) {
                particlesRef.current.push({
                  x: plat.x + Math.random() * plat.width,
                  y: plat.y + Math.random() * plat.height,
                  vx: (Math.random() - 0.5) * 3,
                  vy: 2 + Math.random() * 3,
                  size: 4,
                  color: '#94a3b8',
                  alpha: 1,
                  life: 0,
                  maxLife: 30,
                });
              }
            }
          }

          // Moving platforms (Crush wall, elevator, drop slabs)
          if (plat.type === 'moving' && plat.vx) {
            plat.x += plat.vx;
            if (plat.targetX && plat.x >= plat.targetX) {
              plat.vx = 0;
            }
            // Crusher check: if crusher pushes player into right wall
            if (plat.id === 'crush_wall' && p.x < plat.x + plat.width) {
              p.x = plat.x + plat.width;
              if (p.x + p.width >= 770) {
                killPlayer('Squished by the wall!');
              }
            }
          }

          if (plat.type === 'moving' && plat.vy) {
            plat.y += plat.vy;
            if (plat.targetY) {
              if (plat.vy < 0 && plat.y <= plat.targetY) {
                plat.y = plat.targetY;
                plat.vy = -plat.vy; // Bounce up and down
              } else if (plat.vy > 0 && plat.y >= plat.origY!) {
                plat.y = plat.origY!;
                plat.vy = -plat.vy;
              }
            }
          }

          // Falling floor in Level 2
          if (plat.id === 'drop_floor' && plat.vy && plat.vy > 0) {
            plat.y += plat.vy;
            if (plat.y > 600) plat.vy = 0;
          }
        });

        // Spikes movement and popup
        lvl.spikes.forEach((spk) => {
          // Sliding spikes
          if (spk.vx) {
            spk.x += spk.vx;
            if (spk.x < 150) spk.vx = 0;
          }

          // Popping spike
          if (spk.isPopping && spk.popProgress !== undefined && spk.popProgress < 1) {
            spk.popProgress = Math.min(1, spk.popProgress + 0.15);
            spk.y = spk.origY! - (spk.origY! - spk.targetY!) * spk.popProgress;
          }
        });

        // Spike Geysers (Level 13)
        if (lvl.id === 13) {
          geyserTimerRef.current = (geyserTimerRef.current + 1) % 120;
          const cycle = geyserTimerRef.current;
          lvl.spikes.forEach((spk) => {
            if (spk.id.startsWith('geyser')) {
              if (cycle > 40 && cycle < 90) {
                // Active spike geyser
                spk.popProgress = 1;
                spk.y = spk.targetY!;
              } else {
                // Inactive
                spk.popProgress = 0;
                spk.y = spk.origY!;
              }
            }
          });
        }

        // --- LEVEL SPECIFIC TRIGGERS ---
        lvl.triggers?.forEach((trig) => {
          if (trig.activated) return;

          // Check if player intersects trigger box
          const inTrig =
            p.x < trig.x + trig.width &&
            p.x + p.width > trig.x &&
            p.y < trig.y + trig.height &&
            p.y + p.height > trig.y;

          if (inTrig) {
            trig.activated = true;

            switch (trig.type) {
              case 'popup_spike': {
                const spk = lvl.spikes.find((s) => s.id === 'hidden_spike_1' || s.id === 'pop_s20');
                if (spk) {
                  spk.hidden = false;
                  spk.isPopping = true;
                  sounds.playTroll();
                  setTrollAlert('SURPRISE!');
                }
                break;
              }

              case 'fall_floor': {
                const dropFloor = lvl.platforms.find((pl) => pl.id === 'drop_floor');
                if (dropFloor) {
                  dropFloor.vy = 6.5;
                  sounds.playTroll();
                  setTrollAlert('Floor left the chat!');
                }
                break;
              }

              case 'runaway_door': {
                const door = lvl.door;
                if (!door.hasRunAway) {
                  door.hasRunAway = true;
                  sounds.playTroll();
                  setTrollAlert('Catch me if you can!');
                  // Door jumps to the left over player!
                  door.x = 100;
                  door.y = 360;
                }
                break;
              }

              case 'drop_ceiling': {
                const idx = trig.data?.slabIndex ?? 0;
                const slab = lvl.platforms.find((pl) => pl.id === `drop_slab_${idx + 1}`);
                if (slab) {
                  slab.vy = 8.5;
                  sounds.playTroll();
                  setTrollAlert('WATCH OUT ABOVE!');
                }
                break;
              }

              case 'invert_controls': {
                invertedRef.current = true;
                sounds.playTroll();
                setTrollAlert('MIND BEND: Controls Inverted!');
                break;
              }

              case 'flip_gravity': {
                p.gravityInverted = !p.gravityInverted;
                sounds.playTroll();
                setTrollAlert(p.gravityInverted ? 'GRAVITY FLIPPED!' : 'GRAVITY RESTORED!');
                break;
              }

              case 'fake_door': {
                const door = lvl.door;
                door.isCardboardDown = true;
                sounds.playTroll();
                setTrollAlert('NOPE! Real door is at the start!');
                // Spawn real door at start
                realDoorRef.current = {
                  x: 60,
                  y: 360,
                  width: 42,
                  height: 60,
                  active: true,
                };
                break;
              }

              case 'door_attack': {
                const door = lvl.door;
                door.isChasing = true;
                sounds.playTroll();
                setTrollAlert('THE DOOR IS ATTACKING!');
                break;
              }

              case 'secret_switch': {
                sounds.playWin();
                setTrollAlert('Secret passage opened!');
                realDoorRef.current = {
                  x: 380,
                  y: 200,
                  width: 42,
                  height: 60,
                  active: true,
                };
                break;
              }
            }
          }
        });

        // Chasing Door Update (Level 19)
        if (lvl.door.isChasing) {
          lvl.door.x -= 3.8;
          if (lvl.door.x < 40) {
            lvl.door.x = 40;
            lvl.door.isChasing = false;
          }
          // If attacking door hits player directly
          if (
            p.x < lvl.door.x + lvl.door.width &&
            p.x + p.width > lvl.door.x &&
            p.y < lvl.door.y + lvl.door.height &&
            p.y + p.height > lvl.door.y
          ) {
            // If player landed on TOP or behind it, player clears!
            if (p.x > lvl.door.x + lvl.door.width - 10) {
              completeLevel();
            } else {
              killPlayer('Eaten by the door!');
            }
          }
        }

        // --- SPIKE COLLISIONS ---
        const checkSpikeHit = (char: Player) => {
          for (const spk of lvl.spikes) {
            if (spk.hidden && (!spk.popProgress || spk.popProgress <= 0.1)) continue;
            if (spk.id.startsWith('geyser') && (!spk.popProgress || spk.popProgress <= 0.1)) continue;

            // Tight hitbox: 75% size to feel fair
            const hitInset = 4;
            const sx = spk.x + hitInset;
            const sy = spk.y + hitInset;
            const sw = spk.width - hitInset * 2;
            const sh = spk.height - hitInset * 2;

            if (
              char.x < sx + sw &&
              char.x + char.width > sx &&
              char.y < sy + sh &&
              char.y + char.height > sy
            ) {
              return true;
            }
          }
          return false;
        };

        if (checkSpikeHit(p)) {
          killPlayer();
        }

        if (shadow && checkSpikeHit(shadow)) {
          killPlayer('Shadow hit a spike!');
        }

        // --- PIT FALL DEATH ---
        if (p.y > V_HEIGHT + 40 || p.y < -60) {
          killPlayer('Fell into the void!');
        }

        // --- DOOR CLEAR CHECK ---
        const activeDoor = realDoorRef.current?.active ? realDoorRef.current : lvl.door;

        if (!lvl.door.isCardboardDown && !lvl.door.isChasing) {
          if (
            p.x + p.width > activeDoor.x + 8 &&
            p.x < activeDoor.x + activeDoor.width - 8 &&
            p.y + p.height > activeDoor.y + 10 &&
            p.y < activeDoor.y + activeDoor.height
          ) {
            if (lvl.door.isFake && !realDoorRef.current?.active) {
              // Trigger fake door collapse
              lvl.door.isCardboardDown = true;
              sounds.playTroll();
              setTrollAlert('PSYCH! Door fell over!');
              realDoorRef.current = {
                x: 60,
                y: 360,
                width: 42,
                height: 60,
                active: true,
              };
            } else {
              completeLevel();
            }
          }
        }

        // Squash and stretch decay
        p.squashX += (1 - p.squashX) * 0.18;
        p.squashY += (1 - p.squashY) * 0.18;

        // Eye tracking
        p.eyeLookX = p.facing === 'right' ? 3 : -3;
        p.eyeLookY = p.vy > 1 ? 2 : p.vy < -1 ? -2 : 0;

        // Blinking
        p.blinkTimer--;
        if (p.blinkTimer <= 0) {
          p.isBlinking = true;
          if (p.blinkTimer < -6) {
            p.isBlinking = false;
            p.blinkTimer = 100 + Math.random() * 120;
          }
        }
      }

      // Update screen shake
      if (shakeRef.current > 0) {
        shakeRef.current *= 0.86;
        if (shakeRef.current < 0.2) shakeRef.current = 0;
      }

      // Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.25; // gravity
        pt.life++;
        pt.alpha = 1 - pt.life / pt.maxLife;
        if (pt.rotation !== undefined && pt.vRot !== undefined) {
          pt.rotation += pt.vRot;
        }
        if (pt.life >= pt.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // --- RENDERING ---
      ctx.save();
      ctx.clearRect(0, 0, V_WIDTH, V_HEIGHT);

      // Screen Shake
      if (shakeRef.current > 0) {
        const ox = (Math.random() - 0.5) * shakeRef.current * 2;
        const oy = (Math.random() - 0.5) * shakeRef.current * 2;
        ctx.translate(ox, oy);
      }

      // 1. Background
      ctx.fillStyle = '#0f111a';
      ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

      // Subtle grid pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < V_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, V_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < V_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(V_WIDTH, y);
        ctx.stroke();
      }

      // 2. Render Platforms
      lvl.platforms.forEach((plat) => {
        if (plat.isCrumbled) return;
        if (plat.type === 'hidden' && !plat.isRevealed) return;

        // Platform base
        let fill = plat.color || '#1e2235';
        let stroke = plat.borderColor || '#333b5c';

        if (plat.type === 'ice') {
          fill = '#0284c7';
          stroke = '#38bdf8';
        } else if (plat.type === 'sticky') {
          fill = '#b45309';
          stroke = '#f59e0b';
        } else if (plat.type === 'fake') {
          fill = 'rgba(75, 85, 99, 0.4)';
          stroke = 'rgba(156, 163, 175, 0.5)';
        } else if (plat.type === 'crumbling' && plat.crumbleTimer !== undefined) {
          // Vibrating when about to crumble
          const vib = (Math.random() - 0.5) * 4;
          ctx.save();
          ctx.translate(vib, 0);
          fill = '#dc2626';
          stroke = '#f87171';
        }

        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 4);
        ctx.fill();
        ctx.stroke();

        // Subtle top highlight line for 3D depth
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.moveTo(plat.x + 2, plat.y + 2);
        ctx.lineTo(plat.x + plat.width - 2, plat.y + 2);
        ctx.stroke();

        if (plat.type === 'crumbling' && plat.crumbleTimer !== undefined) {
          ctx.restore();
        }

        // Bounce pad indicator
        if (plat.id.startsWith('bounce')) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('▲ BOUNCE ▲', plat.x + plat.width / 2, plat.y + 16);
        }
      });

      // 3. Render Spikes
      lvl.spikes.forEach((spk) => {
        if (spk.hidden && (!spk.popProgress || spk.popProgress <= 0.05)) return;

        // Geyser warning before erupting
        if (lvl.id === 13 && spk.id.startsWith('geyser')) {
          const cycle = geyserTimerRef.current;
          if (cycle <= 40) {
            // Flash exclamation warning
            ctx.fillStyle = cycle % 10 < 5 ? '#ef4444' : '#ffffff';
            ctx.font = 'bold 20px "Chakra Petch", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('!', spk.x + spk.width / 2, spk.y - 12);
            return;
          }
        }

        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 1.5;

        // Render triangle spikes along the width
        const spikeW = 16;
        const count = Math.max(1, Math.floor(spk.width / spikeW));
        const actualW = spk.width / count;

        for (let i = 0; i < count; i++) {
          const sx = spk.x + i * actualW;
          ctx.beginPath();

          if (spk.orientation === 'up') {
            ctx.moveTo(sx, spk.y + spk.height);
            ctx.lineTo(sx + actualW / 2, spk.y);
            ctx.lineTo(sx + actualW, spk.y + spk.height);
          } else if (spk.orientation === 'down') {
            ctx.moveTo(sx, spk.y);
            ctx.lineTo(sx + actualW / 2, spk.y + spk.height);
            ctx.lineTo(sx + actualW, spk.y);
          } else if (spk.orientation === 'left') {
            ctx.moveTo(spk.x + spk.width, spk.y);
            ctx.lineTo(spk.x, spk.y + spk.height / 2);
            ctx.lineTo(spk.x + spk.width, spk.y + spk.height);
          } else if (spk.orientation === 'right') {
            ctx.moveTo(spk.x, spk.y);
            ctx.lineTo(spk.x + spk.width, spk.y + spk.height / 2);
            ctx.lineTo(spk.x, spk.y + spk.height);
          }

          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      });

      // 4. Render Exit Door
      const drawDoor = (d: { x: number; y: number; width: number; height: number; isCardboardDown?: boolean; isChasing?: boolean; label?: string; color?: string }) => {
        ctx.save();
        if (d.isCardboardDown) {
          // Cardboard fallen flat on floor
          ctx.fillStyle = '#78350f';
          ctx.fillRect(d.x, d.y + d.height - 8, d.width * 1.3, 8);
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 12px "Chakra Petch", monospace';
          ctx.fillText('NOPE!', d.x + 8, d.y + d.height - 12);
          ctx.restore();
          return;
        }

        // Door frame
        const doorColor = d.color || '#10b981';
        ctx.fillStyle = doorColor;
        ctx.shadowColor = doorColor;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.roundRect(d.x, d.y, d.width, d.height, [8, 8, 0, 0]);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Door Inner portal
        ctx.fillStyle = '#064e3b';
        ctx.beginPath();
        ctx.roundRect(d.x + 5, d.y + 6, d.width - 10, d.height - 6, [6, 6, 0, 0]);
        ctx.fill();

        // Pulsing portal swirl
        const pulse = Math.sin(frame * 0.08) * 3;
        ctx.fillStyle = doorColor;
        ctx.beginPath();
        ctx.arc(d.x + d.width / 2, d.y + d.height / 2, 8 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Door Label
        if (d.label) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px "Chakra Petch", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(d.label, d.x + d.width / 2, d.y - 6);
        }

        // Chaser Monster Face on Door (Level 19)
        if (d.isChasing) {
          ctx.fillStyle = '#ef4444';
          // Angry eyes
          ctx.beginPath();
          ctx.arc(d.x + 12, d.y + 20, 5, 0, Math.PI * 2);
          ctx.arc(d.x + 30, d.y + 20, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(d.x + 10, d.y + 20, 2.5, 0, Math.PI * 2);
          ctx.arc(d.x + 28, d.y + 20, 2.5, 0, Math.PI * 2);
          ctx.fill();
          // Sharp teeth
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(d.x + 10, d.y + 35);
          ctx.lineTo(d.x + 15, d.y + 42);
          ctx.lineTo(d.x + 20, d.y + 35);
          ctx.lineTo(d.x + 25, d.y + 42);
          ctx.lineTo(d.x + 30, d.y + 35);
          ctx.fill();
        }

        ctx.restore();
      };

      drawDoor(lvl.door);
      if (realDoorRef.current?.active) {
        drawDoor(realDoorRef.current);
      }

      // 5. Render Shadow Clone (Level 14)
      if (shadow && gameStateRef.current === 'playing') {
        ctx.save();
        ctx.fillStyle = '#7c3aed';
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#7c3aed';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(shadow.x, shadow.y, shadow.width, shadow.height, 6);
        ctx.fill();
        ctx.stroke();
        // Shadow eyes
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(shadow.x + (shadow.facing === 'right' ? 18 : 10), shadow.y + 11, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. Render Player Cube (with squash, stretch, and animated expressive eyes)
      if (gameStateRef.current === 'playing') {
        ctx.save();
        const pCenterX = p.x + p.width / 2;
        const pCenterY = p.y + p.height / 2;

        ctx.translate(pCenterX, pCenterY);
        ctx.scale(p.squashX, p.squashY);

        if (p.gravityInverted) {
          ctx.scale(1, -1);
        }

        // Cube Body
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.roundRect(-p.width / 2, -p.height / 2, p.width, p.height, 6);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Animated Expressive Eyes
        if (!p.isBlinking) {
          const eyeSpacing = 8;
          const eyeOffsetY = -2 + p.eyeLookY;
          const eyeOffsetX = p.eyeLookX;

          // Eye Sclera (White)
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-eyeSpacing / 2 + eyeOffsetX, eyeOffsetY, 4.5, 0, Math.PI * 2);
          ctx.arc(eyeSpacing / 2 + eyeOffsetX, eyeOffsetY, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Pupil (Dark Navy)
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(-eyeSpacing / 2 + eyeOffsetX + (p.facing === 'right' ? 1.5 : -1.5), eyeOffsetY + (p.eyeLookY > 0 ? 1 : 0), 2.2, 0, Math.PI * 2);
          ctx.arc(eyeSpacing / 2 + eyeOffsetX + (p.facing === 'right' ? 1.5 : -1.5), eyeOffsetY + (p.eyeLookY > 0 ? 1 : 0), 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Closed eye slits
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-p.width / 4, 0);
          ctx.lineTo(-2, 0);
          ctx.moveTo(2, 0);
          ctx.lineTo(p.width / 4, 0);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 7. Render Particles
      particlesRef.current.forEach((pt) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.translate(pt.x, pt.y);
        if (pt.rotation) ctx.rotate(pt.rotation);
        ctx.fillRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size);
        ctx.restore();
      });

      // 8. Darkness Filter for Level 11 (Lights Out)
      if (lvl.darknessRadius && gameStateRef.current === 'playing') {
        ctx.save();
        ctx.fillStyle = 'rgba(8, 9, 14, 0.96)';

        // Draw dark overlay with cut-out lantern circle around player
        ctx.beginPath();
        ctx.rect(0, 0, V_WIDTH, V_HEIGHT);
        ctx.arc(p.x + p.width / 2, p.y + p.height / 2, lvl.darknessRadius, 0, Math.PI * 2, true);
        ctx.fill();

        // Soft yellow lantern halo
        const grad = ctx.createRadialGradient(
          p.x + p.width / 2,
          p.y + p.height / 2,
          lvl.darknessRadius * 0.4,
          p.x + p.width / 2,
          p.y + p.height / 2,
          lvl.darknessRadius
        );
        grad.addColorStop(0, 'rgba(253, 224, 71, 0.1)');
        grad.addColorStop(1, 'rgba(8, 9, 14, 0.9)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x + p.width / 2, p.y + p.height / 2, lvl.darknessRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 9. Floating troll alert / message in canvas
      if (trollAlert) {
        ctx.save();
        ctx.font = '700 18px "Chakra Petch", monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#f43f5e';
        ctx.fillText(trollAlert, V_WIDTH / 2, 80);
        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [completeLevel, initialLevel, inputState, isPaused, killPlayer]);

  // Touch handling directly on canvas for multi-touch gestures
  const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    // Canvas touches can act as auxiliary jump or directional input
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={V_WIDTH}
        height={V_HEIGHT}
        onTouchStart={handleCanvasTouch}
        className="w-full h-full max-h-full max-w-full object-contain bg-[#0b0c13] rounded-lg shadow-2xl border border-white/10"
        style={{
          aspectRatio: '800 / 500',
        }}
      />
    </div>
  );
};
