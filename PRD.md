# MASTER PRODUCT REQUIREMENT DOCUMENT (PRD)
## PROJECT: Level Deceit
**Version:** 1.0.0  
**Target Hardware:** Android 8.1.0 (Oreo, API Level 27)  
**Target Display:** 720 × 1520 pixels (19:9 Aspect Ratio) & Adaptive Responsive Viewports  
**Engine:** HTML5 Canvas 2D + React 19 + TypeScript + Web Audio API  

---

## 1. Executive Overview & Concept
**Level Deceit** is a deceptive puzzle-platformer inspired by the hit troll-game genre (e.g. *Level Devil*, strictly omitting the word "devil"). The player controls a responsive, expressive geometric cube navigating 20 progressively treacherous levels. 

While each level appears straightforward at first glance (reach the door on the other side), every single level subverts player expectations with unique, comedic, and cunning troll mechanics:
- Spikes that sprout from safe tiles
- Doors that sprout legs, jump away, or collapse as cardboard fakes
- Collapsing and illusory floor tiles
- Inverted controls and sudden gravity inversions
- Ceilings dropping down
- Mirror clones and spike geysers
- Shrinking rooms and charging boss doors

The game balances comedic surprise with fair, skill-based platforming: once a trick is revealed, the player can conquer it through quick reflexes, timing, and problem-solving.

---

## 2. Hardware, OS & Viewport Specifications

| Parameter | Specification | Compliance Rationale |
| :--- | :--- | :--- |
| **Operating System** | Android 8.1.0 (Oreo, API 27) | Strict legacy support. Zero reliance on post-ES2018 non-standard APIs. Canvas 2D rendering with hardware acceleration. |
| **Native Screen Resolution** | 720 × 1520 px (19:9 ratio) | UI scales cleanly inside 720×1520 with dedicated thumb zones. |
| **Adaptive Viewport** | 320px to 4K (Portrait & Landscape) | Dynamic letterboxing with CSS `aspect-ratio` container and auto-scaling virtual canvas (800 × 500 coordinates). |
| **Touch Ergonomics** | Dual-thumb bottom deck | Left: Left/Right directional buttons (large 64×64px hit targets with padding). Right: Prominent Jump button (72×72px). Direct canvas touch also supported. |
| **Input Latency** | $\le 16.6\text{ms}$ (60 FPS budget) | Passive/active `touchstart`/`touchend` listeners with `e.preventDefault()` to stop double-tap zoom delay and gesture conflicts. |
| **Audio Compatibility** | Web Audio API (Synthesized) | No external MP3/OGG asset downloads. Zero loading latency. 100% offline functional. |
| **Haptics** | `navigator.vibrate` | Short tactile pulses on death (40ms), trap triggers (20ms), and door entry (60ms). Safely guarded if unassisted. |

---

## 3. Physics & Gameplay Engine Architecture

### 3.1 Coordinate System & Rendering
- **Virtual Canvas Bounds:** 800 units wide $\times$ 500 units high.
- **Aspect Scaling:** Automatically rendered onto a responsive HTML5 `<canvas>` using high-DPI scaling (`window.devicePixelRatio` capped at 2.0 to conserve GPU memory on 5-year-old Android devices).
- **Update Frequency:** `requestAnimationFrame` loop with fixed timestep delta accumulation (60 FPS baseline).

### 3.2 Platformer Physics Constants
- `GRAVITY`: 0.65 px/frame²
- `MOVE_ACCELERATION`: 1.2 px/frame
- `MAX_RUN_SPEED`: 5.2 px/frame
- `FRICTION`: 0.82 (normal), 0.96 (ice), 0.50 (sticky)
- `JUMP_FORCE`: -11.4 px/frame (variable jump height based on button hold duration)
- `COYOTE_TIME`: 6 frames (0.10s window to jump after leaving a ledge)
- `JUMP_BUFFER`: 5 frames (accepts jump input right before landing)
- `SQUASH_STRETCH`: Dynamic horizontal/vertical scale multipliers for player mesh during takeoff, peak, and landing impact.

### 3.3 Collision Detection
- Axis-Aligned Bounding Box (AABB) with separate horizontal and vertical sweeps to prevent corner-snagging and tunnel-through errors.
- Spikes feature a tight interior hitbox (70% of visual boundary) to ensure fair near-miss clearance.

---

## 4. Complete 20-Level Specifications

