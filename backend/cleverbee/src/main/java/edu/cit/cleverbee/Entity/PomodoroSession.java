package edu.cit.cleverbee.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pomodoro_sessions")
public class PomodoroSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // Session title like "Study Math"

    @Column(nullable = false)
    private String mode; // focus / short / long

    @Column(nullable = false)
    private int sessionsBeforeLongBreak; // Number of pomodoros before long break

    @Column(nullable = false)
    private String status; // "Ongoing" or "Completed"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 👤 Linked logged-in user

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getMode() {
        return mode;
    }
    public void setMode(String mode) {
        this.mode = mode;
    }

    public int getSessionsBeforeLongBreak() {
        return sessionsBeforeLongBreak;
    }
    public void setSessionsBeforeLongBreak(int sessionsBeforeLongBreak) {
        this.sessionsBeforeLongBreak = sessionsBeforeLongBreak;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
}
