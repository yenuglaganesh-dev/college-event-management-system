package com.college.event.controller;

import com.college.event.dto.ApiResponse;
import com.college.event.entity.Feedback;
import com.college.event.entity.Registration;
import com.college.event.repository.FeedbackRepository;
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
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final RegistrationRepository registrationRepository;

    public FeedbackController(FeedbackRepository feedbackRepository,
                              RegistrationRepository registrationRepository) {
        this.feedbackRepository = feedbackRepository;
        this.registrationRepository = registrationRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Feedback>> submitFeedback(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, Object> body) {
        Long eventId = Long.parseLong(body.get("eventId").toString());
        Integer rating = Integer.parseInt(body.get("rating").toString());
        String comments = body.getOrDefault("comments", "").toString();

        Optional<Registration> regOpt = registrationRepository.findByStudentIdAndEventId(user.getId(), eventId);
        if (regOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("You must be registered for this event to submit feedback."));
        }

        Registration reg = regOpt.get();
        if (feedbackRepository.existsByRegistrationId(reg.getId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Feedback has already been submitted for this event."));
        }

        Feedback fb = new Feedback(reg.getId(), user.getId(), eventId, rating, comments);
        return ResponseEntity.ok(ApiResponse.ok("Feedback submitted successfully", feedbackRepository.save(fb)));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<Feedback>>> getEventFeedbacks(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.ok("Event feedbacks retrieved", feedbackRepository.findByEventIdOrderByCreatedAtDesc(eventId)));
    }
}
