package com.leveldeceit.game.ui.modals

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.leveldeceit.game.model.LevelDefinition

@Composable
fun LevelSelectModal(
    isOpen: Boolean,
    onClose: () -> Unit,
    levels: List<LevelDefinition>,
    currentLevelId: Int,
    unlockedLevel: Int,
    deaths: Map<Int, Int>,
    onSelectLevel: (Int) -> Unit,
    onResetProgress: () -> Unit
) {
    if (!isOpen) return

    Dialog(onDismissRequest = onClose) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = RoundedCornerShape(16.dp),
            color = Color(0xFF131524),
            tonalElevation = 8.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "SELECT LEVEL",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                Spacer(modifier = Modifier.height(16.dp))

                LazyVerticalGrid(
                    columns = GridCells.Fixed(4),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.height(280.dp)
                ) {
                    items(levels) { lvl ->
                        val isUnlocked = lvl.id <= unlockedLevel
                        val isCurrent = lvl.id == currentLevelId
                        val lvlDeaths = deaths[lvl.id] ?: 0

                        val bgColor = when {
                            isCurrent -> Color(0xFF38BDF8)
                            isUnlocked -> Color(0xFF1E2235)
                            else -> Color(0xFF0F111A)
                        }

                        val textColor = when {
                            isCurrent -> Color.Black
                            isUnlocked -> Color.White
                            else -> Color(0xFF4B5563)
                        }

                        Box(
                            modifier = Modifier
                                .aspectRatio(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(bgColor)
                                .border(
                                    width = 1.dp,
                                    color = if (isCurrent) Color.White else if (isUnlocked) Color(0xFF333B5C) else Color.Transparent,
                                    shape = RoundedCornerShape(8.dp)
                                )
                                .clickable(enabled = isUnlocked) { onSelectLevel(lvl.id) },
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = if (isUnlocked) "${lvl.id}" else "🔒",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = textColor
                                )
                                if (isUnlocked && lvlDeaths > 0) {
                                    Text(
                                        text = "💀$lvlDeaths",
                                        fontSize = 10.sp,
                                        color = if (isCurrent) Color(0xFF991B1B) else Color(0xFFF43F5E)
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Button(
                        onClick = onResetProgress,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF991B1B))
                    ) {
                        Text("Reset All", fontSize = 12.sp)
                    }

                    Button(
                        onClick = onClose,
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF38BDF8))
                    ) {
                        Text("Close", fontSize = 12.sp, color = Color.Black)
                    }
                }
            }
        }
    }
}
