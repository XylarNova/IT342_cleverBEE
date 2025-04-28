package edu.cit.cleverbee.Controller;

import edu.cit.cleverbee.Entity.Flashcard;
import edu.cit.cleverbee.Service.FlashcardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    // ✅ Get all flashcards of logged-in user
    @GetMapping
    public List<Flashcard> getUserFlashcards(Authentication authentication) {
        String userEmail = authentication.getName(); // Get email from JWT
        return flashcardService.getFlashcardsByUser(userEmail);
    }

    // ✅ Create multiple flashcards (bulk create)
    @PostMapping
    public List<Flashcard> createFlashcards(Authentication authentication,
                                            @RequestBody List<Flashcard> flashcards) {
        String userEmail = authentication.getName();
        return flashcardService.createFlashcards(userEmail, flashcards);
    }

    // ✅ Update one flashcard
    @PutMapping("/{id}")
    public Flashcard updateFlashcard(Authentication authentication,
                                     @PathVariable Long id,
                                     @RequestBody Flashcard flashcard) {
        String userEmail = authentication.getName();
        return flashcardService.updateFlashcard(id, userEmail, flashcard);
    }

    // ✅ Delete one flashcard
    @DeleteMapping("/{id}")
    public void deleteFlashcard(Authentication authentication,
                                @PathVariable Long id) {
        String userEmail = authentication.getName();
        flashcardService.deleteFlashcard(id, userEmail);
    }

    // ✅ Delete all flashcards under a topic
    @DeleteMapping("/category/{category}")
    public void deleteFlashcardsByCategory(Authentication authentication,
                                           @PathVariable String category) {
        String userEmail = authentication.getName();
        flashcardService.deleteFlashcardsByCategory(category, userEmail);
    }
}
