package edu.cit.cleverbee.Controller;

import edu.cit.cleverbee.Entity.User;
import edu.cit.cleverbee.Service.UserService;
import edu.cit.cleverbee.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "https://cleverbee-frontend.vercel.app"
})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (user.getPassword() == null) {
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Password is required"));
            }
            userService.registerUser(user);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            String token = jwtUtil.generateToken(userDetails.getUsername());

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Login successful",
                "token", token
            ));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of(
                "status", "error",
                "message", "Invalid credentials"
            ));
        }
    }
}
