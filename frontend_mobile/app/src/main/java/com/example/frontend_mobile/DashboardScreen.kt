package com.example.frontend_mobile

import android.content.Context
import android.content.SharedPreferences
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import kotlinx.coroutines.launch
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.runtime.remember

@Composable
fun DashboardScreen(navController: NavHostController) {
    // Temp placeholder values
    val username = "User"
    val avatarId = R.drawable.avatar1

    val infiniteTransition = rememberInfiniteTransition(label = "BeeAnimations")
    val logoPulse by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000),
            repeatMode = RepeatMode.Reverse
        ),
        label = "PulseLogo"
    )

    // Set up the side menu navigation (MainNavigation)
    val drawerState = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    val drawerItems = listOf(
        NavItem("Dashboard", Icons.Default.Dashboard, "dashboard"),
        NavItem("Tasks", Icons.Default.List, "tasks"),
        NavItem("Schedule", Icons.Default.DateRange, "schedule"),
        NavItem("Study Tools", Icons.Default.Lightbulb, "studytools"),
        NavItem("Files", Icons.Default.Folder, "files"),
        NavItem("Study Map", Icons.Default.Map, "studymap"),
        NavItem("Settings", Icons.Default.Settings, "settings")
    )

    var currentScreen by remember { mutableStateOf("dashboard") }

    ModalDrawer(
        drawerState = drawerState,
        drawerContent = {
            Column(modifier = Modifier.background(Color(0xFFFFB703))) {
                drawerItems.forEach { item ->
                    val isSelected = item.route == currentScreen
                    val bgColor = if (isSelected) Color.LightGray else Color.Transparent

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(bgColor)
                            .clickable {
                                currentScreen = item.route
                                navController.navigate(item.route)
                                scope.launch { drawerState.close() } // Fix: call within coroutine
                            }
                            .padding(16.dp)
                    ) {
                        Icon(item.icon, contentDescription = item.label, tint = Color.Black)
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(item.label, color = Color.Black)
                    }
                }

                Spacer(modifier = Modifier.weight(1f))

                Button(
                    onClick = {
                        // Logout logic
                        val sharedPref: SharedPreferences = navController.context.getSharedPreferences("user_pref", Context.MODE_PRIVATE)
                        val editor = sharedPref.edit()
                        editor.putBoolean("is_logged_in", false) // Mark user as logged out
                        editor.apply()

                        navController.navigate("login") {
                            popUpTo("dashboard") { inclusive = true }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(backgroundColor = Color.Red),
                    modifier = Modifier
                        .padding(16.dp)
                        .fillMaxWidth()
                ) {
                    Icon(Icons.Default.ExitToApp, contentDescription = "Logout", tint = Color.White)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Logout", color = Color.White)
                }
            }
        }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFFFF8E1)) // soft yellow background
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(12.dp))

            // 🐝 Animated Logo
            Image(
                painter = painterResource(id = R.drawable.cleverbee_logo),
                contentDescription = "CleverBee Logo",
                modifier = Modifier
                    .size(100.dp)
                    .graphicsLayer {
                        scaleX = logoPulse
                        scaleY = logoPulse
                    }
            )

            Spacer(modifier = Modifier.height(12.dp))

            // 👤 Avatar + Greeting
            Row(verticalAlignment = Alignment.CenterVertically) {
                Image(
                    painter = painterResource(id = avatarId),
                    contentDescription = "User Avatar",
                    modifier = Modifier.size(64.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(
                        text = "Hi $username!",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF7B3F00)
                    )
                    Text(
                        text = "Let’s make today un-bee-lievably productive!",
                        fontSize = 14.sp,
                        color = Color.Gray
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 📅 Calendar Section (Placeholder)
            Text(
                text = "Your Calendar",
                style = MaterialTheme.typography.h6,
                modifier = Modifier.align(Alignment.Start)
            )
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(250.dp)
                    .background(Color.White, shape = MaterialTheme.shapes.medium)
                    .padding(16.dp)
            ) {
                Text("Calendar placeholder 🗓️", color = Color.LightGray)
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 🧠 Coming features (Progress tracker, tasks, etc.)
            Text(
                text = "Upcoming Tasks and Study Goals (coming soon!)",
                modifier = Modifier.padding(top = 16.dp),
                color = Color.Gray
            )
        }
    }
}
