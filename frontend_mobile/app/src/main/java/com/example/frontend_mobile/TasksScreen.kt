package com.example.frontend_mobile

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Add
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController

@Composable
fun TasksScreen(navController: NavHostController) {
    val tasks = remember {
        mutableStateListOf(
            "Project Development 20%",
            "Storage Space Management",
            "TCD"
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Card(
            shape = RoundedCornerShape(16.dp),
            backgroundColor = Color.White,
            elevation = 4.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_checklist),
                        contentDescription = null,
                        tint = Color(0xFFFFB703)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("My Task", fontSize = 18.sp, fontWeight = FontWeight.Bold)

                    Spacer(modifier = Modifier.weight(1f))

                    IconButton(
                        onClick = {
                            // Handle adding new task
                        },
                        modifier = Modifier
                            .size(32.dp)
                            .background(Color(0xFFFFB703), CircleShape)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Add", tint = Color.White)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                LazyColumn {
                    items(tasks.size) { index ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                        ) {
                            Checkbox(
                                checked = false,
                                onCheckedChange = { /* toggle logic */ },
                                colors = CheckboxDefaults.colors(checkedColor = Color(0xFFFFB703))
                            )
                            Text(
                                text = tasks[index],
                                modifier = Modifier.weight(1f)
                            )
                            IconButton(onClick = {
                                // Handle edit
                            }) {
                                Icon(Icons.Default.Edit, contentDescription = "Edit")
                            }
                            IconButton(onClick = {
                                tasks.removeAt(index)
                            }) {
                                Icon(Icons.Default.Delete, contentDescription = "Delete")
                            }
                        }
                    }
                }
            }
        }
    }
}
