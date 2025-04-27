package edu.cit.cleverbee.Controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
@CrossOrigin(origins = "http://localhost:5173")
public class FileServeController {

    private final Path uploadDirectory = Paths.get("uploads");

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws IOException {
        Path file = uploadDirectory.resolve(filename);
        Resource resource = new UrlResource(file.toUri());

        if (resource.exists() || resource.isReadable()) {
            // Detect the correct content type
            String contentType = Files.probeContentType(file);
            if (contentType == null) {
                contentType = "application/octet-stream"; // Fallback
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, contentType) // <-- THIS makes PDF open properly
                    .body(resource);
        } else {
            throw new RuntimeException("Could not read file: " + filename);
        }
    }
}
