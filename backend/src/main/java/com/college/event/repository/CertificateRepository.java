package com.college.event.repository;

import com.college.event.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByCertificateCode(String certificateCode);
    Optional<Certificate> findByRegistrationId(Long registrationId);
    List<Certificate> findByStudentId(Long studentId);
    List<Certificate> findByEventId(Long eventId);
    boolean existsByRegistrationId(Long registrationId);
}

