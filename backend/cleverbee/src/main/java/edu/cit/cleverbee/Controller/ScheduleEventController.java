package edu.cit.cleverbee.Controller;

import edu.cit.cleverbee.Entity.ScheduleEvent;
import edu.cit.cleverbee.Entity.User;
import edu.cit.cleverbee.Repository.UserRepository;
import edu.cit.cleverbee.Service.ScheduleEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "https://cleverbee-frontend.vercel.app"
})
public class ScheduleEventController {

    @Autowired
    private ScheduleEventService service;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ScheduleEvent> create(@RequestBody ScheduleEvent event, Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        event.setUserId(user.getId());
        return ResponseEntity.ok(service.create(event));
    }

    @GetMapping
    public ResponseEntity<List<ScheduleEvent>> getAll(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(service.getAllByUser(user.getId()));
    }

    @GetMapping("/class-list")
    public ResponseEntity<List<ScheduleEvent>> getClassList(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(service.getByUserAndClassType(user.getId(), ScheduleEvent.ClassType.FACE_TO_FACE));
    }

    @GetMapping("/events")
    public ResponseEntity<List<ScheduleEvent>> getEvents(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(service.getByUserAndClassType(user.getId(), ScheduleEvent.ClassType.EVENT));
    }

    @DeleteMapping("/clear-classes")
    public ResponseEntity<?> clearClassList(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        service.deleteAllByUserAndClassType(user.getId(), ScheduleEvent.ClassType.FACE_TO_FACE);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear-events")
    public ResponseEntity<?> clearEvents(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        service.deleteAllByUserAndClassType(user.getId(), ScheduleEvent.ClassType.EVENT);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleEvent> update(@PathVariable Long id, @RequestBody ScheduleEvent event) {
        return ResponseEntity.ok(service.update(id, event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
