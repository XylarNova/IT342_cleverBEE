package edu.cit.cleverbee.Repository;

import edu.cit.cleverbee.Entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByUserId(String userId);
    List<Flashcard> findByCategoryAndUserId(String category, String userId);
}
