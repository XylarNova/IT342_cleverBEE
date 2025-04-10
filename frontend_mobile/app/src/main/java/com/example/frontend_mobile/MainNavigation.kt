package com.example.frontend_mobile

import android.content.Context
import android.content.SharedPreferences
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import kotlinx.coroutines.launch
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.runtime.remember

@Composable
fun MainNavigation(navController: NavHostController, context: Context) {
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
                    val interactionSource = remember { MutableInteractionSource() } // Initialize MutableInteractionSource
                    val isSelected = item.route == currentScreen
                    val bgColor = if (isSelected) Color.LightGray else Color.Transparent

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(bgColor)
                            .clickable(
                                interactionSource = interactionSource,
                                indication = null
                            ) {
                                currentScreen = item.route
                                navController.navigate(item.route)
                                scope.launch { drawerState.close() }
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
                        // Logout logic and navigate to login
                        val sharedPref: SharedPreferences = context.getSharedPreferences("user_pref", Context.MODE_PRIVATE)
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
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text("CleverBee") },
                    backgroundColor = Color(0xFFFFC107),
                    navigationIcon = {
                        IconButton(onClick = {
                            scope.launch { drawerState.open() }
                        }) {
                            Icon(Icons.Default.Menu, contentDescription = "Menu")
                        }
                    }
                )
            }
        ) { paddingValues ->
            Box(modifier = Modifier.padding(paddingValues)) {
                NavHost(navController = navController, startDestination = "dashboard") {
                    composable("dashboard") { DashboardScreen(navController) }
                    composable("tasks") { TasksScreen(navController) }
                    composable("schedule") { ScheduleScreen(navController) }
                    composable("studytools") { StudyToolsScreen(navController) }
                    composable("files") { FilesScreen(navController) }
                    composable("studymap") { StudyMapScreen(navController) }
                    composable("settings") { SettingsScreen(navController) }
                }
            }
        }
    }
}

data class NavItem(val label: String, val icon: androidx.compose.ui.graphics.vector.ImageVector, val route: String)
