package com.college.event.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registration_id", nullable = false, unique = true)
    private Long registrationId;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "scanned_by_name", nullable = false, length = 100)
    private String scannedByName;

    @Column(name = "scanned_by_role", nullable = false, length = 50)
    private String scannedByRole;

    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public Attendance() {}

    public Attendance(Long registrationId, Long eventId, Long studentId, String scannedByName, String scannedByRole) {
        this.registrationId = registrationId;
        this.eventId = eventId;
        this.studentId = studentId;
        this.scannedByName = scannedByName;
        this.scannedByRole = scannedByRole;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRegistrationId() { return registrationId; }
    public void setRegistrationId(Long registrationId) { this.registrationId = registrationId; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getScannedByName() { return scannedByName; }
    public void setScannedByName(String scannedByName) { this.scannedByName = scannedByName; }

    public String getScannedByRole() { return scannedByRole; }
    public void setScannedByRole(String scannedByRole) { this.scannedByRole = scannedByRole; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

