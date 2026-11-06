package com.college.event.repository;

import com.college.event.entity.Registration;
import com.college.event.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByStudentIdOrderByRegistrationDateDesc(Long studentId);

    List<Registration> findByEventIdOrderByRegistrationDateDesc(Long eventId);

    List<Registration> findAllByOrderByRegistrationDateDesc();

    List<Registration> findByStatusOrderByRegistrationDateDesc(RegistrationStatus status);

    Optional<Registration> findByRegistrationCode(String registrationCode);

    Optional<Registration> findByStudentIdAndEventId(Long studentId, Long eventId);

    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);

    long countByEventId(Long eventId);

    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);

    long countByStatus(RegistrationStatus status);

    @Query("SELECT r FROM Registration r WHERE " +
           "(:eventId IS NULL OR r.event.id = :eventId) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:search IS NULL OR " +
           " LOWER(r.registrationCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.student.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.student.studentId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.student.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.event.title) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY r.registrationDate DESC")
    List<Registration> filterRegistrations(
            @Param("eventId") Long eventId,
            @Param("status") RegistrationStatus status,
            @Param("search") String search
    );
}

