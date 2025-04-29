package edu.cit.cleverbee.Controller;

import edu.cit.cleverbee.Entity.Folder;
import edu.cit.cleverbee.Service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import edu.cit.cleverbee.Repository.UserRepository;


import java.util.List;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "https://cleverbee-frontend.vercel.app"
})
public class FolderController {

    @Autowired
    private FolderService folderService;

    @Autowired
    private UserRepository userRepository;

    // Create Folder
    @PostMapping
    public ResponseEntity<?> createFolder(@RequestBody Folder folder, Authentication authentication) {
        String email = authentication.getName();
        Long userId = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"))
            .getId();

        folder.setUser(
            userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"))
        );

        Folder savedFolder = folderService.createFolder(folder);
        return ResponseEntity.ok(savedFolder);
    }

    // Get All Folders for the Logged-in User
    @GetMapping
    public ResponseEntity<?> getFolders(Authentication authentication) {
        String email = authentication.getName();
        Long userId = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"))
            .getId();

        List<Folder> folders = folderService.getFoldersByUserId(userId);
        return ResponseEntity.ok(folders);
    }

    // Update Folder Name
    @PutMapping("/{folderId}")
    public ResponseEntity<?> updateFolderName(@PathVariable Long folderId, @RequestParam String newName) {
        Folder updatedFolder = folderService.updateFolderName(folderId, newName);
        return ResponseEntity.ok(updatedFolder);
    }

    // Delete Folder (with Cascade for files)
    @DeleteMapping("/{folderId}")
    public ResponseEntity<?> deleteFolder(@PathVariable Long folderId) {
        folderService.deleteFolder(folderId);
        return ResponseEntity.ok().build();
    }
}
