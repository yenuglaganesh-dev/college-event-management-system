package com.college.event.controller;

import com.college.event.dto.ApiResponse;
import com.college.event.entity.Announcement;
import com.college.event.repository.AnnouncementRepository;
import com.college.event.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementController(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Announcement>>> getActiveAnnouncements() {
        return ResponseEntity.ok(ApiResponse.ok("Active announcements", announcementRepository.findByIsActiveTrueOrderByCreatedAtDesc()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, String> body) {
        String title = body.get("title");
        String content = body.get("content");
        if (title == null || title.isBlank() || content == null || content.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Title and content are required"));
        }

        Announcement ann = new Announcement(
                title.trim(),
                content.trim(),
                body.getOrDefault("targetDepartment", "ALL"),
                body.get("eventId") != null ? Long.parseLong(body.get("eventId")) : null,
                user.getFullName(),
                null
        );

        return ResponseEntity.ok(ApiResponse.ok("Announcement published successfully", announcementRepository.save(ann)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable Long id) {
        announcementRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Announcement deleted", null));
    }
}

