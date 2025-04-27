package edu.cit.cleverbee.Service;

import edu.cit.cleverbee.Entity.File;
import edu.cit.cleverbee.Entity.Folder;
import edu.cit.cleverbee.Entity.User;
import edu.cit.cleverbee.Repository.FileRepository;
import edu.cit.cleverbee.Repository.FolderRepository;
import edu.cit.cleverbee.Repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class FileService {

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private FolderRepository folderRepository;

    @Autowired
    private UserRepository userRepository;

    public FileService() {
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload folder!", ex);
        }
    }

    public List<File> getUserFiles(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return fileRepository.findByUserId(user.getId());
    }

    public List<File> getFilesByFolder(Long folderId, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return fileRepository.findByFolderIdAndUserId(folderId, user.getId());
    }

    public File createFile(File file, Long folderId, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        file.setUserId(user.getId());

        if (folderId != null) {
            Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
            file.setFolder(folder);
        }

        return fileRepository.save(file);
    }

    public File saveUploadedFile(MultipartFile multipartFile, Long folderId, String email, String annotation) throws IOException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    
        // Validate file type
        String contentType = multipartFile.getContentType();
        if (contentType == null || 
            !(contentType.equals("application/pdf") ||
              contentType.equals("application/msword") ||
              contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") || // for .docx
              contentType.equals("text/plain"))) { // for .txt
            throw new RuntimeException("Only PDF, DOCX, or TXT files are allowed!");
        }
    
        String originalFileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        String fileName = System.currentTimeMillis() + "_" + originalFileName;
    
        Path targetLocation = fileStorageLocation.resolve(fileName);
        Files.copy(multipartFile.getInputStream(), targetLocation);
    
        File file = new File();
        file.setFileName(fileName);
        file.setFileType(contentType);
        file.setAnnotation(annotation);
        file.setUserId(user.getId());
    
        if (folderId != null) {
            Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
            file.setFolder(folder);
        }
    
        return fileRepository.save(file);
    }
    

    public void downloadFile(Long fileId, String email, HttpServletResponse response) throws IOException {
        File file = fileRepository.findById(fileId)
            .orElseThrow(() -> new RuntimeException("File not found"));

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!file.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to file");
        }

        Path filePath = fileStorageLocation.resolve(file.getFileName()).normalize();
        java.io.File fileToDownload = filePath.toFile();

        if (!fileToDownload.exists()) {
            throw new RuntimeException("File not found on server");
        }

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + file.getFileName() + "\"");

        Files.copy(filePath, response.getOutputStream());
        response.getOutputStream().flush();
    }

    public void deleteFile(Long fileId, String email) {
        File file = fileRepository.findById(fileId)
            .orElseThrow(() -> new RuntimeException("File not found"));

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!file.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this file");
        }

        Path filePath = fileStorageLocation.resolve(file.getFileName()).normalize();
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from server", e);
        }

        fileRepository.delete(file);
    }

    public File updateAnnotation(Long fileId, String annotation, String email) {
        File file = fileRepository.findById(fileId)
            .orElseThrow(() -> new RuntimeException("File not found"));

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!file.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access: You do not own this file.");
        }

        file.setAnnotation(annotation);
        return fileRepository.save(file);
    }
}
