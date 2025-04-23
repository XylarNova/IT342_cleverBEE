package edu.cit.cleverbee.Repository;

import edu.cit.cleverbee.Entity.Task;
import edu.cit.cleverbee.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Get all tasks of a user
    List<Task> findByUser(User user);

    // Optional: Get all tasks of a user filtered by priority
    List<Task> findByUserAndPriority(User user, String priority);

    // Optional: Get tasks sorted by start date
    List<Task> findByUserOrderByStartDateAsc(User user);

    // Optional: Get tasks sorted by end date
    List<Task> findByUserOrderByEndDateAsc(User user);
}
