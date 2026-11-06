package com.college.event.controller;

import com.college.event.dto.ApiResponse;
import com.college.event.entity.Attendance;
import com.college.event.entity.Registration;
import com.college.event.entity.RegistrationStatus;
import com.college.event.repository.AttendanceRepository;
import com.college.event.repository.RegistrationRepository;
import com.college.event.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final RegistrationRepository registrationRepository;

    public AttendanceController(AttendanceRepository attendanceRepository,
                                RegistrationRepository registrationRepository) {
        this.attendanceRepository = attendanceRepository;
        this.registrationRepository = registrationRepository;
    }

    @PostMapping("/scan")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Attendance>> scanAttendance(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, String> body) {
        String code = body.get("ticketCode");
        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Ticket / Registration Code is required"));
        }

        Optional<Registration> regOpt = registrationRepository.findByRegistrationCode(code.trim());
        if (regOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid ticket code: Registration not found"));
        }

        Registration reg = regOpt.get();
        if (reg.getStatus() != RegistrationStatus.APPROVED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Cannot mark attendance: Registration status is " + reg.getStatus() + ". Only APPROVED registrations are valid."));
        }

        if (attendanceRepository.existsByRegistrationId(reg.getId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Attendance already recorded for ticket code: " + code));
        }

        Attendance attendance = new Attendance(
                reg.getId(),
                reg.getEvent().getId(),
                reg.getStudent().getId(),
                user.getFullName(),
                user.getRole()
        );

        Attendance saved = attendanceRepository.save(attendance);
        return ResponseEntity.ok(ApiResponse.ok("Attendance verified and marked PRESENT for " + reg.getStudent().getFullName(), saved));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Attendance>>> getEventAttendance(@PathVariable Long eventId) {
        List<Attendance> list = attendanceRepository.findByEventId(eventId);
        return ResponseEntity.ok(ApiResponse.ok("Event attendance roster", list));
    }
}

