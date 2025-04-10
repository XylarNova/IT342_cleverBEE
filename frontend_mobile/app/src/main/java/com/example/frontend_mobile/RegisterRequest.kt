package com.example.frontend_mobile

data class RegisterRequest(
    val username: String,
    val fullName: String,
    val email: String,
    val password: String
)