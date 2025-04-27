package edu.cit.cleverbee.Repository;

import edu.cit.cleverbee.Entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByUserId(Long userId);
}
