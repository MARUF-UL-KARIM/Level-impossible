export type GameState = 'playing' | 'dead' | 'level_cleared' | 'game_completed';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  squashX: number;
  squashY: number;
  coyoteTimer: number;
  jumpBufferTimer: number;
  eyeLookX: number;
  eyeLookY: number;
  blinkTimer: number;
  isBlinking: boolean;
  gravityInverted?: boolean;
}

export interface Platform extends Rect {
  id: string;
  type?: 'normal' | 'fake' | 'crumbling' | 'ice' | 'sticky' | 'moving' | 'hidden';
  color?: string;
  borderColor?: string;
  crumbleTimer?: number;
  isCrumbled?: boolean;
  isRevealed?: boolean;
  origX?: number;
  origY?: number;
  targetX?: number;
  targetY?: number;
  vx?: number;
  vy?: number;
  moveRange?: number;
  moveSpeed?: number;
  moveProgress?: number;
  moveDirection?: number;
}

export interface Spike extends Rect {
  id: string;
  orientation: 'up' | 'down' | 'left' | 'right';
  hidden?: boolean;
  popProgress?: number; // 0 = hidden, 1 = fully out
  isPopping?: boolean;
  triggerX?: number;
  triggerDistance?: number;
  vx?: number;
  vy?: number;
  chaseSpeed?: number;
  origY?: number;
  targetY?: number;
  origX?: number;
  targetX?: number;
}

export interface Door extends Rect {
  id: string;
  isFake?: boolean;
  isCardboardDown?: boolean;
  isOpen?: boolean;
  vx?: number;
  vy?: number;
  isChasing?: boolean;
  hasRunAway?: boolean;
  hopTimer?: number;
  label?: string;
  color?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation?: number;
  vRot?: number;
}

export interface LevelTrigger {
  id: string;
  type: 
    | 'popup_spike' 
    | 'fall_floor' 
    | 'runaway_door' 
    | 'drop_ceiling' 
    | 'invert_controls' 
    | 'fake_bridge' 
    | 'spikes_slide' 
    | 'flip_gravity' 
    | 'fake_door' 
    | 'lights_out' 
    | 'crush_walls' 
    | 'spike_geyser' 
    | 'spawn_clone' 
    | 'door_attack' 
    | 'secret_switch';
  x: number;
  y: number;
  width: number;
  height: number;
  activated: boolean;
  data?: Record<string, any>;
}

export interface LevelDefinition {
  id: number;
  title: string;
  subtitle: string;
  hint?: string;
  trollName: string;
  playerStart: { x: number; y: number };
  door: Door;
  platforms: Platform[];
  spikes: Spike[];
  triggers?: LevelTrigger[];
  darknessRadius?: number; // for lights out level
  controlsInverted?: boolean;
  icePhysics?: boolean;
  shadowClone?: boolean;
  customUpdate?: (level: LevelDefinition, player: Player, frame: number) => void;
  dialogue?: string[];
}

export interface UserProgress {
  unlockedLevel: number;
  deaths: Record<number, number>;
  totalDeaths: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  levelTimes: Record<number, number>;
}
