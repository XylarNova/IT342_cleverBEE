package edu.cit.cleverbee.Controller;

import edu.cit.cleverbee.Entity.StudyPlace;
import edu.cit.cleverbee.Service.StudyPlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study-places")
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "https://cleverbee-frontend.vercel.app"
})
public class StudyPlaceController {

    @Autowired
    private StudyPlaceService studyPlaceService;

    @GetMapping
    public ResponseEntity<?> getStudyPlacesWithinRadius(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false, defaultValue = "10") Double radius) {

        List<StudyPlace> places;
        if (lat != null && lng != null) {
            places = studyPlaceService.getStudyPlacesWithinRadius(lat, lng, radius);
        } else {
            places = studyPlaceService.getAllStudyPlaces();
        }
        return ResponseEntity.ok(Map.of("status", "success", "data", places));
    }
}
