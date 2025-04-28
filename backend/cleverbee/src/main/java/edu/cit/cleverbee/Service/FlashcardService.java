package edu.cit.cleverbee.Service;

import edu.cit.cleverbee.Entity.Flashcard;
import edu.cit.cleverbee.Repository.FlashcardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;

    // ✅ Get all flashcards belonging to a user
    public List<Flashcard> getFlashcardsByUser(String userId) {
        return flashcardRepository.findByUserId(userId);
    }

    // ✅ Create multiple flashcards (bulk)
    public List<Flashcard> createFlashcards(String userId, List<Flashcard> flashcards) {
        for (Flashcard flashcard : flashcards) {
            flashcard.setUserId(userId);
        }
        return flashcardRepository.saveAll(flashcards);
    }

    // ✅ Update a specific flashcard (Edit Question/Answer/Category)
    public Flashcard updateFlashcard(Long id, String userId, Flashcard updatedFlashcard) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));

        if (!flashcard.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this flashcard.");
        }

        flashcard.setQuestion(updatedFlashcard.getQuestion());
        flashcard.setAnswer(updatedFlashcard.getAnswer());
        flashcard.setCategory(updatedFlashcard.getCategory());
        flashcard.setTags(updatedFlashcard.getTags());

        return flashcardRepository.save(flashcard);
    }

    // ✅ Delete one flashcard (individual)
    public void deleteFlashcard(Long id, String userId) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));

        if (!flashcard.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this flashcard.");
        }

        flashcardRepository.delete(flashcard);
    }

    // ✅ Delete all flashcards under a category (delete topic)
    public void deleteFlashcardsByCategory(String category, String userId) {
        List<Flashcard> flashcards = flashcardRepository.findByCategoryAndUserId(category, userId);
        flashcardRepository.deleteAll(flashcards);
    }
}
