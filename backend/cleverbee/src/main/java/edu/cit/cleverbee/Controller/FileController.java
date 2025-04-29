package edu.cit.cleverbee.Controller;

import edu.cit.cleverbee.Entity.File;
import edu.cit.cleverbee.Service.FileService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "https://cleverbee-frontend.vercel.app"
})
public class FileController {

    @Autowired
    private FileService fileService;

    @GetMapping
    public ResponseEntity<List<File>> getUserFiles(Authentication authentication) {
        String email = authentication.getName();
        List<File> files = fileService.getUserFiles(email);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/folder/{folderId}")
    public ResponseEntity<List<File>> getFilesByFolder(@PathVariable Long folderId, Authentication authentication) {
        String email = authentication.getName();
        System.out.println("🛠️ Loading files for email: " + email + " and folderId: " + folderId);
        
        List<File> files = fileService.getFilesByFolder(folderId, email);
        return ResponseEntity.ok(files);
    }
    

    // 📥 Upload File (real file content)
    @PostMapping("/upload")
    public ResponseEntity<File> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "annotation", required = false) String annotation,
            @RequestParam("folderId") Long folderId,
            Authentication authentication) throws IOException {

        String email = authentication.getName();
        File savedFile = fileService.saveUploadedFile(file, folderId, email, annotation);
        return ResponseEntity.ok(savedFile);
    }

    // 📤 Download/View File
    @GetMapping("/{fileId}/download")
    public void downloadFile(@PathVariable Long fileId, HttpServletResponse response, Authentication authentication) throws IOException {
        String email = authentication.getName();
        fileService.downloadFile(fileId, email, response);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId, Authentication authentication) {
        String email = authentication.getName();
        fileService.deleteFile(fileId, email);
        return ResponseEntity.ok("File deleted successfully!");
    }

    @PutMapping("/{fileId}/annotation")
    public ResponseEntity<File> updateAnnotation(
            @PathVariable Long fileId,
            @RequestParam String annotation,
            Authentication authentication) {
        String email = authentication.getName();
        File updatedFile = fileService.updateAnnotation(fileId, annotation, email);
        return ResponseEntity.ok(updatedFile);
    }
}
