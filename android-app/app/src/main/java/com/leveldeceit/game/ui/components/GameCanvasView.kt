package com.leveldeceit.game.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.*
import androidx.compose.ui.text.*
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.leveldeceit.game.engine.GameEngine
import com.leveldeceit.game.model.Door
import com.leveldeceit.game.model.GameState
import com.leveldeceit.game.model.Player

@OptIn(ExperimentalTextApi::class)
@Composable
fun GameCanvasView(
    engine: GameEngine,
    tick: Long,
    textMeasurer: TextMeasurer,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .padding(8.dp)
            .aspectRatio(800f / 500f)
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFF0B0C13))
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val scaleX = size.width / engine.V_WIDTH
            val scaleY = size.height / engine.V_HEIGHT

            val shakeX = if (engine.shakeAmount > 0f) ((Math.random() - 0.5) * engine.shakeAmount * 2.0 * scaleX).toFloat() else 0f
            val shakeY = if (engine.shakeAmount > 0f) ((Math.random() - 0.5) * engine.shakeAmount * 2.0 * scaleY).toFloat() else 0f

            withTransform({
                translate(left = shakeX, top = shakeY)
                scale(scaleX, scaleY, pivot = Offset.Zero)
            }) {
                // 1. Background
                drawRect(color = Color(0xFF0F111A), size = Size(engine.V_WIDTH, engine.V_HEIGHT))

                // Subtle grid
                val gridColor = Color(0x08FFFFFF)
                for (x in 0..engine.V_WIDTH.toInt() step 40) {
                    drawLine(gridColor, start = Offset(x.toFloat(), 0f), end = Offset(x.toFloat(), engine.V_HEIGHT), strokeWidth = 1f)
                }
                for (y in 0..engine.V_HEIGHT.toInt() step 40) {
                    drawLine(gridColor, start = Offset(0f, y.toFloat()), end = Offset(engine.V_WIDTH, y.toFloat()), strokeWidth = 1f)
                }

                // 2. Render Platforms
                engine.level.platforms.forEach { plat ->
                    if (plat.isCrumbled) return@forEach
                    if (plat.type == "hidden" && !plat.isRevealed) return@forEach

                    val fillColor = when {
                        plat.type == "ice" -> Color(0xFF0284C7)
                        plat.type == "sticky" -> Color(0xFFB45309)
                        plat.type == "fake" -> Color(0x664B5563)
                        plat.type == "crumbling" && plat.crumbleTimer != null -> Color(0xFFDC2626)
                        plat.color != null -> Color(android.graphics.Color.parseColor(plat.color))
                        else -> Color(0xFF1E2235)
                    }

                    val borderColor = when {
                        plat.type == "ice" -> Color(0xFF38BDF8)
                        plat.type == "sticky" -> Color(0xFFF59E0B)
                        plat.type == "fake" -> Color(0x889CA3AF)
                        plat.type == "crumbling" && plat.crumbleTimer != null -> Color(0xFFF87171)
                        plat.borderColor != null -> Color(android.graphics.Color.parseColor(plat.borderColor))
                        else -> Color(0xFF333B5C)
                    }

                    val vibX = if (plat.type == "crumbling" && plat.crumbleTimer != null) ((Math.random() - 0.5) * 4.0).toFloat() else 0f

                    drawRoundRect(
                        color = fillColor,
                        topLeft = Offset(plat.px + vibX, plat.py),
                        size = Size(plat.pWidth, plat.pHeight),
                        cornerRadius = CornerRadius(4f, 4f),
                        style = Fill
                    )
                    drawRoundRect(
                        color = borderColor,
                        topLeft = Offset(plat.px + vibX, plat.py),
                        size = Size(plat.pWidth, plat.pHeight),
                        cornerRadius = CornerRadius(4f, 4f),
                        style = Stroke(width = 2f)
                    )

                    // Top highlight line
                    drawLine(
                        color = Color(0x26FFFFFF),
                        start = Offset(plat.px + vibX + 2f, plat.py + 2f),
                        end = Offset(plat.px + vibX + plat.pWidth - 2f, plat.py + 2f),
                        strokeWidth = 1.5f
                    )

                    if (plat.id.startsWith("bounce")) {
                        val result = textMeasurer.measure(
                            AnnotatedString("▲ BOUNCE ▲"),
                            style = TextStyle(color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        )
                        drawText(
                            textLayoutResult = result,
                            topLeft = Offset(plat.px + plat.pWidth / 2f - result.size.width / 2f, plat.py + 4f)
                        )
                    }
                }

                // 3. Render Spikes
                engine.level.spikes.forEach { spk ->
                    if (spk.hidden && spk.popProgress <= 0.05f) return@forEach

                    if (engine.level.id == 13 && spk.id.startsWith("geyser")) {
                        val cycle = (tick % 120).toInt()
                        if (cycle <= 40) {
                            if (cycle % 10 < 5) {
                                val result = textMeasurer.measure(
                                    AnnotatedString("!"),
                                    style = TextStyle(color = Color(0xFFEF4444), fontSize = 22.sp, fontWeight = FontWeight.Bold)
                                )
                                drawText(result, topLeft = Offset(spk.sx + spk.sWidth / 2f - result.size.width / 2f, spk.sy - 24f))
                            }
                            return@forEach
                        }
                    }

                    val spikeW = 16f
                    val count = maxOf(1, (spk.sWidth / spikeW).toInt())
                    val actualW = spk.sWidth / count

                    for (i in 0 until count) {
                        val sx = spk.sx + i * actualW
                        val path = Path()
                        when (spk.orientation) {
                            "up" -> {
                                path.moveTo(sx, spk.sy + spk.sHeight)
                                path.lineTo(sx + actualW / 2f, spk.sy)
                                path.lineTo(sx + actualW, spk.sy + spk.sHeight)
                            }
                            "down" -> {
                                path.moveTo(sx, spk.sy)
                                path.lineTo(sx + actualW / 2f, spk.sy + spk.sHeight)
                                path.lineTo(sx + actualW, spk.sy)
                            }
                            "left" -> {
                                path.moveTo(spk.sx + spk.sWidth, spk.sy)
                                path.lineTo(spk.sx, spk.sy + spk.sHeight / 2f)
                                path.lineTo(spk.sx + spk.sWidth, spk.sy + spk.sHeight)
                            }
                            "right" -> {
                                path.moveTo(spk.sx, spk.sy)
                                path.lineTo(spk.sx + spk.sWidth, spk.sy + spk.sHeight / 2f)
                                path.lineTo(spk.sx, spk.sy + spk.sHeight)
                            }
                        }
                        path.close()
                        drawPath(path, color = Color(0xFFEF4444), style = Fill)
                        drawPath(path, color = Color(0xFF991B1B), style = Stroke(width = 1.5f))
                    }
                }

                // 4. Render Door
                fun drawDoorUI(dDx: Float, dDy: Float, dW: Float, dH: Float, isCardboard: Boolean, isChasing: Boolean, label: String?, customColor: String?) {
                    if (isCardboard) {
                        drawRect(color = Color(0xFF78350F), topLeft = Offset(dDx, dDy + dH - 8f), size = Size(dW * 1.3f, 8f))
                        val result = textMeasurer.measure(
                            AnnotatedString("NOPE!"),
                            style = TextStyle(color = Color(0xFFEF4444), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        )
                        drawText(result, topLeft = Offset(dDx + 8f, dDy + dH - 24f))
                        return
                    }

                    val doorColor = if (customColor != null) Color(android.graphics.Color.parseColor(customColor)) else Color(0xFF10B981)

                    drawRoundRect(
                        color = doorColor,
                        topLeft = Offset(dDx, dDy),
                        size = Size(dW, dH),
                        cornerRadius = CornerRadius(8f, 8f)
                    )
                    drawRoundRect(
                        color = Color(0xFF064E3B),
                        topLeft = Offset(dDx + 5f, dDy + 6f),
                        size = Size(dW - 10f, dH - 6f),
                        cornerRadius = CornerRadius(6f, 6f)
                    )

                    val pulse = (Math.sin(tick * 0.08) * 3.0).toFloat()
                    drawCircle(
                        color = doorColor,
                        radius = 8f + pulse,
                        center = Offset(dDx + dW / 2f, dDy + dH / 2f)
                    )

                    label?.let { lbl ->
                        val result = textMeasurer.measure(
                            AnnotatedString(lbl),
                            style = TextStyle(color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        )
                        drawText(result, topLeft = Offset(dDx + dW / 2f - result.size.width / 2f, dDy - 14f))
                    }

                    if (isChasing) {
                        drawCircle(color = Color(0xFFEF4444), radius = 5f, center = Offset(dDx + 12f, dDy + 20f))
                        drawCircle(color = Color(0xFFEF4444), radius = 5f, center = Offset(dDx + 30f, dDy + 20f))
                        drawCircle(color = Color.Black, radius = 2.5f, center = Offset(dDx + 10f, dDy + 20f))
                        drawCircle(color = Color.Black, radius = 2.5f, center = Offset(dDx + 28f, dDy + 20f))

                        val teethPath = Path().apply {
                            moveTo(dDx + 10f, dDy + 35f)
                            lineTo(dDx + 15f, dDy + 42f)
                            lineTo(dDx + 20f, dDy + 35f)
                            lineTo(dDx + 25f, dDy + 42f)
                            lineTo(dDx + 30f, dDy + 35f)
                            close()
                        }
                        drawPath(teethPath, color = Color.White)
                    }
                }

                val d = engine.level.door
                drawDoorUI(d.dx, d.dy, d.dWidth, d.dHeight, d.isCardboardDown, d.isChasing, d.label, d.color)

                engine.realDoor?.let { rd ->
                    if (rd.active) {
                        drawDoorUI(rd.x, rd.y, rd.width, rd.height, false, false, null, null)
                    }
                }

                // 5. Render Shadow Clone
                engine.shadow?.let { s ->
                    if (engine.gameState == GameState.PLAYING) {
                        drawRoundRect(
                            color = Color(0xFF7C3AED),
                            topLeft = Offset(s.px, s.py),
                            size = Size(s.pWidth, s.pHeight),
                            cornerRadius = CornerRadius(6f, 6f)
                        )
                        drawRoundRect(
                            color = Color(0xFFA78BFA),
                            topLeft = Offset(s.px, s.py),
                            size = Size(s.pWidth, s.pHeight),
                            cornerRadius = CornerRadius(6f, 6f),
                            style = Stroke(2f)
                        )
                        val eyeX = if (s.facing == "right") s.px + 18f else s.px + 10f
                        drawCircle(color = Color(0xFFF43F5E), radius = 3.5f, center = Offset(eyeX, s.py + 11f))
                    }
                }

                // 6. Render Player Cube
                val p = engine.player
                if (engine.gameState == GameState.PLAYING) {
                    val pCenterX = p.px + p.pWidth / 2f
                    val pCenterY = p.py + p.pHeight / 2f

                    withTransform({
                        translate(left = pCenterX, top = pCenterY)
                        scale(p.squashX, if (p.gravityInverted) -p.squashY else p.squashY, pivot = Offset.Zero)
                    }) {
                        val bodyRect = Rect(-p.pWidth / 2f, -p.pHeight / 2f, p.pWidth / 2f, p.pHeight / 2f)
                        drawRoundRect(
                            color = Color(0xFF38BDF8),
                            topLeft = bodyRect.topLeft,
                            size = bodyRect.size,
                            cornerRadius = CornerRadius(6f, 6f)
                        )
                        drawRoundRect(
                            color = Color(0xFFE0F2FE),
                            topLeft = bodyRect.topLeft,
                            size = bodyRect.size,
                            cornerRadius = CornerRadius(6f, 6f),
                            style = Stroke(2f)
                        )

                        if (!p.isBlinking) {
                            val eyeSpacing = 8f
                            val eyeOffsetY = -2f + p.eyeLookY
                            val eyeOffsetX = p.eyeLookX

                            // White
                            drawCircle(color = Color.White, radius = 4.5f, center = Offset(-eyeSpacing / 2f + eyeOffsetX, eyeOffsetY))
                            drawCircle(color = Color.White, radius = 4.5f, center = Offset(eyeSpacing / 2f + eyeOffsetX, eyeOffsetY))

                            // Pupil
                            val pupilDir = if (p.facing == "right") 1.5f else -1.5f
                            drawCircle(color = Color(0xFF0F172A), radius = 2.2f, center = Offset(-eyeSpacing / 2f + eyeOffsetX + pupilDir, eyeOffsetY))
                            drawCircle(color = Color(0xFF0F172A), radius = 2.2f, center = Offset(eyeSpacing / 2f + eyeOffsetX + pupilDir, eyeOffsetY))
                        } else {
                            drawLine(color = Color(0xFF0F172A), start = Offset(-p.pWidth / 4f, 0f), end = Offset(-2f, 0f), strokeWidth = 2f)
                            drawLine(color = Color(0xFF0F172A), start = Offset(2f, 0f), end = Offset(p.pWidth / 4f, 0f), strokeWidth = 2f)
                        }
                    }
                }

                // 7. Particles
                engine.particles.forEach { pt ->
                    val alpha = pt.alpha.coerceIn(0f, 1f)
                    drawRect(
                        color = Color(pt.color).copy(alpha = alpha),
                        topLeft = Offset(pt.x - pt.size / 2f, pt.y - pt.size / 2f),
                        size = Size(pt.size, pt.size)
                    )
                }

                // 8. Darkness Filter (Level 11)
                engine.level.darknessRadius?.let { rad ->
                    if (engine.gameState == GameState.PLAYING) {
                        val darkPath = Path().apply {
                            addRect(Rect(0f, 0f, engine.V_WIDTH, engine.V_HEIGHT))
                            addOval(Rect(p.px + p.pWidth / 2f - rad, p.py + p.pHeight / 2f - rad, p.px + p.pWidth / 2f + rad, p.py + p.pHeight / 2f + rad))
                            fillType = PathFillType.EvenOdd
                        }
                        drawPath(darkPath, color = Color(0xF508090E))
                    }
                }

                // 9. Floating Troll Alert
                engine.trollAlert?.let { alertText ->
                    val result = textMeasurer.measure(
                        AnnotatedString(alertText),
                        style = TextStyle(color = Color(0xFFF43F5E), fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    )
                    drawText(result, topLeft = Offset(engine.V_WIDTH / 2f - result.size.width / 2f, 80f))
                }
            }
        }
    }
}
