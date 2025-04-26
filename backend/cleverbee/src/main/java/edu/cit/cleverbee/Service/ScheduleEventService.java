package edu.cit.cleverbee.Service;

import edu.cit.cleverbee.Entity.ScheduleEvent;
import edu.cit.cleverbee.Repository.ScheduleEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduleEventService {

    @Autowired
    private ScheduleEventRepository repository;

    public ScheduleEvent create(ScheduleEvent event) {
        return repository.save(event);
    }

    public List<ScheduleEvent> getAllByUser(Long userId) {
        return repository.findByUserId(userId);
    }

    public List<ScheduleEvent> getByUserAndClassType(Long userId, ScheduleEvent.ClassType classType) {
        return repository.findByUserIdAndClassType(userId, classType);
    }

    public Optional<ScheduleEvent> getById(Long id) {
        return repository.findById(id);
    }

    public ScheduleEvent update(Long id, ScheduleEvent updated) {
        return repository.findById(id).map(existing -> {
            existing.setSubject(updated.getSubject());
            existing.setDescription(updated.getDescription());
            existing.setRoom(updated.getRoom());
            existing.setInstructor(updated.getInstructor());
            existing.setDate(updated.getDate());
            existing.setRecurringDay(updated.getRecurringDay());
            existing.setStartTime(updated.getStartTime());
            existing.setEndTime(updated.getEndTime());
            existing.setRecurring(updated.isRecurring());
            existing.setClassType(updated.getClassType());
            existing.setOnline(updated.isOnline());
            existing.setUserId(updated.getUserId()); // 🛠 THIS LINE IS IMPORTANT FOR UPDATE TO WORK!
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Schedule not found"));
    }
    

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public void deleteAllByUserAndClassType(Long userId, ScheduleEvent.ClassType classType) {
        List<ScheduleEvent> schedules = repository.findByUserIdAndClassType(userId, classType);
        repository.deleteAll(schedules);
    }
}
