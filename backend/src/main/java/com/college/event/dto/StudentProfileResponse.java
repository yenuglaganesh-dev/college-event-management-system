package com.college.event.dto;

import com.college.event.entity.Student;

import java.time.LocalDateTime;

public class StudentProfileResponse {
    private Long id;
    private String studentId;
    private String fullName;
    private String email;
    private String phone;
    private String department;
    private String yearOfStudy;
    private long totalRegistrations;
    private LocalDateTime createdAt;

    public StudentProfileResponse() {}

    public static StudentProfileResponse fromEntity(Student s, long totalRegistrations) {
        StudentProfileResponse resp = new StudentProfileResponse();
        resp.setId(s.getId());
        resp.setStudentId(s.getStudentId());
        resp.setFullName(s.getFullName());
        resp.setEmail(s.getEmail());
        resp.setPhone(s.getPhone());
        resp.setDepartment(s.getDepartment());
        resp.setYearOfStudy(s.getYearOfStudy());
        resp.setTotalRegistrations(totalRegistrations);
        resp.setCreatedAt(s.getCreatedAt());
        return resp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public long getTotalRegistrations() { return totalRegistrations; }
    public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