| Level # | Title | Visual Theme | Deceit / Troll Mechanic | Solution Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **1** | *First Steps* | Neon Blueprint | Standard walk, but 3 tiles before the door a hidden floor spike suddenly shoots up! | Jump early before the hidden spike triggers. |
| **2** | *Shy Floor* | Rust Foundry | Floor beneath the door collapses into an abyss when the player approaches within 180px. | Leap over the widening abyss to land on the door platform. |
| **3** | *Runaway Door* | Electric Cyan | The door slides away to the right wall, then hops over player's head back to the left! | Chase the door until it hops, then turn around to enter. |
| **4** | *Ceiling Drop* | Stone Crypt | Ceiling blocks slam downward like guillotines when player enters their vertical column. | Bait the ceiling blocks to crash down, then jump over them while they reset. |
| **5** | *Mind Switch* | Glitch Violet | Crossing the center line inverts controls: Left becomes Right, Right becomes Left! | Invert mental inputs once past the glitch threshold. |
| **6** | *Phantom Bridge* | Misty Chasm | 3 bridge blocks span a pit. The middle block is a hologram (no collision), while a hidden safe block floats above! | Jump over the fake middle block or step on the elevated hidden pad. |
| **7** | *Sneaky Spikes* | Crimson Hazard | Spikes appear static, but as soon as the player jumps, they slide horizontally toward the player! | Do a short hop or bait the spike slide then jump over. |
| **8** | *Gravity Flip* | Anti-Grav Vault | Touching the blue gravity orbs or pressing jump inside the zone flips gravity to the ceiling! | Walk along the ceiling over floor spikes, flip down near the door. |
| **9** | *Crumbling Path* | Volcanic Slabs | Every floor tile crumbles into dust 0.35s after contact. | Sprint and jump continuously without stopping. |
| **10** | *Fake Victory* | Golden Mirage | Reaching the door causes it to fall flat like cardboard ("NOPE!"). The real door drops from the ceiling at the start! | Run all the way back to the start to enter the authentic door. |
| **11** | *Lights Out* | Shadow Crypt | Darkness shrouds the arena. Only a circular spotlight illuminates around the player. Hidden spikes lurk in the dark. | Memorize spike placements or move cautiously using the lantern radius. |
| **12** | *Crush Room* | Industrial Press | Left wall starts moving rightward at steady speed; ceiling lowers progressively. | Swiftly navigate obstacles before getting compacted. |
| **13** | *Spike Geysers* | Danger Zone | Exclamation marks (`!`) flash on ground segments 0.4s before geysers of spikes erupt upward. | React to warning indicators and stand only on safe floor tiles. |
| **14** | *Mirror Curse* | Dual Reality | A dark shadow twin moves symmetrically opposite. If either character hits spikes, both die! | Navigate the stage keeping both characters in safe zones. |
| **15** | *Ice & Honey* | Frost & Amber | The first half is friction-less ice; the second half is sticky honey where jumps are muted. | Build momentum on ice, brake carefully, and use full jumps on honey. |
| **16** | *Portal Loop* | Quantum Rift | The obvious door teleports the player back into a spike trap. The true door is revealed only after hitting the secret wall switch. | Bump the marked wall block to reveal the genuine exit portal. |
| **17** | *Ascension* | Sky Tower | Moving vertical lift carries the player up, but spikes protrude from alternating walls. | Weave left and right on the ascending platform. |
| **18** | *Bouncy Spikes* | Trampoline Park | Super bounce pads launch the player high, but the ceiling is spiked! | Tap jump lightly and feather directional keys to glide through narrow ceiling gaps. |
| **19** | *The Chaser* | Monster Chamber | The door sprouts angry eyes and charges toward the player at high speed! | Leap over the charging door and touch it from behind. |
| **20** | *Grand Finale* | Master Chamber | Multi-stage gauntlet: Shifting floors, surprise spikes, a 2-second control inversion, and a victory trophy door! | Combine all learned master techniques to claim the ultimate trophy! |

---

## 5. User Interface & Controls Layout

### 5.1 Mobile Layout (720 × 1520 Portrait Baseline)
- **Top Header Bar (56px):**
  - Level indicator: `LEVEL 01 / 20`
  - Death counter with skull icon (`💀 00`)
  - Quick Restart button (instant respawn)
  - Sound FX mute toggle
  - Level Select grid button
- **Game Stage Viewport (Middle ~60% of screen):**
  - Crisp aspect-locked canvas with rounded border and subtle glow.
  - In-game floating messages (e.g. "Seems easy...", "Wait for it...", "PSYCH!").
  - Instant death splat with bouncy particle physics.
- **Ergonomic Bottom Controller Deck (~35% of screen):**
  - Left Thumb Zone: Left Arrow (`◀`) and Right Arrow (`▶`) buttons (76px diameter, active haptic styling).
  - Right Thumb Zone: Oversized Jump Button (`▲ JUMP`, 84px diameter with spring-loaded feedback).
  - Also accepts direct canvas gestures: Touch left half = Move left, Touch right half = Move right, Swipe or touch upper half = Jump.
- **Desktop / Hardware Keyboard Support:**
  - `A` / `Left Arrow`: Move Left
  - `D` / `Right Arrow`: Move Right
  - `W` / `Up Arrow` / `Space`: Jump
  - `R`: Quick Restart
  - `Esc`: Level Select Menu

---

## 6. Procedural Web Audio Engine (100% Offline)
Implemented via native `AudioContext` without network dependencies:
- **Jump Chirp:** Quick frequency sweep (180 Hz $\to$ 440 Hz, triangle wave, 0.12s decay).
- **Death Splat:** Frequency dive (220 Hz $\to$ 40 Hz) combined with white noise burst for cartoon crunch.
- **Troll Trigger / Surprise:** Pitch-bending slide whistle or comedic cartoon "boing" (300 Hz $\to$ 600 Hz $\to$ 240 Hz).
- **Level Clear:** Ascending major triad arpeggio (C5 $\to$ E5 $\to$ G5 $\to$ C6, 0.4s).
- **Grand Finale Fanfare:** Celebratory musical fanfare with polyphonic chords.

---

## 7. Data Persistence & Progression
Saved in `localStorage` under `level_deceit_save_v1`:
- `unlockedLevel`: Integer (1 to 20, default 1).
- `levelDeaths`: Map of `{ [levelId: number]: number }`.
- `totalDeaths`: Total lifetime deaths across all sessions.
- `soundEnabled`: Boolean (default true).
- `hapticsEnabled`: Boolean (default true).
- `levelTimes`: Map of best completion times in seconds.

---

## 8. Anti-AI Slop & Clean Design Guidelines
- Zero generic purple pill cards or low-contrast text.
- High contrast arcade typography (Chakra Petch & Inter).
- Expressive cube animation: dynamic eyes following movement, squishing on jump, flattening on landing, comedic blinking.
- Polished particle systems with gravity, bounce, and fade-out.
- No third-party ad SDKs or telemetric tracking.
