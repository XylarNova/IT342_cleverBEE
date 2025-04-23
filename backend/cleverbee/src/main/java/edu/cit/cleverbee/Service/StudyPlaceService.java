package edu.cit.cleverbee.Service;

import edu.cit.cleverbee.Entity.StudyPlace;
import edu.cit.cleverbee.Repository.StudyPlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudyPlaceService {

    @Autowired
    private StudyPlaceRepository studyPlaceRepository;

    public List<StudyPlace> getAllStudyPlaces() {
        return studyPlaceRepository.findAll();
    }

    public List<StudyPlace> getStudyPlacesWithinRadius(double lat, double lng, double radius) {
        return studyPlaceRepository.findAllWithinRadius(lat, lng, radius);
    }
}
