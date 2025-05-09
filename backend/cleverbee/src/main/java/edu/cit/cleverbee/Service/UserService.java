package edu.cit.cleverbee.Service;

import edu.cit.cleverbee.Entity.User;
import edu.cit.cleverbee.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
    
        if (user.getProfilePic() == null || user.getProfilePic().isEmpty()) {
            user.setProfilePic("/avatar1.png");
        }
    
        // ✅ Set these fields to prevent null errors
        user.setLoginStreak(1);
        user.setSessionCount(0);
        user.setLastLoginDate(LocalDate.now());
    
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

    // 🔁 Increment session count
    public void incrementSessionCount(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setSessionCount(user.getSessionCount() + 1);
        userRepository.save(user);
    }

// 🔥 Update login streak and last login date
        public void updateLoginStreak(String email) {
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            LocalDate today = LocalDate.now();
            LocalDate lastLogin = user.getLastLoginDate();

            if (lastLogin == null || lastLogin.isBefore(today.minusDays(1))) {
                // Missed a day or first login, reset streak
                user.setLoginStreak(1);
            } else if (lastLogin.equals(today.minusDays(1))) {
                // Continued streak
                user.setLoginStreak(user.getLoginStreak() + 1);
            }

            user.setLastLoginDate(today);
            userRepository.save(user);
        }

}
