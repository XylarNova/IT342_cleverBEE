package com.example.frontend_mobile

import android.widget.Toast
import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import kotlinx.coroutines.launch
import android.content.Context
import android.content.SharedPreferences


@Composable
fun LoginScreen(navController: NavHostController) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    val infiniteTransition = rememberInfiniteTransition(label = "BeeAnimations")
    val pulse by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(tween(1000), RepeatMode.Reverse),
        label = "LogoPulse"
    )
    val offsetX by infiniteTransition.animateFloat(
        initialValue = -8f,
        targetValue = 8f,
        animationSpec = infiniteRepeatable(tween(1000), RepeatMode.Reverse),
        label = "BeeFloat"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFFB703)),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(32.dp))
        Row(
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 60.dp)
        ) {
            Image(
                painter = painterResource(id = R.drawable.bee_icon),
                contentDescription = "Left Bee",
                modifier = Modifier.size(22.dp).offset(x = offsetX.dp)
            )
            Image(
                painter = painterResource(id = R.drawable.bee_icon),
                contentDescription = "Right Bee",
                modifier = Modifier.size(22.dp).offset(x = -offsetX.dp)
            )
        }

        Spacer(modifier = Modifier.height(8.dp))
        Image(
            painter = painterResource(id = R.drawable.cleverbee_logo),
            contentDescription = "Logo",
            modifier = Modifier
                .size(135.dp)
                .graphicsLayer { scaleX = pulse; scaleY = pulse }
        )

        Text("CleverBee", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(16.dp))

        Column(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .background(Color.White, shape = RoundedCornerShape(24.dp))
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("Log in", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF7B3F00))
            Text("Buzz into something amazing! 🐝", fontSize = 14.sp, color = Color.Gray)
            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email") },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                colors = TextFieldDefaults.outlinedTextFieldColors(
                    focusedBorderColor = Color(0xFFFFC107),
                    cursorColor = Color(0xFFFFC107)
                )
            )

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                modifier = Modifier.fillMaxWidth(),
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                colors = TextFieldDefaults.outlinedTextFieldColors(
                    focusedBorderColor = Color(0xFFFFC107),
                    cursorColor = Color(0xFFFFC107)
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = {
                    scope.launch {
                        try {
                            // Attempt login with Retrofit
                            val response = RetrofitClient.instance.login(LoginRequest(email, password))

                            // If login is successful
                            if (response.isSuccessful && response.body()?.status == "success") {
                                // Save login status to SharedPreferences
                                val sharedPref: SharedPreferences = context.getSharedPreferences("user_pref", Context.MODE_PRIVATE)
                                val editor = sharedPref.edit()
                                editor.putBoolean("is_logged_in", true) // Mark user as logged in
                                editor.apply()

                                // Show success message
                                Toast.makeText(context, "Login successful!", Toast.LENGTH_SHORT).show()

                                // Navigate to the dashboard directly
                                navController.navigate("dashboard") {
                                    // Pop the login screen from the back stack so the user can't go back to it
                                    popUpTo("login") { inclusive = true }
                                    launchSingleTop = true // Avoid duplicating the screen in the back stack
                                }
                            } else {
                                // Handle error
                                val errorMsg = response.body()?.message ?: "Invalid credentials"
                                Toast.makeText(context, "Login failed: $errorMsg", Toast.LENGTH_LONG).show()
                            }
                        } catch (e: Exception) {
                            // Handle network error
                            Toast.makeText(context, "Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(backgroundColor = Color(0xFFFFC107))
            ) {
                Text("Log in", color = Color.White)
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Don’t have an account? Sign up",
                color = Color(0xFFFB8500),
                modifier = Modifier.clickable {
                    navController.navigate("signup")
                }
            )
        }
    }
}