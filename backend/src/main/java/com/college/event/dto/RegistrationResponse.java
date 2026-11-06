package com.college.event.dto;

import com.college.event.entity.Registration;
import com.college.event.entity.RegistrationStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class RegistrationResponse {
    private Long id;
    private String registrationCode;

    // Student Information
    private Long studentDatabaseId;
    private String studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String studentDepartment;
    private String studentYear;

    // Event Information
    private Long eventId;
    private String eventTitle;
    private String eventCategory;
    private LocalDate eventDate;
    private String eventTime;
    private String eventVenue;

    // Registration Details
    private LocalDateTime registrationDateTime;
    private String registrationDateFormatted;
    private String registrationTimeFormatted;
    private RegistrationStatus status;
    private String adminRemarks;
    private LocalDateTime updatedAt;

    public RegistrationResponse() {}

    public static RegistrationResponse fromEntity(Registration reg) {
        RegistrationResponse resp = new RegistrationResponse();
        resp.setId(reg.getId());
        resp.setRegistrationCode(reg.getRegistrationCode());

        if (reg.getStudent() != null) {
            resp.setStudentDatabaseId(reg.getStudent().getId());
            resp.setStudentId(reg.getStudent().getStudentId());
            resp.setStudentName(reg.getStudent().getFullName());
            resp.setStudentEmail(reg.getStudent().getEmail());
            resp.setStudentPhone(reg.getStudent().getPhone());
            resp.setStudentDepartment(reg.getStudent().getDepartment());
            resp.setStudentYear(reg.getStudent().getYearOfStudy());
        }

        if (reg.getEvent() != null) {
            resp.setEventId(reg.getEvent().getId());
            resp.setEventTitle(reg.getEvent().getTitle());
            resp.setEventCategory(reg.getEvent().getCategory());
            resp.setEventDate(reg.getEvent().getEventDate());
            resp.setEventTime(reg.getEvent().getEventTime());
            resp.setEventVenue(reg.getEvent().getVenue());
        }

        resp.setRegistrationDateTime(reg.getRegistrationDate());
        if (reg.getRegistrationDate() != null) {
            resp.setRegistrationDateFormatted(reg.getRegistrationDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            resp.setRegistrationTimeFormatted(reg.getRegistrationDate().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        }

        resp.setStatus(reg.getStatus());
        resp.setAdminRemarks(reg.getAdminRemarks());
        resp.setUpdatedAt(reg.getUpdatedAt());
        return resp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegistrationCode() { return registrationCode; }
    public void setRegistrationCode(String registrationCode) { this.registrationCode = registrationCode; }

    public Long getStudentDatabaseId() { return studentDatabaseId; }
    public void setStudentDatabaseId(Long studentDatabaseId) { this.studentDatabaseId = studentDatabaseId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentPhone() { return studentPhone; }
    public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }

    public String getStudentDepartment() { return studentDepartment; }
    public void setStudentDepartment(String studentDepartment) { this.studentDepartment = studentDepartment; }

    public String getStudentYear() { return studentYear; }
    public void setStudentYear(String studentYear) { this.studentYear = studentYear; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getEventCategory() { return eventCategory; }
    public void setEventCategory(String eventCategory) { this.eventCategory = eventCategory; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public String getEventTime() { return eventTime; }
    public void setEventTime(String eventTime) { this.eventTime = eventTime; }

    public String getEventVenue() { return eventVenue; }
    public void setEventVenue(String eventVenue) { this.eventVenue = eventVenue; }

    public LocalDateTime getRegistrationDateTime() { return registrationDateTime; }
    public void setRegistrationDateTime(LocalDateTime registrationDateTime) { this.registrationDateTime = registrationDateTime; }

    public String getRegistrationDateFormatted() { return registrationDateFormatted; }
    public void setRegistrationDateFormatted(String registrationDateFormatted) { this.registrationDateFormatted = registrationDateFormatted; }

    public String getRegistrationTimeFormatted() { return registrationTimeFormatted; }
    public void setRegistrationTimeFormatted(String registrationTimeFormatted) { this.registrationTimeFormatted = registrationTimeFormatted; }

    public RegistrationStatus getStatus() { return status; }
    public void setStatus(RegistrationStatus status) { this.status = status; }

    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

