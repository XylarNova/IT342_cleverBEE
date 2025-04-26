package edu.cit.cleverbee.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "schedule_events")
public class ScheduleEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subject;
    private String description; // ✅ Added
    private String room; // ✅ Added
    private String instructor; // ✅ Added
    private String date;
    private String recurringDay;
    private String startTime;
    private String endTime;
    private boolean recurring;

    @Enumerated(EnumType.STRING)
    private ClassType classType; // ONLINE, FACE_TO_FACE, HYBRID, EVENT

    private boolean isOnline;

    @Column(name = "user_id")
    private Long userId;

    public enum ClassType {
        ONLINE, FACE_TO_FACE, HYBRID, EVENT
    }

    public ScheduleEvent() {}

    public ScheduleEvent(Long id, String subject, String description, String room, String instructor,
                         String date, String recurringDay, String startTime, String endTime,
                         boolean recurring, ClassType classType, boolean isOnline, Long userId) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.room = room;
        this.instructor = instructor;
        this.date = date;
        this.recurringDay = recurringDay;
        this.startTime = startTime;
        this.endTime = endTime;
        this.recurring = recurring;
        this.classType = classType;
        this.isOnline = isOnline;
        this.userId = userId;
    }


    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getRecurringDay() { return recurringDay; }
    public void setRecurringDay(String recurringDay) { this.recurringDay = recurringDay; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public boolean isRecurring() { return recurring; }
    public void setRecurring(boolean recurring) { this.recurring = recurring; }

    public ClassType getClassType() { return classType; }
    public void setClassType(ClassType classType) { this.classType = classType; }

    public boolean isOnline() { return isOnline; }
    public void setOnline(boolean online) { isOnline = online; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }
}