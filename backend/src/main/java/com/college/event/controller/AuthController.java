package com.college.event.controller;

import com.college.event.dto.ApiResponse;
import com.college.event.dto.AuthRequest;
import com.college.event.dto.AuthResponse;
import com.college.event.dto.StudentRegisterRequest;
import com.college.event.security.CustomUserDetails;
import com.college.event.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/student/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStudent(@Valid @RequestBody StudentRegisterRequest req) {
        AuthResponse response = authService.registerStudent(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful! Welcome to the College Event Portal.", response));
    }

    @PostMapping("/student/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginStudent(@Valid @RequestBody AuthRequest req) {
        AuthResponse response = authService.loginStudent(req);
        return ResponseEntity.ok(ApiResponse.ok("Student login successful", response));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginAdmin(@Valid @RequestBody AuthRequest req) {
        AuthResponse response = authService.loginAdmin(req);
        return ResponseEntity.ok(ApiResponse.ok("Admin login successful", response));
    }

    @PostMapping("/organizer/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginOrganizer(@Valid @RequestBody AuthRequest req) {
        AuthResponse response = authService.loginOrganizer(req);
        return ResponseEntity.ok(ApiResponse.ok("Organizer login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }
        AuthResponse response = new AuthResponse(
                null,
                user.getRole(),
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getStudentId()
        );
        return ResponseEntity.ok(ApiResponse.ok("User authenticated", response));
    }
}

