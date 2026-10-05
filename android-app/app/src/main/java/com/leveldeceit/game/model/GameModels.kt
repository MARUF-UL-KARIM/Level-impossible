package com.leveldeceit.game.model

enum class GameState {
    PLAYING, DEAD, LEVEL_CLEARED, GAME_COMPLETED
}

open class Rect(
    var x: Float,
    var y: Float,
    var width: Float,
    var height: Float
)

data class Player(
    var px: Float,
    var py: Float,
    var pWidth: Float = 28f,
    var pHeight: Float = 28f,
    var vx: Float = 0f,
    var vy: Float = 0f,
    var isGrounded: Boolean = false,
    var facing: String = "right",
    var squashX: Float = 1f,
    var squashY: Float = 1f,
    var coyoteTimer: Int = 0,
    var jumpBufferTimer: Int = 0,
    var eyeLookX: Float = 0f,
    var eyeLookY: Float = 0f,
    var blinkTimer: Int = 120,
    var isBlinking: Boolean = false,
    var gravityInverted: Boolean = false
) : Rect(px, py, pWidth, pHeight) {
    fun updateRect() {
        x = px
        y = py
        width = pWidth
        height = pHeight
    }
}

data class Platform(
    val id: String,
    var px: Float,
    var py: Float,
    var pWidth: Float,
    var pHeight: Float,
    var type: String = "normal", // normal, fake, crumbling, ice, sticky, moving, hidden
    var color: String? = null,
    var borderColor: String? = null,
    var crumbleTimer: Int? = null,
    var isCrumbled: Boolean = false,
    var isRevealed: Boolean = false,
    var origX: Float? = null,
    var origY: Float? = null,
    var targetX: Float? = null,
    var targetY: Float? = null,
    var vx: Float = 0f,
    var vy: Float = 0f,
    var moveRange: Float = 0f,
    var moveSpeed: Float = 0f
) : Rect(px, py, pWidth, pHeight) {
    fun updateRect() {
        x = px
        y = py
        width = pWidth
        height = pHeight
    }
}

data class Spike(
    val id: String,
    var sx: Float,
    var sy: Float,
    var sWidth: Float,
    var sHeight: Float,
    var orientation: String = "up", // up, down, left, right
    var hidden: Boolean = false,
    var popProgress: Float = 0f,
    var isPopping: Boolean = false,
    var triggerX: Float? = null,
    var vx: Float = 0f,
    var vy: Float = 0f,
    var origY: Float? = null,
    var targetY: Float? = null,
    var origX: Float? = null,
    var targetX: Float? = null
) : Rect(sx, sy, sWidth, sHeight) {
    fun updateRect() {
        x = sx
        y = sy
        width = sWidth
        height = sHeight
    }
}

data class Door(
    val id: String,
    var dx: Float,
    var dy: Float,
    var dWidth: Float = 42f,
    var dHeight: Float = 60f,
    var isFake: Boolean = false,
    var isCardboardDown: Boolean = false,
    var isOpen: Boolean = false,
    var vx: Float = 0f,
    var vy: Float = 0f,
    var isChasing: Boolean = false,
    var hasRunAway: Boolean = false,
    var label: String? = null,
    var color: String? = null
) : Rect(dx, dy, dWidth, dHeight) {
    fun updateRect() {
        x = dx
        y = dy
        width = dWidth
        height = dHeight
    }
}

data class LevelTrigger(
    val id: String,
    val type: String,
    var tx: Float,
    var ty: Float,
    var tWidth: Float,
    var tHeight: Float,
    var activated: Boolean = false,
    var slabIndex: Int = 0
) : Rect(tx, ty, tWidth, tHeight)

data class Particle(
    var x: Float,
    var y: Float,
    var vx: Float,
    var vy: Float,
    var size: Float,
    var color: Long,
    var alpha: Float = 1f,
    var life: Int = 0,
    var maxLife: Int = 45,
    var rotation: Float = 0f,
    var vRot: Float = 0f
)

data class Point(val x: Float, val y: Float)

data class RealDoor(
    var x: Float,
    var y: Float,
    var width: Float = 42f,
    var height: Float = 60f,
    var active: Boolean = true
)

data class LevelDefinition(
    val id: Int,
    val title: String,
    val subtitle: String,
    val hint: String = "Watch your step!",
    val trollName: String,
    val playerStart: Point,
    val door: Door,
    val platforms: List<Platform>,
    val spikes: List<Spike>,
    val triggers: List<LevelTrigger> = emptyList(),
    val darknessRadius: Float? = null,
    val controlsInverted: Boolean = false,
    val icePhysics: Boolean = false,
    val shadowClone: Boolean = false
) {
    fun deepCopy(): LevelDefinition {
        return LevelDefinition(
            id = id,
            title = title,
            subtitle = subtitle,
            hint = hint,
            trollName = trollName,
            playerStart = playerStart.copy(),
            door = door.copy(),
            platforms = platforms.map { it.copy() },
            spikes = spikes.map { it.copy() },
            triggers = triggers.map { it.copy() },
            darknessRadius = darknessRadius,
            controlsInverted = controlsInverted,
            icePhysics = icePhysics,
            shadowClone = shadowClone
        )
    }
}
