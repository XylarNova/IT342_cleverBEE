package edu.cit.cleverbee.Repository;

import edu.cit.cleverbee.Entity.StudyHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StudyHistoryRepository extends JpaRepository<StudyHistory, Long> {
    List<StudyHistory> findByUserId(String userId);

    List<StudyHistory> findBySubject(String subject);

    List<StudyHistory> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}