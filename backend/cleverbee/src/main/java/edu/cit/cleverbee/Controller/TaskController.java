package edu.cit.cleverbee.Controller;

import edu.cit.cleverbee.Entity.Task;
import edu.cit.cleverbee.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task, @RequestHeader("Authorization") String token) {
        String email = "test@example.com";  // Dummy email for now
        Task newTask = taskService.createTask(task, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", "success", "data", newTask));
    }

    @GetMapping
    public ResponseEntity<?> getTasks(@RequestHeader("Authorization") String token) {
        String email = "test@example.com"; // Dummy email for now
        List<Task> tasks = taskService.getUserTasks(email);
        return ResponseEntity.ok(Map.of("status", "success", "data", tasks));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @RequestBody Task task) {
        Task updatedTask = taskService.updateTask(taskId, task);
        return ResponseEntity.ok(Map.of("status", "success", "data", updatedTask));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
