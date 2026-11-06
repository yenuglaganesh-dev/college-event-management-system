package com.college.event.repository;

import com.college.event.entity.EventWaitlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventWaitlistRepository extends JpaRepository<EventWaitlist, Long> {
    List<EventWaitlist> findByEventIdAndStatusOrderByPositionAsc(Long eventId, String status);
    List<EventWaitlist> findByStudentId(Long studentId);
    Optional<EventWaitlist> findByEventIdAndStudentId(Long eventId, Long studentId);
    boolean existsByEventIdAndStudentId(Long eventId, Long studentId);
    long countByEventIdAndStatus(Long eventId, String status);
}

