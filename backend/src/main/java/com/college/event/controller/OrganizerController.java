package com.college.event.controller;

import com.college.event.dto.ApiResponse;
import com.college.event.dto.EventResponse;
import com.college.event.entity.Organizer;
import com.college.event.repository.EventRepository;
import com.college.event.repository.OrganizerRepository;
import com.college.event.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/organizer")
public class OrganizerController {

    private final OrganizerRepository organizerRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    public OrganizerController(OrganizerRepository organizerRepository,
                               EventRepository eventRepository,
                               PasswordEncoder passwordEncoder) {
        this.organizerRepository = organizerRepository;
        this.eventRepository = eventRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Organizer>>> getAllOrganizers() {
        return ResponseEntity.ok(ApiResponse.ok("Organizers retrieved", organizerRepository.findAll()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Organizer>> createOrganizer(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        if (organizerRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Username already taken"));
        }
        if (organizerRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already taken"));
        }

        Organizer org = new Organizer(
                username,
                passwordEncoder.encode(body.getOrDefault("password", "Admin@123")),
                body.get("fullName"),
                email,
                body.getOrDefault("phone", "N/A"),
                body.getOrDefault("department", "Computer Science")
        );
        return ResponseEntity.ok(ApiResponse.ok("Organizer created", organizerRepository.save(org)));
    }

    @GetMapping("/my-events")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getMyEvents(@AuthenticationPrincipal CustomUserDetails user) {
        // Return events assigned to organizer or all events if admin
        List<EventResponse> events = eventRepository.findAll().stream()
                .filter(e -> e.getOrganizer() == null || e.getOrganizer().getId().equals(user.getId()) || user.getRole().equals("ROLE_ADMIN"))
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("Organizer events retrieved", events));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrganizerDashboard(@AuthenticationPrincipal CustomUserDetails user) {
        long myEventsCount = eventRepository.findAll().stream()
                .filter(e -> e.getOrganizer() == null || e.getOrganizer().getId().equals(user.getId()) || user.getRole().equals("ROLE_ADMIN"))
                .count();

        Map<String, Object> stats = Map.of(
                "assignedEvents", myEventsCount,
                "organizerName", user.getFullName(),
                "role", user.getRole()
        );
        return ResponseEntity.ok(ApiResponse.ok("Organizer telemetry", stats));
    }
}

