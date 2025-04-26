package edu.cit.cleverbee.Controller;

import edu.cit.cleverbee.Entity.User;
import edu.cit.cleverbee.Repository.UserRepository;
import edu.cit.cleverbee.Service.UserService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String userEmail = authentication.getName(); // Extract email from JWT

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "username", user.getUsername(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "profilePic", user.getProfilePic() 
        ));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody User updatedUser, Authentication authentication) {
    String email = authentication.getName(); // From JWT
    userService.updateUser(updatedUser, email);
    return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
}

}
