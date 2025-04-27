package edu.cit.cleverbee.Service;

import edu.cit.cleverbee.Entity.PomodoroSession;
import edu.cit.cleverbee.Entity.User;
import edu.cit.cleverbee.Repository.PomodoroSessionRepository;
import edu.cit.cleverbee.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PomodoroSessionService {

    @Autowired
    private PomodoroSessionRepository pomodoroSessionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PomodoroSession> getSessionsForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return pomodoroSessionRepository.findByUser(user);
    }

    public PomodoroSession createSession(String email, PomodoroSession session) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        session.setUser(user); // ✅ Force assign the user

        if (session.getStatus() == null || session.getStatus().isBlank()) {
            session.setStatus("Ongoing"); // Default status if missing
        }

        return pomodoroSessionRepository.save(session);
    }

    public PomodoroSession updateSession(String email, Long sessionId, PomodoroSession updatedSession) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PomodoroSession existingSession = pomodoroSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!existingSession.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (updatedSession.getTitle() != null) {
            existingSession.setTitle(updatedSession.getTitle());
        }
        if (updatedSession.getMode() != null) {
            existingSession.setMode(updatedSession.getMode());
        }
        if (updatedSession.getStatus() != null) {
            existingSession.setStatus(updatedSession.getStatus());
        }
        if (updatedSession.getSessionsBeforeLongBreak() > 0) {
            existingSession.setSessionsBeforeLongBreak(updatedSession.getSessionsBeforeLongBreak());
        }

        return pomodoroSessionRepository.save(existingSession);
    }

    public void deleteSession(String email, Long sessionId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PomodoroSession session = pomodoroSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        pomodoroSessionRepository.delete(session);
    }
}
