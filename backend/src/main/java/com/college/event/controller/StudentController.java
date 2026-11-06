package com.college.event.controller;

import com.college.event.dto.ApiResponse;
import com.college.event.dto.StudentProfileResponse;
import com.college.event.entity.Student;
import com.college.event.security.CustomUserDetails;
import com.college.event.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        StudentProfileResponse profile = studentService.getStudentProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved successfully", profile));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Student updatedData) {
        StudentProfileResponse profile = studentService.updateStudentProfile(user.getId(), updatedData);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", profile));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<StudentProfileResponse>>> getAllStudents() {
        List<StudentProfileResponse> list = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.ok("Students retrieved successfully", list));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getStudentById(@PathVariable Long id) {
        StudentProfileResponse profile = studentService.getStudentProfile(id);
        return ResponseEntity.ok(ApiResponse.ok("Student details retrieved successfully", profile));
    }
}

