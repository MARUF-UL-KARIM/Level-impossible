package com.leveldeceit.game.storage

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONObject

class SaveManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("level_deceit_save_v1", Context.MODE_PRIVATE)

    var unlockedLevel: Int
        get() = prefs.getInt("unlockedLevel", 1).coerceIn(1, 20)
        set(value) = prefs.edit().putInt("unlockedLevel", value.coerceIn(1, 20)).apply()

    var currentLevelId: Int
        get() = prefs.getInt("currentLevelId", 1).coerceIn(1, 20)
        set(value) = prefs.edit().putInt("currentLevelId", value.coerceIn(1, 20)).apply()

    var soundEnabled: Boolean
        get() = prefs.getBoolean("soundEnabled", true)
        set(value) = prefs.edit().putBoolean("soundEnabled", value).apply()

    var hapticsEnabled: Boolean
        get() = prefs.getBoolean("hapticsEnabled", true)
        set(value) = prefs.edit().putBoolean("hapticsEnabled", value).apply()

    fun getLevelDeaths(): Map<Int, Int> {
        val jsonString = prefs.getString("levelDeaths", "{}") ?: "{}"
        val map = mutableMapOf<Int, Int>()
        try {
            val json = JSONObject(jsonString)
            val keys = json.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                map[key.toInt()] = json.getInt(key)
            }
        } catch (_: Exception) {}
        return map
    }

    fun saveLevelDeaths(map: Map<Int, Int>) {
        val json = JSONObject()
        map.forEach { (k, v) -> json.put(k.toString(), v) }
        prefs.edit().putString("levelDeaths", json.toString()).apply()
    }

    fun saveProgress(unlocked: Int, currentId: Int, deaths: Map<Int, Int>) {
        unlockedLevel = unlocked
        currentLevelId = currentId
        saveLevelDeaths(deaths)
    }

    fun clearAll() {
        prefs.edit().clear().apply()
    }
}
