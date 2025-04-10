package com.example.frontend_mobile

// Import SharedPreferences and Context
import android.content.Context
import android.content.SharedPreferences
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable

@Composable
fun AppNavigation(navController: NavHostController, context: Context) {
    // Check if the user is logged in
    val isLoggedIn = getUserLoginStatus(context)

    // Start navigation flow based on login status
    NavHost(navController = navController, startDestination = if (isLoggedIn) "dashboard" else "login") {
        composable("login") { LoginScreen(navController) }
        composable("signup") { SignUpScreen(navController) }
        composable("dashboard") { DashboardScreen(navController) }
    }
}

// Function to check if the user is logged in from SharedPreferences
fun getUserLoginStatus(context: Context): Boolean {
    val sharedPref: SharedPreferences = context.getSharedPreferences("user_pref", Context.MODE_PRIVATE)
    return sharedPref.getBoolean("is_logged_in", false)  // This checks if the user is logged in
}
