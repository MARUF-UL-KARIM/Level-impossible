import { LevelDefinition } from '../types/game';

export const LEVELS: LevelDefinition[] = [
  // LEVEL 1: First Steps
  {
    id: 1,
    title: 'First Steps',
    subtitle: 'Looks so peaceful...',
    hint: 'Watch your step near the finish!',
    trollName: 'Pop-up Surprise',
    playerStart: { x: 70, y: 390 },
    door: { id: 'door1', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'floor', x: 20, y: 420, width: 760, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
    ],
    spikes: [
      // Hidden spike that shoots up when player reaches x > 490
      {
        id: 'hidden_spike_1',
        x: 540,
        y: 420,
        width: 32,
        height: 28,
        orientation: 'up',
        hidden: true,
        popProgress: 0,
        origY: 420,
        targetY: 392,
        triggerX: 470,
      },
    ],
    triggers: [
      {
        id: 'trig1',
        type: 'popup_spike',
        x: 470,
        y: 350,
        width: 30,
        height: 80,
        activated: false,
      },
    ],
  },

  // LEVEL 2: Floor is Shy
  {
    id: 2,
    title: 'Floor is Shy',
    subtitle: 'It gets nervous when you get close',
    hint: 'Be ready to leap when the ground gives way!',
    trollName: 'Vanishing Ground',
    playerStart: { x: 70, y: 390 },
    door: { id: 'door2', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'f1', x: 20, y: 420, width: 340, height: 50, type: 'normal' },
      // Drop section
      {
        id: 'drop_floor',
        x: 360,
        y: 420,
        width: 250,
        height: 50,
        type: 'normal',
        origY: 420,
        targetY: 550,
        vy: 0,
      },
      { id: 'f2', x: 610, y: 420, width: 170, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
    ],
    spikes: [
      // Spikes at the bottom of the pit
      { id: 'pit_s1', x: 380, y: 480, width: 210, height: 20, orientation: 'up' },
    ],
    triggers: [
      {
        id: 'trig_fall',
        type: 'fall_floor',
        x: 320,
        y: 300,
        width: 60,
        height: 140,
        activated: false,
      },
    ],
  },

  // LEVEL 3: Runaway Door
  {
    id: 3,
    title: 'Runaway Door',
    subtitle: 'Where do you think you are going?',
    hint: 'Corner it, then watch it jump over you!',
    trollName: 'Fleeing Exit',
    playerStart: { x: 70, y: 390 },
    door: {
      id: 'door3',
      x: 640,
      y: 360,
      width: 42,
      height: 60,
      hasRunAway: false,
    },
    platforms: [
      { id: 'f', x: 20, y: 420, width: 760, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
    ],
    spikes: [
      { id: 'mid_spike', x: 380, y: 394, width: 30, height: 26, orientation: 'up' },
    ],
    triggers: [
      {
        id: 'trig_run',
        type: 'runaway_door',
        x: 520,
        y: 300,
        width: 80,
        height: 120,
        activated: false,
      },
    ],
  },

  // LEVEL 4: Ceiling Drop
  {
    id: 4,
    title: 'Ceiling Drop',
    subtitle: 'Look up before you leap',
    hint: 'Bait the crushing blocks to fall first!',
    trollName: 'Guillotine Slabs',
    playerStart: { x: 70, y: 390 },
    door: { id: 'door4', x: 720, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'f', x: 20, y: 420, width: 760, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },

      // 3 Falling Ceiling Slabs
      {
        id: 'drop_slab_1',
        x: 230,
        y: 60,
        width: 80,
        height: 60,
        type: 'moving',
        origY: 60,
        targetY: 360,
        vy: 0,
      },
      {
        id: 'drop_slab_2',
        x: 390,
        y: 60,
        width: 80,
        height: 60,
        type: 'moving',
        origY: 60,
        targetY: 360,
        vy: 0,
      },
      {
        id: 'drop_slab_3',
        x: 550,
        y: 60,
        width: 80,
        height: 60,
        type: 'moving',
        origY: 60,
        targetY: 360,
        vy: 0,
      },
    ],
    spikes: [
      // Attached spikes to bottom of falling slabs
      { id: 's_slab1', x: 235, y: 120, width: 70, height: 20, orientation: 'down' },
      { id: 's_slab2', x: 395, y: 120, width: 70, height: 20, orientation: 'down' },
      { id: 's_slab3', x: 555, y: 120, width: 70, height: 20, orientation: 'down' },
    ],
    triggers: [
      {
        id: 'trig_drop_1',
        type: 'drop_ceiling',
        x: 200,
        y: 200,
        width: 90,
        height: 220,
        activated: false,
        data: { slabIndex: 0 },
      },
      {
        id: 'trig_drop_2',
        type: 'drop_ceiling',
        x: 360,
        y: 200,
        width: 90,
        height: 220,
        activated: false,
        data: { slabIndex: 1 },
      },
      {
        id: 'trig_drop_3',
        type: 'drop_ceiling',
        x: 520,
        y: 200,
        width: 90,
        height: 220,
        activated: false,
        data: { slabIndex: 2 },
      },
    ],
  },

  // LEVEL 5: Mind Switch
  {
    id: 5,
    title: 'Mind Switch',
    subtitle: 'Left is Right, Right is Left',
    hint: 'Your fingers will lie to you past the midpoint!',
    trollName: 'Inverted Brain',
    playerStart: { x: 70, y: 390 },
    door: { id: 'door5', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'f', x: 20, y: 420, width: 760, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
      // Mid obstacle
      { id: 'step1', x: 480, y: 350, width: 80, height: 70, type: 'normal' },
    ],
    spikes: [
      { id: 's1', x: 340, y: 394, width: 40, height: 26, orientation: 'up' },
      { id: 's2', x: 590, y: 394, width: 40, height: 26, orientation: 'up' },
    ],
    triggers: [
      {
        id: 'trig_invert',
        type: 'invert_controls',
        x: 380,
        y: 100,
        width: 30,
        height: 320,
        activated: false,
      },
    ],
  },

  // LEVEL 6: Phantom Bridge
  {
    id: 6,
    title: 'Phantom Bridge',
    subtitle: 'Not all stones are real',
    hint: 'Trust the leap, but question the middle!',
    trollName: 'Hologram Platform',
    playerStart: { x: 70, y: 390 },
    door: { id: 'door6', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'start_plat', x: 20, y: 420, width: 140, height: 50, type: 'normal' },
      // Bridge islands
      { id: 'p1', x: 220, y: 370, width: 80, height: 24, type: 'normal' },
      // FAKE middle platform - player falls straight through!
      { id: 'p2_fake', x: 360, y: 370, width: 80, height: 24, type: 'fake' },
      // Real hidden platform floating higher up
      {
        id: 'p2_hidden',
        x: 360,
        y: 280,
        width: 80,
        height: 24,
        type: 'hidden',
        isRevealed: false,
      },
      { id: 'p3', x: 500, y: 370, width: 80, height: 24, type: 'normal' },
      { id: 'end_plat', x: 640, y: 420, width: 140, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
    ],
    spikes: [
      // Deep spike pit
      { id: 'pit', x: 160, y: 460, width: 480, height: 24, orientation: 'up' },
    ],
    triggers: [],
  },

  // LEVEL 7: Sneaky Spikes
  {
    id: 7,
    title: 'Sneaky Spikes',
    subtitle: 'They move when you airborne',
    hint: 'Time your jumps or bait them early!',
    trollName: 'Sliding Spikes',
    playerStart: { x: 70, y: 390 },
    door: { id: 'door7', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'f', x: 20, y: 420, width: 760, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
    ],
    spikes: [
      // Spikes that rush toward player when player jumps
      {
        id: 'slide_s1',
        x: 420,
        y: 394,
        width: 32,
        height: 26,
        orientation: 'up',
        vx: 0,
        origX: 420,
      },
      {
        id: 'slide_s2',
        x: 580,
        y: 394,
        width: 32,
        height: 26,
        orientation: 'up',
        vx: 0,
        origX: 580,
      },
    ],
    triggers: [
      {
        id: 'trig_slide',
        type: 'spikes_slide',
        x: 200,
        y: 200,
        width: 400,
        height: 220,
        activated: false,
      },
    ],
  },

  // LEVEL 8: Gravity Inversion
  {
    id: 8,
    title: 'Gravity Inversion',
    subtitle: 'Up is your new down',
    hint: 'Walk on the ceiling to bypass the sea of thorns!',
    trollName: 'Ceiling Walker',
    playerStart: { x: 70, y: 390 },
    door: { id: 'door8', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'f_start', x: 20, y: 420, width: 140, height: 50, type: 'normal' },
      { id: 'ceiling_run', x: 120, y: 60, width: 560, height: 30, type: 'normal' },
      { id: 'f_end', x: 640, y: 420, width: 140, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
    ],
    spikes: [
      // Massive floor spikes in between
      { id: 'floor_spikes', x: 160, y: 394, width: 480, height: 26, orientation: 'up' },
    ],
    triggers: [
      {
        id: 'grav_flip_zone',
        type: 'flip_gravity',
        x: 140,
        y: 250,
        width: 40,
        height: 170,
        activated: false,
      },
      {
        id: 'grav_reset_zone',
        type: 'flip_gravity',
        x: 620,
        y: 80,
        width: 40,
        height: 170,
        activated: false,
      },
    ],
  },

  // LEVEL 9: Crumbling Path
  {
    id: 9,
    title: 'Crumbling Path',
    subtitle: 'Never stop running',
    hint: 'Keep moving! The ground disintegrates in 0.35s.',
    trollName: 'Vanishing Slabs',
    playerStart: { x: 60, y: 390 },
    door: { id: 'door9', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'start', x: 20, y: 420, width: 100, height: 50, type: 'normal' },
      { id: 'c1', x: 150, y: 390, width: 70, height: 20, type: 'crumbling' },
      { id: 'c2', x: 250, y: 360, width: 70, height: 20, type: 'crumbling' },
      { id: 'c3', x: 350, y: 330, width: 70, height: 20, type: 'crumbling' },
      { id: 'c4', x: 450, y: 360, width: 70, height: 20, type: 'crumbling' },
      { id: 'c5', x: 550, y: 390, width: 70, height: 20, type: 'crumbling' },
      { id: 'finish', x: 650, y: 420, width: 130, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
    ],
    spikes: [
      { id: 'abyss', x: 120, y: 460, width: 530, height: 25, orientation: 'up' },
    ],
    triggers: [],
  },

  // LEVEL 10: Fake Victory
  {
    id: 10,
    title: 'Fake Victory',
    subtitle: 'Was it really that easy?',
    hint: 'When a door says "NOPE", run back to the beginning!',
    trollName: 'Cardboard Exit',
    playerStart: { x: 70, y: 390 },
    door: {
      id: 'fake_door10',
      x: 710,
      y: 360,
      width: 42,
      height: 60,
      isFake: true,
      label: 'EXIT?',
    },
    platforms: [
      { id: 'f', x: 20, y: 420, width: 760, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
      // Mid platform with spikes
      { id: 'mid', x: 340, y: 340, width: 120, height: 24, type: 'normal' },
    ],
    spikes: [
      { id: 's_mid', x: 380, y: 314, width: 34, height: 26, orientation: 'up' },
    ],
    triggers: [
      {
        id: 'trig_fake',
        type: 'fake_door',
        x: 690,
        y: 350,
        width: 50,
        height: 70,
        activated: false,
      },
    ],
  },

  // LEVEL 11: Lights Out
  {
    id: 11,
    title: 'Lights Out',
    subtitle: 'Stepping into the unknown',
    hint: 'The small light halo follows you. Beware unseen spikes!',
    trollName: 'Lantern in the Dark',
    playerStart: { x: 70, y: 390 },
    darknessRadius: 95,
    door: { id: 'door11', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'f1', x: 20, y: 420, width: 160, height: 50, type: 'normal' },
      { id: 'f2', x: 240, y: 380, width: 100, height: 40, type: 'normal' },
      { id: 'f3', x: 400, y: 340, width: 100, height: 40, type: 'normal' },
      { id: 'f4', x: 560, y: 380, width: 100, height: 40, type: 'normal' },
      { id: 'f5', x: 680, y: 420, width: 100, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
    ],
    spikes: [
      { id: 's1', x: 180, y: 460, width: 60, height: 24, orientation: 'up' },
      { id: 's2', x: 340, y: 460, width: 60, height: 24, orientation: 'up' },
      { id: 's3', x: 500, y: 460, width: 60, height: 24, orientation: 'up' },
      // Sneaky spike on mid platform!
      { id: 's_trap', x: 435, y: 314, width: 28, height: 26, orientation: 'up' },
    ],
    triggers: [],
  },

  // LEVEL 12: Crush Room
  {
    id: 12,
    title: 'Crush Room',
    subtitle: 'The walls are closing in',
    hint: 'Sprint! The left wall moves rightward relentlessly.',
    trollName: 'Compactor',
    playerStart: { x: 70, y: 390 },
    door: { id: 'door12', x: 720, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'f', x: 20, y: 420, width: 760, height: 50, type: 'normal' },
      // Moving left crusher wall
      {
        id: 'crush_wall',
        x: 10,
        y: 50,
        width: 30,
        height: 370,
        type: 'moving',
        vx: 1.25,
        origX: 10,
        targetX: 620,
      },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
      // Hurdles to jump over while escaping
      { id: 'h1', x: 260, y: 360, width: 40, height: 60, type: 'normal' },
      { id: 'h2', x: 460, y: 340, width: 40, height: 80, type: 'normal' },
    ],
    spikes: [
      { id: 's_h1', x: 300, y: 394, width: 30, height: 26, orientation: 'up' },
      { id: 's_h2', x: 500, y: 394, width: 30, height: 26, orientation: 'up' },
    ],
    triggers: [],
  },

  // LEVEL 13: Spike Geysers
  {
    id: 13,
    title: 'Spike Geysers',
    subtitle: 'Watch the warning signs',
    hint: 'When you see "!", jump or step aside before eruption!',
    trollName: 'Erupting Traps',
    playerStart: { x: 70, y: 390 },
    door: { id: 'door13', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'f', x: 20, y: 420, width: 760, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
      { id: 'safe_haven', x: 370, y: 310, width: 60, height: 20, type: 'normal' },
    ],
    spikes: [
      {
        id: 'geyser1',
        x: 210,
        y: 420,
        width: 90,
        height: 60,
        orientation: 'up',
        origY: 420,
        targetY: 360,
        popProgress: 0,
      },
      {
        id: 'geyser2',
        x: 480,
        y: 420,
        width: 100,
        height: 60,
        orientation: 'up',
        origY: 420,
        targetY: 360,
        popProgress: 0,
      },
    ],
    triggers: [
      {
        id: 'trig_geyser',
        type: 'spike_geyser',
        x: 100,
        y: 100,
        width: 600,
        height: 320,
        activated: false,
      },
    ],
  },

  // LEVEL 14: Mirror Curse
  {
    id: 14,
    title: 'Mirror Curse',
    subtitle: 'Your reflection is deadly',
    hint: 'You and your shadow move together. Keep both alive!',
    trollName: 'Shadow Clone',
    playerStart: { x: 70, y: 390 },
    shadowClone: true,
    door: { id: 'door14', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'f', x: 20, y: 420, width: 760, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
      { id: 'plat_left', x: 220, y: 340, width: 70, height: 20, type: 'normal' },
      { id: 'plat_right', x: 510, y: 340, width: 70, height: 20, type: 'normal' },
    ],
    spikes: [
      // Symmetrical hazards
      { id: 's_left', x: 240, y: 394, width: 30, height: 26, orientation: 'up' },
      { id: 's_right', x: 530, y: 394, width: 30, height: 26, orientation: 'up' },
    ],
    triggers: [],
  },

  // LEVEL 15: Ice & Honey
  {
    id: 15,
    title: 'Ice & Honey',
    subtitle: 'Slippery slide into sticky jam',
    hint: 'Counter-steer on the ice, then jump hard on the honey!',
    trollName: 'Friction Shift',
    playerStart: { x: 70, y: 390 },
    door: { id: 'door15', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      // Ice sector: low friction
      { id: 'f_ice', x: 20, y: 420, width: 360, height: 50, type: 'ice' },
      // Sticky honey sector: high friction & heavy jump
      { id: 'f_honey', x: 380, y: 420, width: 400, height: 50, type: 'sticky' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
      { id: 'honey_step', x: 540, y: 340, width: 60, height: 24, type: 'sticky' },
    ],
    spikes: [
      // Spikes right at the edge of the ice!
      { id: 'ice_trap', x: 340, y: 394, width: 36, height: 26, orientation: 'up' },
      { id: 'honey_trap', x: 620, y: 394, width: 36, height: 26, orientation: 'up' },
    ],
    triggers: [],
  },

  // LEVEL 16: Portal Loop
  {
    id: 16,
    title: 'Portal Loop',
    subtitle: 'The door is a lie... again',
    hint: 'The fake door teleports you to death. Hit the marked block!',
    trollName: 'Quantum Deceit',
    playerStart: { x: 70, y: 390 },
    door: {
      id: 'fake_portal_door',
      x: 710,
      y: 360,
      width: 42,
      height: 60,
      isFake: true,
      label: 'PORTAL',
    },
    platforms: [
      { id: 'f', x: 20, y: 420, width: 760, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
      // Mystery switch block in the middle
      {
        id: 'switch_block',
        x: 380,
        y: 280,
        width: 40,
        height: 40,
        type: 'normal',
        color: '#f59e0b',
      },
    ],
    spikes: [
      // Spikes right before fake door
      { id: 's_trap16', x: 650, y: 394, width: 40, height: 26, orientation: 'up' },
    ],
    triggers: [
      {
        id: 'trig_switch',
        type: 'secret_switch',
        x: 375,
        y: 275,
        width: 50,
        height: 50,
        activated: false,
      },
    ],
  },

  // LEVEL 17: Ascension
  {
    id: 17,
    title: 'Ascension',
    subtitle: 'Going up? Watch your sides',
    hint: 'Ride the lift up, but sidestep the wall spikes!',
    trollName: 'Spiked Elevator',
    playerStart: { x: 380, y: 380 },
    door: { id: 'door17', x: 380, y: 90, width: 42, height: 60 },
    platforms: [
      { id: 'f', x: 20, y: 440, width: 760, height: 30, type: 'normal' },
      // Moving vertical elevator
      {
        id: 'elevator',
        x: 350,
        y: 410,
        width: 100,
        height: 24,
        type: 'moving',
        origY: 410,
        targetY: 150,
        vy: -1.2,
      },
      // Door platform at top
      { id: 'top_plat', x: 340, y: 150, width: 120, height: 24, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
      // Obstacle jutting out left
      { id: 'jut_left', x: 30, y: 290, width: 330, height: 24, type: 'normal' },
      // Obstacle jutting out right
      { id: 'jut_right', x: 440, y: 220, width: 330, height: 24, type: 'normal' },
    ],
    spikes: [
      { id: 's_jut1', x: 330, y: 314, width: 30, height: 20, orientation: 'right' },
      { id: 's_jut2', x: 440, y: 200, width: 30, height: 20, orientation: 'left' },
    ],
    triggers: [],
  },

  // LEVEL 18: Bouncy Spikes
  {
    id: 18,
    title: 'Bouncy Spikes',
    subtitle: 'Too high is too painful',
    hint: 'Bouncers launch you to the ceiling. Tap steer between spikes!',
    trollName: 'Trampoline Terror',
    playerStart: { x: 70, y: 390 },
    door: { id: 'door18', x: 710, y: 360, width: 42, height: 60 },
    platforms: [
      { id: 'f1', x: 20, y: 420, width: 140, height: 50, type: 'normal' },
      // Bounce pad 1
      {
        id: 'bounce1',
        x: 230,
        y: 420,
        width: 70,
        height: 24,
        type: 'moving',
        color: '#10b981',
      },
      // Bounce pad 2
      {
        id: 'bounce2',
        x: 450,
        y: 420,
        width: 70,
        height: 24,
        type: 'moving',
        color: '#10b981',
      },
      { id: 'f_end', x: 640, y: 420, width: 140, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
    ],
    spikes: [
      // Floor spikes under air gaps
      { id: 's_gap1', x: 160, y: 460, width: 70, height: 24, orientation: 'up' },
      { id: 's_gap2', x: 300, y: 460, width: 150, height: 24, orientation: 'up' },
      { id: 's_gap3', x: 520, y: 460, width: 120, height: 24, orientation: 'up' },
      // Ceiling spikes directly above bouncers!
      { id: 's_ceil1', x: 240, y: 60, width: 50, height: 24, orientation: 'down' },
      { id: 's_ceil2', x: 460, y: 60, width: 50, height: 24, orientation: 'down' },
    ],
    triggers: [],
  },

  // LEVEL 19: The Chaser
  {
    id: 19,
    title: 'The Chaser',
    subtitle: 'The door is hungry',
    hint: 'Get close to wake it up, then leap over it when it charges!',
    trollName: 'Predator Exit',
    playerStart: { x: 70, y: 390 },
    door: {
      id: 'door19',
      x: 680,
      y: 360,
      width: 44,
      height: 60,
      isChasing: false,
    },
    platforms: [
      { id: 'f', x: 20, y: 420, width: 760, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
      { id: 'step_high', x: 380, y: 260, width: 50, height: 20, type: 'normal' },
    ],
    spikes: [
      { id: 'pit_s19', x: 385, y: 394, width: 40, height: 26, orientation: 'up' },
    ],
    triggers: [
      {
        id: 'trig_chase',
        type: 'door_attack',
        x: 520,
        y: 280,
        width: 100,
        height: 140,
        activated: false,
      },
    ],
  },

  // LEVEL 20: Grand Finale
  {
    id: 20,
    title: 'Grand Finale',
    subtitle: 'The Master of Deceit',
    hint: 'Every trick at once! Floor shift, sudden spike, mind invert!',
    trollName: 'Ultimate Gauntlet',
    playerStart: { x: 60, y: 390 },
    door: {
      id: 'door20',
      x: 720,
      y: 360,
      width: 46,
      height: 60,
      label: 'TROPHY',
      color: '#f59e0b',
    },
    platforms: [
      { id: 'f1', x: 20, y: 420, width: 180, height: 50, type: 'normal' },
      // Collapsing bridge segment
      { id: 'c20_1', x: 200, y: 420, width: 80, height: 50, type: 'crumbling' },
      // Sliding obstacle
      {
        id: 'slide_block_20',
        x: 320,
        y: 360,
        width: 60,
        height: 60,
        type: 'moving',
        origX: 320,
        targetX: 420,
        vx: 1.5,
      },
      { id: 'f2', x: 420, y: 420, width: 360, height: 50, type: 'normal' },
      { id: 'wallL', x: 10, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'wallR', x: 770, y: 50, width: 20, height: 420, type: 'normal' },
      { id: 'roof', x: 10, y: 40, width: 780, height: 20, type: 'normal' },
    ],
    spikes: [
      {
        id: 'pop_s20',
        x: 560,
        y: 420,
        width: 32,
        height: 28,
        orientation: 'up',
        hidden: true,
        popProgress: 0,
        origY: 420,
        targetY: 392,
        triggerX: 500,
      },
      { id: 'pit_s20', x: 280, y: 460, width: 40, height: 24, orientation: 'up' },
    ],
    triggers: [
      {
        id: 'trig_pop20',
        type: 'popup_spike',
        x: 490,
        y: 350,
        width: 40,
        height: 80,
        activated: false,
      },
      {
        id: 'trig_invert20',
        type: 'invert_controls',
        x: 610,
        y: 100,
        width: 30,
        height: 320,
        activated: false,
      },
    ],
  },
];
