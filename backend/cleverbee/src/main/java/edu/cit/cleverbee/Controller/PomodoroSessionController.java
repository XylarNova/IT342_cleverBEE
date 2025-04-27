package edu.cit.cleverbee.Controller;

import edu.cit.cleverbee.Entity.PomodoroSession;
import edu.cit.cleverbee.Service.PomodoroSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pomodoro")
@CrossOrigin(origins = "http://localhost:5173")
public class PomodoroSessionController {

    @Autowired
    private PomodoroSessionService pomodoroSessionService;

    @GetMapping("/sessions")
    public ResponseEntity<List<PomodoroSession>> getAllSessions(Authentication authentication) {
        String email = authentication.getName();
        List<PomodoroSession> sessions = pomodoroSessionService.getSessionsForUser(email);
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/sessions")
    public ResponseEntity<PomodoroSession> createSession(@RequestBody PomodoroSession session, Authentication authentication) {
        String email = authentication.getName();
        PomodoroSession created = pomodoroSessionService.createSession(email, session);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/sessions/{id}")
    public ResponseEntity<PomodoroSession> updateSession(@PathVariable Long id, @RequestBody PomodoroSession session, Authentication authentication) {
        String email = authentication.getName();
        PomodoroSession updated = pomodoroSessionService.updateSession(email, id, session);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<String> deleteSession(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        pomodoroSessionService.deleteSession(email, id);
        return ResponseEntity.ok("Session deleted successfully");
    }
}
