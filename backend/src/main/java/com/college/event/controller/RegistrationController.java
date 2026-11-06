package com.college.event.controller;

import com.college.event.dto.ApiResponse;
import com.college.event.dto.RegistrationRequest;
import com.college.event.dto.RegistrationResponse;
import com.college.event.dto.RegistrationStatusUpdateRequest;
import com.college.event.entity.RegistrationStatus;
import com.college.event.security.CustomUserDetails;
import com.college.event.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /**
     * CORE REQUIREMENT: Student Registers for an Event.
     * Authenticated student details are automatically bound.
     */
    @PostMapping("/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<RegistrationResponse>> registerForEvent(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody RegistrationRequest req) {
        RegistrationResponse response = registrationService.registerStudentForEvent(user.getId(), req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Event registration submitted successfully! Code: " + response.getRegistrationCode(), response));
    }

    /**
     * Authenticated Student views their own registrations.
     */
    @GetMapping("/my-registrations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getMyRegistrations(
            @AuthenticationPrincipal CustomUserDetails user) {
        List<RegistrationResponse> list = registrationService.getStudentRegistrations(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("My registrations retrieved successfully", list));
    }

    /**
     * Student cancels their own registration.
     */
    @PostMapping("/cancel/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<RegistrationResponse>> cancelRegistration(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id) {
        RegistrationResponse response = registrationService.cancelRegistrationByStudent(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Registration cancelled successfully", response));
    }

    /**
     * Admin: View all student registrations.
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getAllRegistrationsForAdmin() {
        List<RegistrationResponse> list = registrationService.getAllRegistrations();
        return ResponseEntity.ok(ApiResponse.ok("All registrations retrieved for admin", list));
    }

    /**
     * Admin: Filter and search student registrations.
     */
    @GetMapping("/admin/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> filterRegistrations(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) RegistrationStatus status,
            @RequestParam(required = false) String search) {
        List<RegistrationResponse> list = registrationService.filterRegistrations(eventId, status, search);
        return ResponseEntity.ok(ApiResponse.ok("Filtered registrations retrieved", list));
    }

    /**
     * Admin: View single registration details.
     */
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationResponse>> getRegistrationById(@PathVariable Long id) {
        RegistrationResponse reg = registrationService.getRegistrationById(id);
        return ResponseEntity.ok(ApiResponse.ok("Registration details retrieved", reg));
    }

    /**
     * Admin: Approve or Reject registration.
     */
    @PatchMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody RegistrationStatusUpdateRequest req) {
        RegistrationResponse updated = registrationService.updateRegistrationStatus(id, req);
        String action = updated.getStatus().name();
        return ResponseEntity.ok(ApiResponse.ok("Registration has been " + action.toLowerCase() + " successfully", updated));
    }
}

