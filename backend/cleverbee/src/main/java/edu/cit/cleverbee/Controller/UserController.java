package edu.cit.cleverbee.Controller;

import edu.cit.cleverbee.Entity.User;
import edu.cit.cleverbee.Repository.UserRepository;
import edu.cit.cleverbee.Service.UserService;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "https://cleverbee-frontend.vercel.app"
})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // ✅ Enhanced: include sessionCount, streak, and last login date
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String userEmail = authentication.getName();

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "username", user.getUsername(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "profilePic", user.getProfilePic(),
            "sessionCount", user.getSessionCount(),
            "loginStreak", user.getLoginStreak(),
            "lastLoginDate", user.getLastLoginDate()
        ));
    }

    // ✅ Update profile info
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody User updatedUser, Authentication authentication) {
        String email = authentication.getName();
        userService.updateUser(updatedUser, email);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    // ✅ NEW: Increment study session count
    @PatchMapping("/increment-session")
    public ResponseEntity<?> incrementSession(Authentication authentication) {
        String email = authentication.getName();
        userService.incrementSessionCount(email);
        return ResponseEntity.ok(Map.of("message", "Session count updated"));
    }

    // ✅ NEW: Update login streak and date
    @PatchMapping("/update-streak")
    public ResponseEntity<?> updateStreak(Authentication authentication) {
        String email = authentication.getName();
        userService.updateLoginStreak(email);
        return ResponseEntity.ok(Map.of("message", "Streak updated"));
    }
}
