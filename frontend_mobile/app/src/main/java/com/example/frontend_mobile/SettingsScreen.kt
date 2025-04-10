package com.example.frontend_mobile

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.example.frontend_mobile.R

@Composable
fun SettingsScreen(navController: NavHostController) {
    var selectedAvatar by remember { mutableStateOf(R.drawable.avatar1) } // default avatar

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Choose Your Avatar", style = MaterialTheme.typography.h6)

        Spacer(modifier = Modifier.height(16.dp))

        Image(
            painter = painterResource(id = selectedAvatar),
            contentDescription = "Selected Avatar",
            modifier = Modifier.size(100.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        LazyRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            items(5) { index ->
                val avatarId = when (index) {
                    0 -> R.drawable.avatar1
                    1 -> R.drawable.avatar2
                    2 -> R.drawable.avatar3
                    3 -> R.drawable.avatar4
                    4 -> R.drawable.avatar5
                    else -> R.drawable.avatar1
                }
                Image(
                    painter = painterResource(id = avatarId),
                    contentDescription = "Avatar $index",
                    modifier = Modifier
                        .size(64.dp)
                        .clickable {
                            selectedAvatar = avatarId
                        }
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(onClick = {
            // 🔐 Save selectedAvatar to DataStore or backend
            println("Selected avatar ID: $selectedAvatar")
        }) {
            Text("Save Avatar")
        }
    }
}
