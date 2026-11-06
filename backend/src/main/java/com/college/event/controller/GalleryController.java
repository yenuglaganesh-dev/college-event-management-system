package com.college.event.controller;

import com.college.event.dto.ApiResponse;
import com.college.event.entity.EventGallery;
import com.college.event.repository.EventGalleryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final EventGalleryRepository galleryRepository;

    public GalleryController(EventGalleryRepository galleryRepository) {
        this.galleryRepository = galleryRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventGallery>>> getGallery(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long eventId) {
        List<EventGallery> list;
        if (eventId != null) {
            list = galleryRepository.findByEventId(eventId);
        } else if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            list = galleryRepository.findByCategoryOrderByDisplayOrderAscCreatedAtDesc(category);
        } else {
            list = galleryRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc();
        }
        return ResponseEntity.ok(ApiResponse.ok("Gallery photos retrieved", list));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<ApiResponse<EventGallery>> addPhoto(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        String imageUrl = body.get("imageUrl");
        if (title == null || imageUrl == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Title and imageUrl are required"));
        }

        EventGallery item = new EventGallery(
                body.get("eventId") != null ? Long.parseLong(body.get("eventId")) : null,
                imageUrl,
                title,
                body.get("caption"),
                body.getOrDefault("category", "General"),
                0
        );

        return ResponseEntity.ok(ApiResponse.ok("Photo added to gallery", galleryRepository.save(item)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePhoto(@PathVariable Long id) {
        galleryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Photo removed from gallery", null));
    }
}

