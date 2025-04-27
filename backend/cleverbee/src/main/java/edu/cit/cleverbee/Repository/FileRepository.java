package edu.cit.cleverbee.Repository;

import edu.cit.cleverbee.Entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findByUserId(Long userId);

    List<File> findByFolderIdAndUserId(Long folderId, Long userId);
}
