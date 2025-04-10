package com.example.frontend_mobile

import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import kotlinx.coroutines.delay
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import android.content.Context
import android.content.SharedPreferences


@Composable
fun SplashScreen(navController: NavHostController) {
    val context = LocalContext.current
    val isLoggedIn = isUserLoggedIn(context) // Check if user is logged in

    // Pulse animation for logo
    val infiniteTransition = rememberInfiniteTransition(label = "Pulse")
    val scale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.1f,
        animationSpec = infiniteRepeatable(
            tween(700),
            RepeatMode.Reverse
        ),
        label = "Pulse"
    )

    // Show bees one by one and then navigate based on login status
    LaunchedEffect(Unit) {
        delay(800)
        if (isLoggedIn) {
            navController.navigate("main") { // Navigate to dashboard if logged in
                popUpTo("splash_after_auth") { inclusive = true }
            }
        } else {
            navController.navigate("login") { // Navigate to login if not logged in
                popUpTo("splash_after_auth") { inclusive = true }
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFFB703)),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Image(
            painter = painterResource(id = R.drawable.cleverbee_logo),
            contentDescription = "CleverBee Logo",
            modifier = Modifier
                .size(150.dp)
                .graphicsLayer { scaleX = scale; scaleY = scale }
        )

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            repeat(5) {
                Image(
                    painter = painterResource(id = R.drawable.bee_icon),
                    contentDescription = "Loading Bee",
                    modifier = Modifier
                        .size(32.dp)
                        .padding(horizontal = 4.dp)
                )
            }
        }

        // Optionally show some text or branding info
        Spacer(modifier = Modifier.height(24.dp))
        Text("Welcome to CleverBee", color = Color.White)
    }
}

fun isUserLoggedIn(context: Context): Boolean {
    val sharedPreferences = context.getSharedPreferences("user_pref", Context.MODE_PRIVATE)
    return sharedPreferences.getBoolean("is_logged_in", false)
}
