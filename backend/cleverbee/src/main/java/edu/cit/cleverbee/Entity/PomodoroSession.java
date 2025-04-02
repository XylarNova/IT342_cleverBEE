package edu.cit.cleverbee.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "pomodoro_sessions")
public class PomodoroSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private Integer duration;

    @Column(nullable = false)
    private Integer shortBreak;

    @Column(nullable = false)
    private Integer longBreak;

    @Column(nullable = false)
    private Integer sessionsUntilLongBreak;

    @Column(nullable = false)
    private Integer completedSessions;

    @Column(nullable = false)
    private String status; // RUNNING, PAUSED, COMPLETED

    @Column(nullable = false)
    private Integer timeRemaining;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime pauseTime;

    private LocalDateTime endTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getShortBreak() {
        return shortBreak;
    }

    public void setShortBreak(Integer shortBreak) {
        this.shortBreak = shortBreak;
    }

    public Integer getLongBreak() {
        return longBreak;
    }

    public void setLongBreak(Integer longBreak) {
        this.longBreak = longBreak;
    }

    public Integer getSessionsUntilLongBreak() {
        return sessionsUntilLongBreak;
    }

    public void setSessionsUntilLongBreak(Integer sessionsUntilLongBreak) {
        this.sessionsUntilLongBreak = sessionsUntilLongBreak;
    }

    public Integer getCompletedSessions() {
        return completedSessions;
    }

    public void setCompletedSessions(Integer completedSessions) {
        this.completedSessions = completedSessions;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTimeRemaining() {
        return timeRemaining;
    }

    public void setTimeRemaining(Integer timeRemaining) {
        this.timeRemaining = timeRemaining;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getPauseTime() {
        return pauseTime;
    }

    public void setPauseTime(LocalDateTime pauseTime) {
        this.pauseTime = pauseTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}