package edu.cit.cleverbee.Service;

import edu.cit.cleverbee.Entity.User;
import edu.cit.cleverbee.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Default avatar if not set
        if (user.getProfilePic() == null || user.getProfilePic().isEmpty()) {
            user.setProfilePic("/avatar1.png");
        }

        return userRepository.save(user);
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }

    // ✅ New: Update existing user info
    public void updateUser(User updatedUser, String email) {
        User existingUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setProfilePic(updatedUser.getProfilePic());

        userRepository.save(existingUser);
    }
}
