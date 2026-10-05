package com.leveldeceit.game.engine

import com.leveldeceit.game.audio.SoundManager
import com.leveldeceit.game.model.*
import kotlin.math.abs
import kotlin.math.min
import kotlin.math.sign

class GameEngine(
    initialLevel: LevelDefinition,
    private val soundManager: SoundManager,
    private val onLevelComplete: () -> Unit,
    private val onPlayerDeath: () -> Unit
) {
    var level: LevelDefinition = initialLevel.deepCopy()
        private set

    var gameState: GameState = GameState.PLAYING
        private set

    var trollAlert: String? = null
        private set

    var shakeAmount: Float = 0f
        private set

    val particles = mutableListOf<Particle>()
    var invertedControls: Boolean = level.controlsInverted
        private set

    var realDoor: RealDoor? = null
        private set

    val player: Player = Player(
        px = initialLevel.playerStart.x,
        py = initialLevel.playerStart.y,
        pWidth = 28f,
        pHeight = 28f
    )

    var shadow: Player? = if (initialLevel.shadowClone) {
        Player(
            px = 800f - initialLevel.playerStart.x - 28f,
            py = initialLevel.playerStart.y,
            pWidth = 28f,
            pHeight = 28f,
            facing = "left"
        )
    } else null
        private set

    private var geyserTimer: Int = 0
    private var frameCount: Int = 0

    val V_WIDTH = 800f
    val V_HEIGHT = 500f
    val GRAVITY = 0.58f
    val MAX_FALL_SPEED = 12f
    val RUN_SPEED = 4.8f
    val ACCEL = 1.1f
    val JUMP_FORCE = -11.2f

    fun resetLevel(newLevel: LevelDefinition) {
        level = newLevel.deepCopy()
        gameState = GameState.PLAYING
        trollAlert = null
        shakeAmount = 0f
        frameCount = 0
        geyserTimer = 0
        invertedControls = level.controlsInverted
        realDoor = null
        particles.clear()

        player.px = level.playerStart.x
        player.py = level.playerStart.y
        player.vx = 0f
        player.vy = 0f
        player.isGrounded = false
        player.facing = "right"
        player.squashX = 1f
        player.squashY = 1f
        player.coyoteTimer = 0
        player.jumpBufferTimer = 0
        player.blinkTimer = 120
        player.isBlinking = false
        player.gravityInverted = false
        player.updateRect()

        if (level.shadowClone) {
            shadow = Player(
                px = V_WIDTH - level.playerStart.x - 28f,
                py = level.playerStart.y,
                pWidth = 28f,
                pHeight = 28f,
                facing = "left"
            )
            shadow?.updateRect()
        } else {
            shadow = null
        }
    }

    fun killPlayer(customMsg: String? = null) {
        if (gameState == GameState.DEAD || gameState == GameState.LEVEL_CLEARED) return
        gameState = GameState.DEAD
        shakeAmount = 12f
        soundManager.playDie()

        // Death particle explosion
        for (i in 0 until 24) {
            val angle = Math.random() * Math.PI * 2.0
            val speed = 2.0 + Math.random() * 6.0
            particles.add(
                Particle(
                    x = player.px + player.pWidth / 2f,
                    y = player.py + player.pHeight / 2f,
                    vx = (Math.cos(angle) * speed).toFloat(),
                    vy = (Math.sin(angle) * speed - 2.0).toFloat(),
                    size = (4.0 + Math.random() * 6.0).toFloat(),
                    color = listOf(0xFF38BDF8, 0xFF0284C7, 0xFFF43F5E, 0xFFFFFFFF)[(Math.random() * 4).toInt()],
                    life = 0,
                    maxLife = (45.0 + Math.random() * 20.0).toInt(),
                    rotation = (Math.random() * Math.PI * 2.0).toFloat(),
                    vRot = ((Math.random() - 0.5) * 0.3).toFloat()
                )
            )
        }

        if (customMsg != null) {
            trollAlert = customMsg
        } else {
            val quotes = listOf(
                "Gotcha!",
                "Did not see that coming, did you?",
                "Classic deceit!",
                "Almost had it... not really.",
                "Watch your step!",
                "It was a trap all along!",
                "Physics is a suggestion here."
            )
            trollAlert = quotes.random()
        }

        onPlayerDeath()
    }

    fun completeLevel() {
        if (gameState == GameState.LEVEL_CLEARED || gameState == GameState.DEAD) return
        gameState = GameState.LEVEL_CLEARED
        soundManager.playWin()

        val door = level.door
        for (i in 0 until 36) {
            val angle = Math.random() * Math.PI * 2.0
            val speed = 3.0 + Math.random() * 7.0
            particles.add(
                Particle(
                    x = door.dx + door.dWidth / 2f,
                    y = door.dy + door.dHeight / 2f,
                    vx = (Math.cos(angle) * speed).toFloat(),
                    vy = (Math.sin(angle) * speed - 4.0).toFloat(),
                    size = (5.0 + Math.random() * 5.0).toFloat(),
                    color = listOf(0xFF10B981, 0xFFF59E0B, 0xFF38BDF8, 0xFFEC4899, 0xFFA855F7).random(),
                    life = 0,
                    maxLife = 60
                )
            )
        }

        onLevelComplete()
    }

    fun update(inputLeft: Boolean, inputRight: Boolean, inputJump: Boolean) {
        frameCount++

        if (gameState == GameState.PLAYING) {
            var moveLeft = inputLeft
            var moveRight = inputRight
            val jumpPressed = inputJump

            if (invertedControls) {
                val temp = moveLeft
                moveLeft = moveRight
                moveRight = temp
            }

            var targetVx = 0f
            if (moveLeft && !moveRight) {
                targetVx = -RUN_SPEED
                player.facing = "left"
            } else if (moveRight && !moveLeft) {
                targetVx = RUN_SPEED
                player.facing = "right"
            }

            var friction = 0.78f
            if (level.icePhysics) friction = 0.95f

            var standingOnSticky = false
            var standingOnIce = false

            level.platforms.forEach { plat ->
                if (plat.type == "sticky" &&
                    player.px + player.pWidth > plat.px && player.px < plat.px + plat.pWidth &&
                    abs(player.py + player.pHeight - plat.py) < 4f
                ) {
                    standingOnSticky = true
                }
                if (plat.type == "ice" &&
                    player.px + player.pWidth > plat.px && player.px < plat.px + plat.pWidth &&
                    abs(player.py + player.pHeight - plat.py) < 4f
                ) {
                    standingOnIce = true
                }
            }

            if (standingOnSticky) {
                friction = 0.45f
                targetVx *= 0.6f
            } else if (standingOnIce) {
                friction = 0.96f
            }

            player.vx += (targetVx - player.vx) * (1f - friction) * ACCEL

            val grav = if (player.gravityInverted) -GRAVITY else GRAVITY
            player.vy += grav
            if (abs(player.vy) > MAX_FALL_SPEED) {
                player.vy = sign(player.vy) * MAX_FALL_SPEED
            }

            if (player.isGrounded) {
                player.coyoteTimer = 6
            } else if (player.coyoteTimer > 0) {
                player.coyoteTimer--
            }

            if (jumpPressed) {
                player.jumpBufferTimer = 6
            } else if (player.jumpBufferTimer > 0) {
                player.jumpBufferTimer--
            }

            if (player.jumpBufferTimer > 0 && player.coyoteTimer > 0) {
                val jumpPower = if (standingOnSticky) JUMP_FORCE * 0.75f else JUMP_FORCE
                player.vy = if (player.gravityInverted) -jumpPower else jumpPower
                player.coyoteTimer = 0
                player.jumpBufferTimer = 0
                player.isGrounded = false
                player.squashX = 0.7f
                player.squashY = 1.35f
                soundManager.playJump()

                if (level.id == 7) {
                    level.spikes.forEach { spk ->
                        if (spk.id.startsWith("slide")) {
                            spk.vx = -4.2f
                        }
                    }
                    soundManager.playTroll()
                    trollAlert = "Jumped right into the trap!"
                }
            }

            if (!jumpPressed && !player.gravityInverted && player.vy < -3f) {
                player.vy *= 0.85f
            } else if (!jumpPressed && player.gravityInverted && player.vy > 3f) {
                player.vy *= 0.85f
            }

            // X Sweep
            var newX = player.px + player.vx
            var newY = player.py

            level.platforms.forEach { plat ->
                if (plat.type == "fake" || (plat.type == "hidden" && !plat.isRevealed)) return@forEach
                if (plat.isCrumbled) return@forEach

                if (newX < plat.px + plat.pWidth &&
                    newX + player.pWidth > plat.px &&
                    player.py < plat.py + plat.pHeight &&
                    player.py + player.pHeight > plat.py
                ) {
                    if (player.vx > 0) {
                        newX = plat.px - player.pWidth
                        player.vx = 0f
                    } else if (player.vx < 0) {
                        newX = plat.px + plat.pWidth
                        player.vx = 0f
                    }
                }
            }
            player.px = newX
            player.updateRect()

            // Y Sweep
            newY = player.py + player.vy
            player.isGrounded = false

            level.platforms.forEach { plat ->
                if (plat.type == "fake") {
                    if (player.px + player.pWidth > plat.px &&
                        player.px < plat.px + plat.pWidth &&
                        player.py + player.pHeight >= plat.py &&
                        player.py <= plat.py + plat.pHeight
                    ) {
                        plat.color = "#66EF4444"
                        soundManager.playTroll()
                        trollAlert = "PSYCH! Hologram floor!"
                    }
                    return@forEach
                }

                if (plat.type == "hidden" && !plat.isRevealed) {
                    if (player.px + player.pWidth > plat.px &&
                        player.px < plat.px + plat.pWidth &&
                        newY < plat.py + plat.pHeight &&
                        newY + player.pHeight > plat.py
                    ) {
                        plat.isRevealed = true
                        plat.color = "#38BDF8"
                        soundManager.playClick()
                        trollAlert = "Hidden step revealed!"
                    } else {
                        return@forEach
                    }
                }

                if (plat.isCrumbled) return@forEach

                if (player.px < plat.px + plat.pWidth &&
                    player.px + player.pWidth > plat.px &&
                    newY < plat.py + plat.pHeight &&
                    newY + player.pHeight > plat.py
                ) {
                    if (!player.gravityInverted) {
                        if (player.vy > 0 && player.py + player.pHeight <= plat.py + 12f) {
                            newY = plat.py - player.pHeight
                            player.vy = 0f
                            player.isGrounded = true

                            if (player.squashY < 0.85f) {
                                player.squashX = 1.3f
                                player.squashY = 0.7f
                            }

                            if (plat.type == "crumbling" && plat.crumbleTimer == null) {
                                plat.crumbleTimer = 22
                                soundManager.playWarning()
                            }

                            if (plat.id.startsWith("bounce")) {
                                player.vy = -14.5f
                                player.isGrounded = false
                                soundManager.playJump()
                            }
                        } else if (player.vy < 0) {
                            newY = plat.py + plat.pHeight
                            player.vy = 0f
                        }
                    } else {
                        if (player.vy < 0 && player.py >= plat.py + plat.pHeight - 12f) {
                            newY = plat.py + plat.pHeight
                            player.vy = 0f
                            player.isGrounded = true
                        } else if (player.vy > 0) {
                            newY = plat.py - player.pHeight
                            player.vy = 0f
                        }
                    }
                }
            }
            player.py = newY
            player.updateRect()

            // Shadow Clone update
            shadow?.let { s ->
                s.vx = -player.vx
                s.vy = player.vy
                s.px += s.vx
                s.py += s.vy
                s.facing = if (player.facing == "left") "right" else "left"
                s.px = s.px.coerceIn(30f, V_WIDTH - 60f)
                s.updateRect()
            }

            // Platform animations & moving
            level.platforms.forEach { plat ->
                plat.crumbleTimer?.let { t ->
                    if (t > 0) {
                        plat.crumbleTimer = t - 1
                        if (plat.crumbleTimer == 0) {
                            plat.isCrumbled = true
                            soundManager.playTroll()
                            for (i in 0 until 10) {
                                particles.add(
                                    Particle(
                                        x = plat.px + (Math.random() * plat.pWidth).toFloat(),
                                        y = plat.py + (Math.random() * plat.pHeight).toFloat(),
                                        vx = ((Math.random() - 0.5) * 3.0).toFloat(),
                                        vy = (2.0 + Math.random() * 3.0).toFloat(),
                                        size = 4f,
                                        color = 0xFF94A3B8,
                                        life = 0,
                                        maxLife = 30
                                    )
                                )
                            }
                        }
                    }
                }

                if (plat.type == "moving" && plat.vx != 0f) {
                    plat.px += plat.vx
                    plat.updateRect()
                    plat.targetX?.let { tx ->
                        if (plat.px >= tx) plat.vx = 0f
                    }
                    if (plat.id == "crush_wall" && player.px < plat.px + plat.pWidth) {
                        player.px = plat.px + plat.pWidth
                        player.updateRect()
                        if (player.px + player.pWidth >= 770f) {
                            killPlayer("Squished by the wall!")
                        }
                    }
                }

                if (plat.type == "moving" && plat.vy != 0f) {
                    plat.py += plat.vy
                    plat.updateRect()
                    plat.targetY?.let { ty ->
                        if (plat.vy < 0f && plat.py <= ty) {
                            plat.py = ty
                            plat.vy = -plat.vy
                        } else if (plat.vy > 0f && plat.origY != null && plat.py >= plat.origY!!) {
                            plat.py = plat.origY!!
                            plat.vy = -plat.vy
                        }
                    }
                }

                if (plat.id == "drop_floor" && plat.vy > 0f) {
                    plat.py += plat.vy
                    plat.updateRect()
                    if (plat.py > 600f) plat.vy = 0f
                }
            }

            // Spike updates
            level.spikes.forEach { spk ->
                if (spk.vx != 0f) {
                    spk.sx += spk.vx
                    spk.updateRect()
                    if (spk.sx < 150f) spk.vx = 0f
                }

                if (spk.isPopping && spk.popProgress < 1f) {
                    spk.popProgress = min(1f, spk.popProgress + 0.15f)
                    spk.origY?.let { oy ->
                        spk.targetY?.let { ty ->
                            spk.sy = oy - (oy - ty) * spk.popProgress
                            spk.updateRect()
                        }
                    }
                }
            }

            // Level 13 Spike Geysers
            if (level.id == 13) {
                geyserTimer = (geyserTimer + 1) % 120
                level.spikes.forEach { spk ->
                    if (spk.id.startsWith("geyser")) {
                        if (geyserTimer in 41..89) {
                            spk.popProgress = 1f
                            spk.targetY?.let { ty -> spk.sy = ty; spk.updateRect() }
                        } else {
                            spk.popProgress = 0f
                            spk.origY?.let { oy -> spk.sy = oy; spk.updateRect() }
                        }
                    }
                }
            }

            // Triggers
            level.triggers.forEach { trig ->
                if (trig.activated) return@forEach

                val inTrig = player.px < trig.tx + trig.tWidth &&
                        player.px + player.pWidth > trig.tx &&
                        player.py < trig.ty + trig.tHeight &&
                        player.py + player.pHeight > trig.ty

                if (inTrig) {
                    trig.activated = true
                    when (trig.type) {
                        "popup_spike" -> {
                            level.spikes.find { it.id == "hidden_spike_1" || it.id == "pop_s20" }?.let { spk ->
                                spk.hidden = false
                                spk.isPopping = true
                                soundManager.playTroll()
                                trollAlert = "SURPRISE!"
                            }
                        }
                        "fall_floor" -> {
                            level.platforms.find { it.id == "drop_floor" }?.let { df ->
                                df.vy = 6.5f
                                soundManager.playTroll()
                                trollAlert = "Floor left the chat!"
                            }
                        }
                        "runaway_door" -> {
                            if (!level.door.hasRunAway) {
                                level.door.hasRunAway = true
                                soundManager.playTroll()
                                trollAlert = "Catch me if you can!"
                                level.door.dx = 100f
                                level.door.dy = 360f
                                level.door.updateRect()
                            }
                        }
                        "drop_ceiling" -> {
                            val idx = trig.slabIndex
                            level.platforms.find { it.id == "drop_slab_${idx + 1}" }?.let { slab ->
                                slab.vy = 8.5f
                                soundManager.playTroll()
                                trollAlert = "WATCH OUT ABOVE!"
                            }
                        }
                        "invert_controls" -> {
                            invertedControls = true
                            soundManager.playTroll()
                            trollAlert = "MIND BEND: Controls Inverted!"
                        }
                        "flip_gravity" -> {
                            player.gravityInverted = !player.gravityInverted
                            soundManager.playTroll()
                            trollAlert = if (player.gravityInverted) "GRAVITY FLIPPED!" else "GRAVITY RESTORED!"
                        }
                        "fake_door" -> {
                            level.door.isCardboardDown = true
                            soundManager.playTroll()
                            trollAlert = "NOPE! Real door is at the start!"
                            realDoor = RealDoor(x = 60f, y = 360f, width = 42f, height = 60f, active = true)
                        }
                        "door_attack" -> {
                            level.door.isChasing = true
                            soundManager.playTroll()
                            trollAlert = "THE DOOR IS ATTACKING!"
                        }
                        "secret_switch" -> {
                            soundManager.playWin()
                            trollAlert = "Secret passage opened!"
                            realDoor = RealDoor(x = 380f, y = 200f, width = 42f, height = 60f, active = true)
                        }
                    }
                }
            }

            // Chasing door
            if (level.door.isChasing) {
                level.door.dx -= 3.8f
                level.door.updateRect()
                if (level.door.dx < 40f) {
                    level.door.dx = 40f
                    level.door.isChasing = false
                }
                if (player.px < level.door.dx + level.door.dWidth &&
                    player.px + player.pWidth > level.door.dx &&
                    player.py < level.door.dy + level.door.dHeight &&
                    player.py + player.pHeight > level.door.dy
                ) {
                    if (player.px > level.door.dx + level.door.dWidth - 10f) {
                        completeLevel()
                    } else {
                        killPlayer("Eaten by the door!")
                    }
                }
            }

            // Spike Hit Test
            fun checkSpikeHit(char: Player): Boolean {
                for (spk in level.spikes) {
                    if (spk.hidden && spk.popProgress <= 0.1f) continue
                    if (spk.id.startsWith("geyser") && spk.popProgress <= 0.1f) continue

                    val hitInset = 4f
                    val sx = spk.sx + hitInset
                    val sy = spk.sy + hitInset
                    val sw = spk.sWidth - hitInset * 2f
                    val sh = spk.sHeight - hitInset * 2f

                    if (char.px < sx + sw &&
                        char.px + char.pWidth > sx &&
                        char.py < sy + sh &&
                        char.py + char.pHeight > sy
                    ) {
                        return true
                    }
                }
                return false
            }

            if (checkSpikeHit(player)) {
                killPlayer()
            }

            shadow?.let { s ->
                if (checkSpikeHit(s)) {
                    killPlayer("Shadow hit a spike!")
                }
            }

            if (player.py > V_HEIGHT + 40f || player.py < -60f) {
                killPlayer("Fell into the void!")
            }

            // Door check
            val activeDoorX = realDoor?.takeIf { it.active }?.x ?: level.door.dx
            val activeDoorY = realDoor?.takeIf { it.active }?.y ?: level.door.dy
            val activeDoorW = realDoor?.takeIf { it.active }?.width ?: level.door.dWidth
            val activeDoorH = realDoor?.takeIf { it.active }?.height ?: level.door.dHeight

            if (!level.door.isCardboardDown && !level.door.isChasing) {
                if (player.px + player.pWidth > activeDoorX + 8f &&
                    player.px < activeDoorX + activeDoorW - 8f &&
                    player.py + player.pHeight > activeDoorY + 10f &&
                    player.py < activeDoorY + activeDoorH
                ) {
                    if (level.door.isFake && realDoor?.active != true) {
                        level.door.isCardboardDown = true
                        soundManager.playTroll()
                        trollAlert = "PSYCH! Door fell over!"
                        realDoor = RealDoor(x = 60f, y = 360f, width = 42f, height = 60f, active = true)
                    } else {
                        completeLevel()
                    }
                }
            }

            player.squashX += (1f - player.squashX) * 0.18f
            player.squashY += (1f - player.squashY) * 0.18f
            player.eyeLookX = if (player.facing == "right") 3f else -3f
            player.eyeLookY = if (player.vy > 1f) 2f else if (player.vy < -1f) -2f else 0f

            player.blinkTimer--
            if (player.blinkTimer <= 0) {
                player.isBlinking = true
                if (player.blinkTimer < -6) {
                    player.isBlinking = false
                    player.blinkTimer = 100 + (Math.random() * 120).toInt()
                }
            }
        }

        if (shakeAmount > 0f) {
            shakeAmount *= 0.86f
            if (shakeAmount < 0.2f) shakeAmount = 0f
        }

        for (i in particles.indices.reversed()) {
            val pt = particles[i]
            pt.x += pt.vx
            pt.y += pt.vy
            pt.vy += 0.25f
            pt.life++
            pt.alpha = 1f - pt.life.toFloat() / pt.maxLife.toFloat()
            pt.rotation += pt.vRot
            if (pt.life >= pt.maxLife) {
                particles.removeAt(i)
            }
        }
    }
}
