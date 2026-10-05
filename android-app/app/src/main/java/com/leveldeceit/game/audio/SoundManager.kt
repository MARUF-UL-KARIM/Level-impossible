package com.leveldeceit.game.audio

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import kotlin.concurrent.thread
import kotlin.math.sin

class SoundManager(context: Context) {
    var enabled: Boolean = true
    var hapticEnabled: Boolean = true

    private val sampleRate = 22050
    private val vibrator: Vibrator? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
        vibratorManager?.defaultVibrator
    } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }

    private fun playToneSweep(
        startFreq: Float,
        endFreq: Float,
        durationMs: Int,
        type: String = "triangle"
    ) {
        if (!enabled) return
        thread {
            try {
                val numSamples = (sampleRate * (durationMs / 1000.0)).toInt()
                val samples = ShortArray(numSamples)
                var phase = 0.0

                for (i in 0 until numSamples) {
                    val progress = i.toDouble() / numSamples
                    val freq = startFreq + (endFreq - startFreq) * progress
                    val phaseIncrement = 2.0 * Math.PI * freq / sampleRate
                    phase += phaseIncrement

                    val envelope = 1.0 - progress
                    val valDouble = when (type) {
                        "sine" -> sin(phase)
                        "square" -> if (sin(phase) >= 0) 0.6 else -0.6
                        "triangle" -> (2.0 / Math.PI) * Math.asin(sin(phase))
                        "noise" -> (Math.random() * 2.0 - 1.0)
                        else -> sin(phase)
                    }

                    val sampleVal = (valDouble * envelope * 32767.0 * 0.4).coerceIn(-32768.0, 32767.0)
                    samples[i] = sampleVal.toInt().toShort()
                }

                val bufferSize = AudioTrack.getMinBufferSize(
                    sampleRate,
                    AudioFormat.CHANNEL_OUT_MONO,
                    AudioFormat.ENCODING_PCM_16BIT
                )

                val audioTrack = AudioTrack.Builder()
                    .setAudioAttributes(
                        AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_GAME)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .build()
                    )
                    .setAudioFormat(
                        AudioFormat.Builder()
                            .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                            .setSampleRate(sampleRate)
                            .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                            .build()
                    )
                    .setBufferSizeInBytes(bufferSize.coerceAtLeast(samples.size * 2))
                    .setTransferMode(AudioTrack.MODE_STATIC)
                    .build()

                audioTrack.write(samples, 0, samples.size)
                audioTrack.play()
                Thread.sleep(durationMs.toLong() + 50)
                audioTrack.release()
            } catch (_: Exception) {}
        }
    }

    fun playJump() {
        playToneSweep(180f, 440f, 120, "triangle")
        vibrate(15)
    }

    fun playDie() {
        playToneSweep(220f, 40f, 250, "square")
        vibrate(40)
    }

    fun playTroll() {
        playToneSweep(300f, 600f, 200, "sine")
        vibrate(20)
    }

    fun playWin() {
        thread {
            playToneSweep(261.63f, 329.63f, 100, "sine")
            Thread.sleep(100)
            playToneSweep(329.63f, 392f, 100, "sine")
            Thread.sleep(100)
            playToneSweep(392f, 523.25f, 200, "sine")
        }
        vibrate(60)
    }

    fun playClick() {
        playToneSweep(400f, 400f, 30, "sine")
        vibrate(10)
    }

    fun playWarning() {
        playToneSweep(500f, 250f, 80, "square")
    }

    fun vibrate(durationMs: Long) {
        if (!hapticEnabled || vibrator == null || !vibrator.hasVibrator()) return
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator.vibrate(durationMs)
            }
        } catch (_: Exception) {}
    }
}
