package edu.cit.cleverbee.Repository;

import edu.cit.cleverbee.Entity.ScheduleEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleEventRepository extends JpaRepository<ScheduleEvent, Long> {
    List<ScheduleEvent> findByUserId(Long userId);

    List<ScheduleEvent> findByUserIdAndClassType(Long userId, ScheduleEvent.ClassType classType); // ✅ For filtering
}
