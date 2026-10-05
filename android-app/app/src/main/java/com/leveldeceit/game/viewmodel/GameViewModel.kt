package com.leveldeceit.game.viewmodel

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.leveldeceit.game.audio.SoundManager
import com.leveldeceit.game.engine.GameEngine
import com.leveldeceit.game.model.GameState
import com.leveldeceit.game.model.LevelDefinition
import com.leveldeceit.game.repository.LevelRepository
import com.leveldeceit.game.storage.SaveManager
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class GameViewModel(application: Application) : AndroidViewModel(application) {
    val saveManager = SaveManager(application)
    val soundManager = SoundManager(application)

    var currentLevelId by mutableStateOf(saveManager.currentLevelId)
        private set
    var unlockedLevel by mutableStateOf(saveManager.unlockedLevel)
        private set
    var levelDeaths by mutableStateOf(saveManager.getLevelDeaths())
        private set
    var soundEnabled by mutableStateOf(saveManager.soundEnabled)
        private set

    var showLevelSelect by mutableStateOf(false)
    var showVictoryModal by mutableStateOf(false)
    var showGameComplete by mutableStateOf(false)
    var showHintModal by mutableStateOf(false)

    var inputLeft by mutableStateOf(false)
    var inputRight by mutableStateOf(false)
    var inputJump by mutableStateOf(false)

    val currentLevel: LevelDefinition
        get() = LevelRepository.LEVELS.find { it.id == currentLevelId } ?: LevelRepository.LEVELS[0]

    val totalDeaths: Int
        get() = levelDeaths.values.sum()

    val currentLevelDeaths: Int
        get() = levelDeaths[currentLevelId] ?: 0

    val gameEngine: GameEngine = GameEngine(
        initialLevel = currentLevel,
        soundManager = soundManager,
        onLevelComplete = {
            viewModelScope.launch {
                delay(600)
                if (currentLevelId == 20) {
                    showGameComplete = true
                } else {
                    showVictoryModal = true
                }
                val nextUnlocked = maxOf(unlockedLevel, currentLevelId + 1)
                unlockedLevel = nextUnlocked
                saveManager.saveProgress(nextUnlocked, currentLevelId, levelDeaths)
            }
        },
        onPlayerDeath = {
            viewModelScope.launch {
                val updated = levelDeaths.toMutableMap()
                updated[currentLevelId] = (updated[currentLevelId] ?: 0) + 1
                levelDeaths = updated
                saveManager.saveLevelDeaths(updated)

                delay(700)
                resetCurrentLevel()
            }
        }
    )

    var tickCounter by mutableStateOf(0L)
        private set

    init {
        soundManager.enabled = soundEnabled
        viewModelScope.launch {
            while (true) {
                delay(16) // ~60 FPS
                val isPaused = showLevelSelect || showVictoryModal || showGameComplete || showHintModal
                if (!isPaused) {
                    gameEngine.update(inputLeft, inputRight, inputJump)
                    tickCounter++
                }
            }
        }
    }

    fun restartCurrentLevel() {
        gameEngine.resetLevel(currentLevel)
    }

    private fun resetCurrentLevel() {
        gameEngine.resetLevel(currentLevel)
    }

    fun selectLevel(levelId: Int) {
        currentLevelId = levelId
        saveManager.currentLevelId = levelId
        gameEngine.resetLevel(currentLevel)
        showLevelSelect = false
        showVictoryModal = false
        showGameComplete = false
    }

    fun nextLevel() {
        showVictoryModal = false
        if (currentLevelId < 20) {
            currentLevelId++
            saveManager.currentLevelId = currentLevelId
            val nextUnlocked = maxOf(unlockedLevel, currentLevelId)
            unlockedLevel = nextUnlocked
            saveManager.saveProgress(nextUnlocked, currentLevelId, levelDeaths)
            gameEngine.resetLevel(currentLevel)
        } else {
            showGameComplete = true
        }
    }

    fun skipLevel() {
        if (currentLevelId < 20) {
            currentLevelId++
            saveManager.currentLevelId = currentLevelId
            val nextUnlocked = maxOf(unlockedLevel, currentLevelId)
            unlockedLevel = nextUnlocked
            saveManager.saveProgress(nextUnlocked, currentLevelId, levelDeaths)
            gameEngine.resetLevel(currentLevel)
        }
    }

    fun toggleSound() {
        soundEnabled = !soundEnabled
        saveManager.soundEnabled = soundEnabled
        soundManager.enabled = soundEnabled
    }

    fun resetAllProgress() {
        saveManager.clearAll()
        unlockedLevel = 1
        currentLevelId = 1
        levelDeaths = emptyMap()
        showLevelSelect = false
        showGameComplete = false
        showVictoryModal = false
        gameEngine.resetLevel(currentLevel)
    }
}
