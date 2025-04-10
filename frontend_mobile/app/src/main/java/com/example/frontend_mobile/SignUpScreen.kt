package com.example.frontend_mobile

import android.widget.Toast
import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
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
fun SignUpScreen(navController: NavHostController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var username by remember { mutableStateOf("") }
    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    val infiniteTransition = rememberInfiniteTransition(label = "BeeAnimations")

    val pulse by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000),
            repeatMode = RepeatMode.Reverse
        ),
        label = "LogoPulse"
    )

    val offsetX by infiniteTransition.animateFloat(
        initialValue = -8f,
        targetValue = 8f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000),
            repeatMode = RepeatMode.Reverse
        ),
        label = "BeeFloat"
    )

    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFFB703))
            .verticalScroll(scrollState),
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
                modifier = Modifier
                    .size(32.dp)
                    .offset(x = offsetX.dp)
            )
            Image(
                painter = painterResource(id = R.drawable.bee_icon),
                contentDescription = "Right Bee",
                modifier = Modifier
                    .size(32.dp)
                    .offset(x = -offsetX.dp)
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Image(
            painter = painterResource(id = R.drawable.cleverbee_logo),
            contentDescription = "CleverBee Logo",
            modifier = Modifier
                .size(120.dp)
                .graphicsLayer {
                    scaleX = pulse
                    scaleY = pulse
                }
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
            Text("Sign Up", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF7B3F00))
            Text("Join the hive today! 🐝", fontSize = 14.sp, color = Color.Gray)
            Spacer(modifier = Modifier.height(16.dp))

            CustomTextField("Username", username) { username = it }
            Spacer(modifier = Modifier.height(8.dp))
            CustomTextField("Full Name", fullName) { fullName = it }
            Spacer(modifier = Modifier.height(8.dp))
            CustomTextField("Email", email, KeyboardType.Email) { email = it }
            Spacer(modifier = Modifier.height(8.dp))
            CustomPasswordField("Password", password) { password = it }
            Spacer(modifier = Modifier.height(8.dp))
            CustomPasswordField("Confirm Password", confirmPassword) { confirmPassword = it }

            Spacer(modifier = Modifier.height(16.dp))



            Button(
                onClick = {
                    if (password != confirmPassword) {
                        Toast.makeText(context, "Passwords do not match", Toast.LENGTH_SHORT).show()
                    } else {
                        scope.launch {
                            try {
                                val response = RetrofitClient.instance.register(
                                    RegisterRequest(
                                        username = username,
                                        fullName = fullName,
                                        email = email,
                                        password = password
                                    )
                                )
                                if (response.isSuccessful && response.body()?.status == "success") {
                                    // Save login status to SharedPreferences
                                    val sharedPref: SharedPreferences = context.getSharedPreferences("user_pref", Context.MODE_PRIVATE)
                                    val editor = sharedPref.edit()
                                    editor.putBoolean("is_logged_in", true) // Mark user as logged in
                                    editor.apply()

                                    // Show success message
                                    Toast.makeText(context, "Registered Successfully!", Toast.LENGTH_SHORT).show()

                                    // Navigate to the main screen (dashboard)
                                    navController.navigate("dashboard") {
                                        // Pop the sign-up screen from the back stack
                                        popUpTo("signup") { inclusive = true }
                                    }
                                } else {
                                    Toast.makeText(context, "Error: ${response.body()?.message ?: "Unknown error"}", Toast.LENGTH_SHORT).show()
                                }
                            } catch (e: Exception) {
                                Toast.makeText(context, "Network error: ${e.message}", Toast.LENGTH_SHORT).show()
                            }
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(backgroundColor = Color(0xFFFFC107))
            ) {
                Text("Sign Up", color = Color.White)
            }



            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Already have an account? Log in",
                color = Color(0xFFFB8500),
                modifier = Modifier
                    .clickable { navController.navigate("login") }
                    .padding(bottom = 12.dp)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
fun CustomTextField(
    label: String,
    value: String,
    keyboardType: KeyboardType = KeyboardType.Text,
    onValueChange: (String) -> Unit
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, fontWeight = FontWeight.Bold) },
        modifier = Modifier.fillMaxWidth(),
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        textStyle = TextStyle.Default.copy(fontSize = 14.sp),
        colors = TextFieldDefaults.outlinedTextFieldColors(
            focusedBorderColor = Color(0xFFFFC107),
            cursorColor = Color(0xFFFFC107)
        )
    )
}

@Composable
fun CustomPasswordField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, fontWeight = FontWeight.Bold) },
        modifier = Modifier.fillMaxWidth(),
        visualTransformation = PasswordVisualTransformation(),
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
        textStyle = TextStyle.Default.copy(fontSize = 14.sp),
        colors = TextFieldDefaults.outlinedTextFieldColors(
            focusedBorderColor = Color(0xFFFFC107),
            cursorColor = Color(0xFFFFC107)
        )
    )
}
