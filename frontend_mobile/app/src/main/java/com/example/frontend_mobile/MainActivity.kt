package com.example.frontend_mobile

import android.os.Bundle
import android.content.Context
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.navigation.compose.rememberNavController
import com.example.frontend_mobile.ui.theme.Frontend_mobileTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Frontend_mobileTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    MainApp(this)
                }
            }
        }
    }
}

@Composable
fun MainApp(context: Context) {
    val navController = rememberNavController()
    AppNavigation(navController, context) // Pass context
}
