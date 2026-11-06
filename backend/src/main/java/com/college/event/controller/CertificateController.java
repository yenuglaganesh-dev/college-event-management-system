package com.college.event.controller;

import com.college.event.dto.ApiResponse;
import com.college.event.entity.Certificate;
import com.college.event.entity.Registration;
import com.college.event.entity.RegistrationStatus;
import com.college.event.repository.CertificateRepository;
import com.college.event.repository.RegistrationRepository;
import com.college.event.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateRepository certificateRepository;
    private final RegistrationRepository registrationRepository;

    public CertificateController(CertificateRepository certificateRepository,
                                 RegistrationRepository registrationRepository) {
        this.certificateRepository = certificateRepository;
        this.registrationRepository = registrationRepository;
    }

    @PostMapping("/issue")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<ApiResponse<Certificate>> issueCertificate(@RequestBody Map<String, Long> body) {
        Long regId = body.get("registrationId");
        if (regId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Registration ID is required"));
        }

        Optional<Registration> regOpt = registrationRepository.findById(regId);
        if (regOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Registration not found"));
        }

        Registration reg = regOpt.get();
        if (reg.getStatus() != RegistrationStatus.APPROVED) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Certificate can only be issued to APPROVED attendees"));
        }

        if (certificateRepository.existsByRegistrationId(regId)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Certificate has already been issued for this registration"));
        }

        String code = "CERT-" + reg.getEvent().getId() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Certificate cert = new Certificate(
                code,
                reg.getId(),
                reg.getStudent().getId(),
                reg.getEvent().getId(),
                reg.getStudent().getFullName(),
                reg.getEvent().getTitle(),
                LocalDate.now()
        );

        Certificate saved = certificateRepository.save(cert);
        return ResponseEntity.ok(ApiResponse.ok("Digital Certificate generated successfully: " + code, saved));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Certificate>>> getMyCertificates(@AuthenticationPrincipal CustomUserDetails user) {
        List<Certificate> list = certificateRepository.findByStudentId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Student certificates retrieved", list));
    }

    @GetMapping("/verify/{code}")
    public ResponseEntity<ApiResponse<Certificate>> verifyCertificate(@PathVariable String code) {
        Optional<Certificate> certOpt = certificateRepository.findByCertificateCode(code.trim().toUpperCase());
        if (certOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Certificate not found or invalid: " + code));
        }
        return ResponseEntity.ok(ApiResponse.ok("Certificate verified as genuine and authentic", certOpt.get()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Certificate>>> getAllCertificates() {
        return ResponseEntity.ok(ApiResponse.ok("All certificates", certificateRepository.findAll()));
    }
}

