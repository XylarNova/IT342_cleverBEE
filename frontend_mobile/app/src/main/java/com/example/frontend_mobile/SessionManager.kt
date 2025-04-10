package com.example.frontend_mobile

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {

    private val sharedPreferences: SharedPreferences =
        context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE)

    // Save the login status (true for logged in, false for logged out)
    fun setLoginStatus(isLoggedIn: Boolean) {
        val editor = sharedPreferences.edit()
        editor.putBoolean("IS_LOGGED_IN", isLoggedIn)
        editor.apply()
    }

    // Retrieve the login status
    fun getLoginStatus(): Boolean {
        return sharedPreferences.getBoolean("IS_LOGGED_IN", false)
    }

    // Clear the session data (e.g., when logging out)
    fun clearSession() {
        val editor = sharedPreferences.edit()
        editor.clear()
        editor.apply()
    }
}
