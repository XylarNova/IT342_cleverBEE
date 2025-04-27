package edu.cit.cleverbee.Service;

import edu.cit.cleverbee.Entity.Folder;
import edu.cit.cleverbee.Repository.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FolderService {

    @Autowired
    private FolderRepository folderRepository;

    // ✏️ Create Folder
    public Folder createFolder(Folder folder) {
        return folderRepository.save(folder);
    }

    // 🔍 Get All Folders for a User
    public List<Folder> getFoldersByUserId(Long userId) {
        return folderRepository.findByUserId(userId);
    }

    // ✏️ Update Folder Name
    public Folder updateFolderName(Long folderId, String newName) {
        Folder folder = folderRepository.findById(folderId)
            .orElseThrow(() -> new RuntimeException("Folder not found"));

        folder.setFolderName(newName);
        return folderRepository.save(folder);
    }

    // 🗑️ Delete Folder (+ auto delete files because of cascade)
    public void deleteFolder(Long folderId) {
        if (!folderRepository.existsById(folderId)) {
            throw new RuntimeException("Folder not found");
        }
        folderRepository.deleteById(folderId);  // Cascade delete files
    }
}
