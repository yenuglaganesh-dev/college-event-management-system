package com.college.event.repository;

import com.college.event.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByEventIdOrderByCreatedAtDesc(Long eventId);

    Optional<Feedback> findByRegistrationId(Long registrationId);

    boolean existsByRegistrationId(Long registrationId);
}
