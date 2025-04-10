package com.example.frontend_mobile

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController

@Composable
fun StudyMapScreen(navController: NavHostController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Image(
            painter = painterResource(id = R.drawable.colony),
            contentDescription = "Bee Colony",
            modifier = Modifier.size(200.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Study Map is coming soon!",
            fontSize = 20.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Our bee colony is currently building this feature for you.\nThis will be available in the next increments.\n\uD83D\uDC1D Happy buzzing!",
            fontSize = 14.sp
        )
    }
}
