package com.leveldeceit.game.repository

import com.leveldeceit.game.model.*

object LevelRepository {
    val LEVELS: List<LevelDefinition> = listOf(
        // LEVEL 1: First Steps
        LevelDefinition(
            id = 1,
            title = "First Steps",
            subtitle = "Looks so peaceful...",
            hint = "Watch your step near the finish!",
            trollName = "Pop-up Surprise",
            playerStart = Point(70f, 390f),
            door = Door(id = "door1", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "floor", px = 20f, py = 420f, pWidth = 760f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(
                    id = "hidden_spike_1",
                    sx = 540f,
                    sy = 420f,
                    sWidth = 32f,
                    sHeight = 28f,
                    orientation = "up",
                    hidden = true,
                    popProgress = 0f,
                    origY = 420f,
                    targetY = 392f,
                    triggerX = 470f
                )
            ),
            triggers = listOf(
                LevelTrigger(id = "trig1", type = "popup_spike", tx = 470f, ty = 350f, tWidth = 30f, tHeight = 80f)
            )
        ),

        // LEVEL 2: Floor is Shy
        LevelDefinition(
            id = 2,
            title = "Floor is Shy",
            subtitle = "It gets nervous when you get close",
            hint = "Be ready to leap when the ground gives way!",
            trollName = "Vanishing Ground",
            playerStart = Point(70f, 390f),
            door = Door(id = "door2", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f1", px = 20f, py = 420f, pWidth = 340f, pHeight = 50f, type = "normal"),
                Platform(id = "drop_floor", px = 360f, py = 420f, pWidth = 250f, pHeight = 50f, type = "normal", origY = 420f, targetY = 550f, vy = 0f),
                Platform(id = "f2", px = 610f, py = 420f, pWidth = 170f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "pit_s1", sx = 380f, sy = 480f, sWidth = 210f, sHeight = 20f, orientation = "up")
            ),
            triggers = listOf(
                LevelTrigger(id = "trig_fall", type = "fall_floor", tx = 320f, ty = 300f, tWidth = 60f, tHeight = 140f)
            )
        ),

        // LEVEL 3: Runaway Door
        LevelDefinition(
            id = 3,
            title = "Runaway Door",
            subtitle = "Where do you think you are going?",
            hint = "Corner it, then watch it jump over you!",
            trollName = "Fleeing Exit",
            playerStart = Point(70f, 390f),
            door = Door(id = "door3", dx = 640f, dy = 360f, dWidth = 42f, dHeight = 60f, hasRunAway = false),
            platforms = listOf(
                Platform(id = "f", px = 20f, py = 420f, pWidth = 760f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "mid_spike", sx = 380f, sy = 394f, sWidth = 30f, sHeight = 26f, orientation = "up")
            ),
            triggers = listOf(
                LevelTrigger(id = "trig_run", type = "runaway_door", tx = 520f, ty = 300f, tWidth = 80f, tHeight = 120f)
            )
        ),

        // LEVEL 4: Ceiling Drop
        LevelDefinition(
            id = 4,
            title = "Ceiling Drop",
            subtitle = "Look up before you leap",
            hint = "Bait the crushing blocks to fall first!",
            trollName = "Guillotine Slabs",
            playerStart = Point(70f, 390f),
            door = Door(id = "door4", dx = 720f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f", px = 20f, py = 420f, pWidth = 760f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal"),

                Platform(id = "drop_slab_1", px = 230f, py = 60f, pWidth = 80f, pHeight = 60f, type = "moving", origY = 60f, targetY = 360f, vy = 0f),
                Platform(id = "drop_slab_2", px = 390f, py = 60f, pWidth = 80f, pHeight = 60f, type = "moving", origY = 60f, targetY = 360f, vy = 0f),
                Platform(id = "drop_slab_3", px = 550f, py = 60f, pWidth = 80f, pHeight = 60f, type = "moving", origY = 60f, targetY = 360f, vy = 0f)
            ),
            spikes = listOf(
                Spike(id = "s_slab1", sx = 235f, sy = 120f, sWidth = 70f, sHeight = 20f, orientation = "down"),
                Spike(id = "s_slab2", sx = 395f, sy = 120f, sWidth = 70f, sHeight = 20f, orientation = "down"),
                Spike(id = "s_slab3", sx = 555f, sy = 120f, sWidth = 70f, sHeight = 20f, orientation = "down")
            ),
            triggers = listOf(
                LevelTrigger(id = "trig_drop_1", type = "drop_ceiling", tx = 200f, ty = 200f, tWidth = 90f, tHeight = 220f, slabIndex = 0),
                LevelTrigger(id = "trig_drop_2", type = "drop_ceiling", tx = 360f, ty = 200f, tWidth = 90f, tHeight = 220f, slabIndex = 1),
                LevelTrigger(id = "trig_drop_3", type = "drop_ceiling", tx = 520f, ty = 200f, tWidth = 90f, tHeight = 220f, slabIndex = 2)
            )
        ),

