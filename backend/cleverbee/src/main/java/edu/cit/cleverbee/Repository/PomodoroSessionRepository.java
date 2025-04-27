package edu.cit.cleverbee.Repository;

import edu.cit.cleverbee.Entity.PomodoroSession;
import edu.cit.cleverbee.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PomodoroSessionRepository extends JpaRepository<PomodoroSession, Long> {
    List<PomodoroSession> findByUser(User user); // Find sessions owned by a specific user
}
