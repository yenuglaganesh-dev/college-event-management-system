package com.college.event.dto;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private String role;
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String studentId;

    public AuthResponse() {}

    public AuthResponse(String token, String role, Long id, String username, String fullName, String email, String studentId) {
        this.token = token;
        this.tokenType = "Bearer";
        this.role = role;
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.studentId = studentId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
}

