package edu.cit.cleverbee.Repository;

import edu.cit.cleverbee.Entity.StudyPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyPlaceRepository extends JpaRepository<StudyPlace, Long> {

    @Query(value = "SELECT * FROM study_place sp WHERE " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(sp.lat)) * cos(radians(sp.lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(sp.lat)))) <= :radius",
            nativeQuery = true)
    List<StudyPlace> findAllWithinRadius(@Param("lat") double lat, @Param("lng") double lng, @Param("radius") double radius);
}
