package edu.cit.cleverbee.Repository;

import edu.cit.cleverbee.Entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByUserId(String userId);

    List<Quiz> findByTitleContaining(String keyword);
}