        // LEVEL 5: Mind Switch
        LevelDefinition(
            id = 5,
            title = "Mind Switch",
            subtitle = "Left is Right, Right is Left",
            hint = "Your fingers will lie to you past the midpoint!",
            trollName = "Inverted Brain",
            playerStart = Point(70f, 390f),
            door = Door(id = "door5", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f", px = 20f, py = 420f, pWidth = 760f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal"),
                Platform(id = "step1", px = 480f, py = 350f, pWidth = 80f, pHeight = 70f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "s1", sx = 340f, sy = 394f, sWidth = 40f, sHeight = 26f, orientation = "up"),
                Spike(id = "s2", sx = 590f, sy = 394f, sWidth = 40f, sHeight = 26f, orientation = "up")
            ),
            triggers = listOf(
                LevelTrigger(id = "trig_invert", type = "invert_controls", tx = 380f, ty = 100f, tWidth = 30f, tHeight = 320f)
            )
        ),

        // LEVEL 6: Phantom Bridge
        LevelDefinition(
            id = 6,
            title = "Phantom Bridge",
            subtitle = "Not all stones are real",
            hint = "Trust the leap, but question the middle!",
            trollName = "Hologram Platform",
            playerStart = Point(70f, 390f),
            door = Door(id = "door6", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "start_plat", px = 20f, py = 420f, pWidth = 140f, pHeight = 50f, type = "normal"),
                Platform(id = "p1", px = 220f, py = 370f, pWidth = 80f, pHeight = 24f, type = "normal"),
                Platform(id = "p2_fake", px = 360f, py = 370f, pWidth = 80f, pHeight = 24f, type = "fake"),
                Platform(id = "p2_hidden", px = 360f, py = 280f, pWidth = 80f, pHeight = 24f, type = "hidden", isRevealed = false),
                Platform(id = "p3", px = 500f, py = 370f, pWidth = 80f, pHeight = 24f, type = "normal"),
                Platform(id = "end_plat", px = 640f, py = 420f, pWidth = 140f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "pit", sx = 160f, sy = 460f, sWidth = 480f, sHeight = 24f, orientation = "up")
            )
        ),

        // LEVEL 7: Sneaky Spikes
        LevelDefinition(
            id = 7,
            title = "Sneaky Spikes",
            subtitle = "They move when you airborne",
            hint = "Time your jumps or bait them early!",
            trollName = "Sliding Spikes",
            playerStart = Point(70f, 390f),
            door = Door(id = "door7", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f", px = 20f, py = 420f, pWidth = 760f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "slide_s1", sx = 420f, sy = 394f, sWidth = 32f, sHeight = 26f, orientation = "up", vx = 0f, origX = 420f),
                Spike(id = "slide_s2", sx = 580f, sy = 394f, sWidth = 32f, sHeight = 26f, orientation = "up", vx = 0f, origX = 580f)
            ),
            triggers = listOf(
                LevelTrigger(id = "trig_slide", type = "spikes_slide", tx = 200f, ty = 200f, tWidth = 400f, tHeight = 220f)
            )
        ),

        // LEVEL 8: Gravity Inversion
        LevelDefinition(
            id = 8,
            title = "Gravity Inversion",
            subtitle = "Up is your new down",
            hint = "Walk on the ceiling to bypass the sea of thorns!",
            trollName = "Ceiling Walker",
            playerStart = Point(70f, 390f),
            door = Door(id = "door8", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f_start", px = 20f, py = 420f, pWidth = 140f, pHeight = 50f, type = "normal"),
                Platform(id = "ceiling_run", px = 120f, py = 60f, pWidth = 560f, pHeight = 30f, type = "normal"),
                Platform(id = "f_end", px = 640f, py = 420f, pWidth = 140f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "floor_spikes", sx = 160f, sy = 394f, sWidth = 480f, sHeight = 26f, orientation = "up")
            ),
            triggers = listOf(
                LevelTrigger(id = "grav_flip_zone", type = "flip_gravity", tx = 140f, ty = 250f, tWidth = 40f, tHeight = 170f),
                LevelTrigger(id = "grav_reset_zone", type = "flip_gravity", tx = 620f, ty = 80f, tWidth = 40f, tHeight = 170f)
            )
        ),

        // LEVEL 9: Crumbling Path
        LevelDefinition(
            id = 9,
            title = "Crumbling Path",
            subtitle = "Never stop running",
            hint = "Keep moving! The ground disintegrates in 0.35s.",
            trollName = "Vanishing Slabs",
            playerStart = Point(60f, 390f),
            door = Door(id = "door9", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "start", px = 20f, py = 420f, pWidth = 100f, pHeight = 50f, type = "normal"),
                Platform(id = "c1", px = 150f, py = 390f, pWidth = 70f, pHeight = 20f, type = "crumbling"),
                Platform(id = "c2", px = 250f, py = 360f, pWidth = 70f, pHeight = 20f, type = "crumbling"),
                Platform(id = "c3", px = 350f, py = 330f, pWidth = 70f, pHeight = 20f, type = "crumbling"),
                Platform(id = "c4", px = 450f, py = 360f, pWidth = 70f, pHeight = 20f, type = "crumbling"),
                Platform(id = "c5", px = 550f, py = 390f, pWidth = 70f, pHeight = 20f, type = "crumbling"),
                Platform(id = "finish", px = 650f, py = 420f, pWidth = 130f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "abyss", sx = 120f, sy = 460f, sWidth = 530f, sHeight = 25f, orientation = "up")
            )
        ),

        // LEVEL 10: Fake Victory
        LevelDefinition(
            id = 10,
            title = "Fake Victory",
            subtitle = "Was it really that easy?",
            hint = "When a door says \"NOPE\", run back to the beginning!",
            trollName = "Cardboard Exit",
            playerStart = Point(70f, 390f),
            door = Door(id = "fake_door10", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f, isFake = true, label = "EXIT?"),
            platforms = listOf(
                Platform(id = "f", px = 20f, py = 420f, pWidth = 760f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal"),
                Platform(id = "mid", px = 340f, py = 340f, pWidth = 120f, pHeight = 24f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "s_mid", sx = 380f, sy = 314f, sWidth = 34f, sHeight = 26f, orientation = "up")
            ),
            triggers = listOf(
                LevelTrigger(id = "trig_fake", type = "fake_door", tx = 690f, ty = 350f, tWidth = 50f, tHeight = 70f)
            )
        ),

        // LEVEL 11: Lights Out
        LevelDefinition(
            id = 11,
            title = "Lights Out",
            subtitle = "Stepping into the unknown",
            hint = "The small light halo follows you. Beware unseen spikes!",
            trollName = "Lantern in the Dark",
            playerStart = Point(70f, 390f),
            darknessRadius = 95f,
            door = Door(id = "door11", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f1", px = 20f, py = 420f, pWidth = 160f, pHeight = 50f, type = "normal"),
                Platform(id = "f2", px = 240f, py = 380f, pWidth = 100f, pHeight = 40f, type = "normal"),
                Platform(id = "f3", px = 400f, py = 340f, pWidth = 100f, pHeight = 40f, type = "normal"),
                Platform(id = "f4", px = 560f, py = 380f, pWidth = 100f, pHeight = 40f, type = "normal"),
                Platform(id = "f5", px = 680f, py = 420f, pWidth = 100f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "s1", sx = 180f, sy = 460f, sWidth = 60f, sHeight = 24f, orientation = "up"),
                Spike(id = "s2", sx = 340f, sy = 460f, sWidth = 60f, sHeight = 24f, orientation = "up"),
                Spike(id = "s3", sx = 500f, sy = 460f, sWidth = 60f, sHeight = 24f, orientation = "up"),
                Spike(id = "s_trap", sx = 435f, sy = 314f, sWidth = 28f, sHeight = 26f, orientation = "up")
            )
        ),

        // LEVEL 12: Crush Room
        LevelDefinition(
            id = 12,
            title = "Crush Room",
            subtitle = "The walls are closing in",
            hint = "Sprint! The left wall moves rightward relentlessly.",
            trollName = "Compactor",
            playerStart = Point(70f, 390f),
            door = Door(id = "door12", dx = 720f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f", px = 20f, py = 420f, pWidth = 760f, pHeight = 50f, type = "normal"),
                Platform(id = "crush_wall", px = 10f, py = 50f, pWidth = 30f, pHeight = 370f, type = "moving", vx = 1.25f, origX = 10f, targetX = 620f),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal"),
                Platform(id = "h1", px = 260f, py = 360f, pWidth = 40f, pHeight = 60f, type = "normal"),
                Platform(id = "h2", px = 460f, py = 340f, pWidth = 40f, pHeight = 80f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "s_h1", sx = 300f, sy = 394f, sWidth = 30f, sHeight = 26f, orientation = "up"),
                Spike(id = "s_h2", sx = 500f, sy = 394f, sWidth = 30f, sHeight = 26f, orientation = "up")
            )
        ),

        // LEVEL 13: Spike Geysers
        LevelDefinition(
            id = 13,
            title = "Spike Geysers",
            subtitle = "Watch the warning signs",
            hint = "When you see \"!\", jump or step aside before eruption!",
            trollName = "Erupting Traps",
            playerStart = Point(70f, 390f),
            door = Door(id = "door13", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f", px = 20f, py = 420f, pWidth = 760f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal"),
                Platform(id = "safe_haven", px = 370f, py = 310f, pWidth = 60f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "geyser1", sx = 210f, sy = 420f, sWidth = 90f, sHeight = 60f, orientation = "up", origY = 420f, targetY = 360f, popProgress = 0f),
                Spike(id = "geyser2", sx = 480f, sy = 420f, sWidth = 100f, sHeight = 60f, orientation = "up", origY = 420f, targetY = 360f, popProgress = 0f)
            ),
            triggers = listOf(
                LevelTrigger(id = "trig_geyser", type = "spike_geyser", tx = 100f, ty = 100f, tWidth = 600f, tHeight = 320f)
            )
        ),

        // LEVEL 14: Mirror Curse
        LevelDefinition(
            id = 14,
            title = "Mirror Curse",
            subtitle = "Your reflection is deadly",
            hint = "You and your shadow move together. Keep both alive!",
            trollName = "Shadow Clone",
            playerStart = Point(70f, 390f),
            shadowClone = true,
            door = Door(id = "door14", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f", px = 20f, py = 420f, pWidth = 760f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal"),
                Platform(id = "plat_left", px = 220f, py = 340f, pWidth = 70f, pHeight = 20f, type = "normal"),
                Platform(id = "plat_right", px = 510f, py = 340f, pWidth = 70f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "s_left", sx = 240f, sy = 394f, sWidth = 30f, sHeight = 26f, orientation = "up"),
                Spike(id = "s_right", sx = 530f, sy = 394f, sWidth = 30f, sHeight = 26f, orientation = "up")
            )
        ),

        // LEVEL 15: Ice & Honey
        LevelDefinition(
            id = 15,
            title = "Ice & Honey",
            subtitle = "Slippery slide into sticky jam",
            hint = "Counter-steer on the ice, then jump hard on the honey!",
            trollName = "Friction Shift",
            playerStart = Point(70f, 390f),
            icePhysics = true,
            door = Door(id = "door15", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f_ice", px = 20f, py = 420f, pWidth = 360f, pHeight = 50f, type = "ice"),
                Platform(id = "f_honey", px = 380f, py = 420f, pWidth = 400f, pHeight = 50f, type = "sticky"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal"),
                Platform(id = "honey_step", px = 540f, py = 340f, pWidth = 60f, pHeight = 24f, type = "sticky")
            ),
            spikes = listOf(
                Spike(id = "ice_trap", sx = 340f, sy = 394f, sWidth = 36f, sHeight = 26f, orientation = "up"),
                Spike(id = "honey_trap", sx = 620f, sy = 394f, sWidth = 36f, sHeight = 26f, orientation = "up")
            )
        ),

        // LEVEL 16: Portal Loop
        LevelDefinition(
            id = 16,
            title = "Portal Loop",
            subtitle = "The door is a lie... again",
            hint = "The fake door teleports you to death. Hit the marked block!",
            trollName = "Quantum Deceit",
            playerStart = Point(70f, 390f),
            door = Door(id = "fake_portal_door", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f, isFake = true, label = "PORTAL"),
            platforms = listOf(
                Platform(id = "f", px = 20f, py = 420f, pWidth = 760f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal"),
                Platform(id = "switch_block", px = 380f, py = 280f, pWidth = 40f, pHeight = 40f, type = "normal", color = "#f59e0b")
            ),
            spikes = listOf(
                Spike(id = "s_trap16", sx = 650f, sy = 394f, sWidth = 40f, sHeight = 26f, orientation = "up")
            ),
            triggers = listOf(
                LevelTrigger(id = "trig_switch", type = "secret_switch", tx = 375f, ty = 275f, tWidth = 50f, tHeight = 50f)
            )
        ),

        // LEVEL 17: Ascension
        LevelDefinition(
            id = 17,
            title = "Ascension",
            subtitle = "Going up? Watch your sides",
            hint = "Ride the lift up, but sidestep the wall spikes!",
            trollName = "Spiked Elevator",
            playerStart = Point(380f, 380f),
            door = Door(id = "door17", dx = 380f, dy = 90f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f", px = 20f, py = 440f, pWidth = 760f, pHeight = 30f, type = "normal"),
                Platform(id = "elevator", px = 350f, py = 410f, pWidth = 100f, pHeight = 24f, type = "moving", origY = 410f, targetY = 150f, vy = -1.2f),
                Platform(id = "top_plat", px = 340f, py = 150f, pWidth = 120f, pHeight = 24f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal"),
                Platform(id = "jut_left", px = 30f, py = 290f, pWidth = 330f, pHeight = 24f, type = "normal"),
                Platform(id = "jut_right", px = 440f, py = 220f, pWidth = 330f, pHeight = 24f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "s_jut1", sx = 330f, sy = 314f, sWidth = 30f, sHeight = 20f, orientation = "right"),
                Spike(id = "s_jut2", sx = 440f, sy = 200f, sWidth = 30f, sHeight = 20f, orientation = "left")
            )
        ),

        // LEVEL 18: Bouncy Spikes
        LevelDefinition(
            id = 18,
            title = "Bouncy Spikes",
            subtitle = "Too high is too painful",
            hint = "Bouncers launch you to the ceiling. Tap steer between spikes!",
            trollName = "Trampoline Terror",
            playerStart = Point(70f, 390f),
            door = Door(id = "door18", dx = 710f, dy = 360f, dWidth = 42f, dHeight = 60f),
            platforms = listOf(
                Platform(id = "f1", px = 20f, py = 420f, pWidth = 140f, pHeight = 50f, type = "normal"),
                Platform(id = "bounce1", px = 230f, py = 420f, pWidth = 70f, pHeight = 24f, type = "moving", color = "#10b981"),
                Platform(id = "bounce2", px = 450f, py = 420f, pWidth = 70f, pHeight = 24f, type = "moving", color = "#10b981"),
                Platform(id = "f_end", px = 640f, py = 420f, pWidth = 140f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "s_gap1", sx = 160f, sy = 460f, sWidth = 70f, sHeight = 24f, orientation = "up"),
                Spike(id = "s_gap2", sx = 300f, sy = 460f, sWidth = 150f, sHeight = 24f, orientation = "up"),
                Spike(id = "s_gap3", sx = 520f, sy = 460f, sWidth = 120f, sHeight = 24f, orientation = "up"),
                Spike(id = "s_ceil1", sx = 240f, sy = 60f, sWidth = 50f, sHeight = 24f, orientation = "down"),
                Spike(id = "s_ceil2", sx = 460f, sy = 60f, sWidth = 50f, sHeight = 24f, orientation = "down")
            )
        ),

        // LEVEL 19: The Chaser
        LevelDefinition(
            id = 19,
            title = "The Chaser",
            subtitle = "The door is hungry",
            hint = "Get close to wake it up, then leap over it when it charges!",
            trollName = "Predator Exit",
            playerStart = Point(70f, 390f),
            door = Door(id = "door19", dx = 680f, dy = 360f, dWidth = 44f, dHeight = 60f, isChasing = false),
            platforms = listOf(
                Platform(id = "f", px = 20f, py = 420f, pWidth = 760f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal"),
                Platform(id = "step_high", px = 380f, py = 260f, pWidth = 50f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(id = "pit_s19", sx = 385f, sy = 394f, sWidth = 40f, sHeight = 26f, orientation = "up")
            ),
            triggers = listOf(
                LevelTrigger(id = "trig_chase", type = "door_attack", tx = 520f, ty = 280f, tWidth = 100f, tHeight = 140f)
            )
        ),

        // LEVEL 20: Grand Finale
        LevelDefinition(
            id = 20,
            title = "Grand Finale",
            subtitle = "The Master of Deceit",
            hint = "Every trick at once! Floor shift, sudden spike, mind invert!",
            trollName = "Ultimate Gauntlet",
            playerStart = Point(60f, 390f),
            door = Door(id = "door20", dx = 720f, dy = 360f, dWidth = 46f, dHeight = 60f, label = "TROPHY", color = "#f59e0b"),
            platforms = listOf(
                Platform(id = "f1", px = 20f, py = 420f, pWidth = 180f, pHeight = 50f, type = "normal"),
                Platform(id = "c20_1", px = 200f, py = 420f, pWidth = 80f, pHeight = 50f, type = "crumbling"),
                Platform(id = "slide_block_20", px = 320f, py = 360f, pWidth = 60f, pHeight = 60f, type = "moving", origX = 320f, targetX = 420f, vx = 1.5f),
                Platform(id = "f2", px = 420f, py = 420f, pWidth = 360f, pHeight = 50f, type = "normal"),
                Platform(id = "wallL", px = 10f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "wallR", px = 770f, py = 50f, pWidth = 20f, pHeight = 420f, type = "normal"),
                Platform(id = "roof", px = 10f, py = 40f, pWidth = 780f, pHeight = 20f, type = "normal")
            ),
            spikes = listOf(
                Spike(
                    id = "pop_s20",
                    sx = 560f,
                    sy = 420f,
                    sWidth = 32f,
                    sHeight = 28f,
                    orientation = "up",
                    hidden = true,
                    popProgress = 0f,
                    origY = 420f,
                    targetY = 392f,
                    triggerX = 500f
                ),
                Spike(id = "pit_s20", sx = 280f, sy = 460f, sWidth = 40f, sHeight = 24f, orientation = "up")
            ),
            triggers = listOf(
                LevelTrigger(id = "trig_pop20", type = "popup_spike", tx = 490f, ty = 350f, tWidth = 40f, tHeight = 80f),
                LevelTrigger(id = "trig_invert20", type = "invert_controls", tx = 610f, ty = 100f, tWidth = 30f, tHeight = 320f)
            )
        )
    )
}
