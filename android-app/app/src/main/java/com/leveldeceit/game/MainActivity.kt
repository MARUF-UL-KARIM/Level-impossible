package com.leveldeceit.game

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.leveldeceit.game.ui.components.GameCanvasView
import com.leveldeceit.game.ui.components.HeaderBar
import com.leveldeceit.game.ui.components.TouchControls
import com.leveldeceit.game.ui.modals.GameCompleteModal
import com.leveldeceit.game.ui.modals.HintModal
import com.leveldeceit.game.ui.modals.LevelSelectModal
import com.leveldeceit.game.ui.modals.VictoryModal
import com.leveldeceit.game.viewmodel.GameViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: GameViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MainGameScreen(viewModel)
        }
    }
}

@Composable
fun MainGameScreen(viewModel: GameViewModel) {
    val textMeasurer = rememberTextMeasurer()

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFF0B0C13)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding(),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top Header Bar
            HeaderBar(
                levelId = viewModel.currentLevelId,
                totalLevels = 20,
                levelTitle = viewModel.currentLevel.title,
                deaths = viewModel.currentLevelDeaths,
                soundEnabled = viewModel.soundEnabled,
                onToggleSound = { viewModel.toggleSound() },
                onRestart = { viewModel.restartCurrentLevel() },
                onOpenLevelSelect = { viewModel.showLevelSelect = true },
                onSkipLevel = if (viewModel.currentLevelDeaths >= 4) { { viewModel.skipLevel() } } else null,
                onShowHint = { viewModel.showHintModal = true }
            )

            // Subtitle Tease Bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0x66000000))
                    .padding(vertical = 4.dp, horizontal = 12.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = viewModel.currentLevel.subtitle,
                    fontSize = 11.sp,
                    color = Color(0x80FFFFFF),
                    fontFamily = FontFamily.Monospace
                )
            }

            // Game Canvas Viewport
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                GameCanvasView(
                    engine = viewModel.gameEngine,
                    tick = viewModel.tickCounter,
                    textMeasurer = textMeasurer,
                    modifier = Modifier.fillMaxSize()
                )
            }

            // Mobile Touch Controls
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF0D0E19))
            ) {
                TouchControls(
                    onLeftChange = { viewModel.inputLeft = it },
                    onRightChange = { viewModel.inputRight = it },
                    onJumpChange = { viewModel.inputJump = it }
                )
            }
        }

        // Modals
        LevelSelectModal(
            isOpen = viewModel.showLevelSelect,
            onClose = { viewModel.showLevelSelect = false },
            levels = com.leveldeceit.game.repository.LevelRepository.LEVELS,
            currentLevelId = viewModel.currentLevelId,
            unlockedLevel = viewModel.unlockedLevel,
            deaths = viewModel.levelDeaths,
            onSelectLevel = { viewModel.selectLevel(it) },
            onResetProgress = { viewModel.resetAllProgress() }
        )

        VictoryModal(
            isOpen = viewModel.showVictoryModal,
            levelId = viewModel.currentLevelId,
            deathsThisLevel = viewModel.currentLevelDeaths,
            onNextLevel = { viewModel.nextLevel() },
            onReplay = {
                viewModel.showVictoryModal = false
                viewModel.restartCurrentLevel()
            }
        )

        GameCompleteModal(
            isOpen = viewModel.showGameComplete,
            totalDeaths = viewModel.totalDeaths,
            onRestartGame = { viewModel.resetAllProgress() },
            onOpenLevelSelect = {
                viewModel.showGameComplete = false
                viewModel.showLevelSelect = true
            }
        )

        HintModal(
            isOpen = viewModel.showHintModal,
            onClose = { viewModel.showHintModal = false },
            levelId = viewModel.currentLevelId,
            levelTitle = viewModel.currentLevel.title,
            hint = viewModel.currentLevel.hint,
            trollName = viewModel.currentLevel.trollName
        )
    }
}
