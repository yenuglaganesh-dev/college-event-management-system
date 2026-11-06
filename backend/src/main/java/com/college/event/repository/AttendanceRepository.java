package com.college.event.repository;

import com.college.event.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByRegistrationId(Long registrationId);
    List<Attendance> findByEventId(Long eventId);
    List<Attendance> findByStudentId(Long studentId);
    boolean existsByRegistrationId(Long registrationId);
    long countByEventId(Long eventId);
}

