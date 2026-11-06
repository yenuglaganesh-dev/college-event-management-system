package com.college.event.controller;

import com.college.event.dto.ApiResponse;
import com.college.event.entity.Event;
import com.college.event.entity.EventWaitlist;
import com.college.event.repository.EventRepository;
import com.college.event.repository.EventWaitlistRepository;
import com.college.event.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/waitlist")
public class WaitlistController {

    private final EventWaitlistRepository waitlistRepository;
    private final EventRepository eventRepository;

    public WaitlistController(EventWaitlistRepository waitlistRepository,
                              EventRepository eventRepository) {
        this.waitlistRepository = waitlistRepository;
        this.eventRepository = eventRepository;
    }

    @PostMapping("/join/{eventId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<EventWaitlist>> joinWaitlist(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Event not found"));
        }

        if (waitlistRepository.existsByEventIdAndStudentId(eventId, user.getId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("You are already on the waitlist for this event"));
        }

        long count = waitlistRepository.countByEventIdAndStatus(eventId, "WAITING");
        EventWaitlist wl = new EventWaitlist(eventId, user.getId(), (int) (count + 1));
        return ResponseEntity.ok(ApiResponse.ok("Added to waitlist at position #" + (count + 1), waitlistRepository.save(wl)));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<EventWaitlist>>> getMyWaitlists(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ApiResponse.ok("Student waitlist entries", waitlistRepository.findByStudentId(user.getId())));
    }
}

