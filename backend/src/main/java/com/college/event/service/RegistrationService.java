package com.college.event.service;

import com.college.event.dto.RegistrationRequest;
import com.college.event.dto.RegistrationResponse;
import com.college.event.dto.RegistrationStatusUpdateRequest;
import com.college.event.entity.*;
import com.college.event.exception.BadRequestException;
import com.college.event.exception.DuplicateRegistrationException;
import com.college.event.exception.ResourceNotFoundException;
import com.college.event.repository.EventRepository;
import com.college.event.repository.RegistrationRepository;
import com.college.event.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;

    public RegistrationService(RegistrationRepository registrationRepository,
                               StudentRepository studentRepository,
                               EventRepository eventRepository) {
        this.registrationRepository = registrationRepository;
        this.studentRepository = studentRepository;
        this.eventRepository = eventRepository;
    }

    /**
     * CORE REQUIREMENT: Student Event Registration
     * Validates student, event, capacity, deadline, and duplicates.
     * Generates a unique Registration Code and persists in MySQL.
     */
    @Transactional
    public RegistrationResponse registerStudentForEvent(Long studentDbId, RegistrationRequest req) {
        // 1. Verify and retrieve student
        Student student = studentRepository.findById(studentDbId)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated student record not found"));

        // 2. Verify and retrieve event
        Event event = eventRepository.findById(req.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + req.getEventId()));

        // 3. Check event status
        if (event.getStatus() != EventStatus.ACTIVE) {
            throw new BadRequestException("Event is not currently active for registrations (Status: " + event.getStatus() + ")");
        }

        // 4. Check deadline
        if (LocalDateTime.now().isAfter(event.getRegistrationDeadline())) {
            throw new BadRequestException("Registration deadline for this event has passed (" + event.getRegistrationDeadline() + ")");
        }

        // 5. Check participant limit
        if (event.getCurrentRegistrations() >= event.getMaxCapacity()) {
            throw new BadRequestException("Event has reached its maximum capacity of " + event.getMaxCapacity() + " participants");
        }

        // 6. Check duplicate registration
        if (registrationRepository.existsByStudentIdAndEventId(student.getId(), event.getId())) {
            throw new DuplicateRegistrationException("You are already registered for this event ('" + event.getTitle() + "')");
        }

        // 7. Generate unique Registration Code: REG-YYYYMMDD-XXXX
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String registrationCode = "REG-" + event.getId() + "-" + uniqueSuffix;

        // 8. Create and persist Registration entity in MySQL
        Registration registration = new Registration(registrationCode, student, event);
        registration.setStatus(RegistrationStatus.PENDING);
        registration.setRegistrationDate(LocalDateTime.now());

        Registration saved = registrationRepository.save(registration);

        // 9. Increment event current_registrations
        event.setCurrentRegistrations(event.getCurrentRegistrations() + 1);
        eventRepository.save(event);

        return RegistrationResponse.fromEntity(saved);
    }

    /**
     * Get registrations for authenticated student
     */
    public List<RegistrationResponse> getStudentRegistrations(Long studentDbId) {
        return registrationRepository.findByStudentIdOrderByRegistrationDateDesc(studentDbId).stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Student cancels their own registration
     */
    @Transactional
    public RegistrationResponse cancelRegistrationByStudent(Long studentDbId, Long registrationId) {
        Registration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        if (!reg.getStudent().getId().equals(studentDbId)) {
            throw new BadRequestException("You can only cancel your own registrations");
        }

        if (reg.getStatus() == RegistrationStatus.CANCELLED) {
            throw new BadRequestException("Registration is already cancelled");
        }

        reg.setStatus(RegistrationStatus.CANCELLED);
        reg.setUpdatedAt(LocalDateTime.now());
        reg.setAdminRemarks("Cancelled by student on " + LocalDateTime.now());

        // Decrement event registrations if it wasn't already rejected
        Event event = reg.getEvent();
        if (event.getCurrentRegistrations() > 0) {
            event.setCurrentRegistrations(event.getCurrentRegistrations() - 1);
            eventRepository.save(event);
        }

        Registration saved = registrationRepository.save(reg);
        return RegistrationResponse.fromEntity(saved);
    }

    /**
     * Admin: Get all registrations
     */
    public List<RegistrationResponse> getAllRegistrations() {
        return registrationRepository.findAllByOrderByRegistrationDateDesc().stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Admin: Filter and search registrations
     */
    public List<RegistrationResponse> filterRegistrations(Long eventId, RegistrationStatus status, String search) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        return registrationRepository.filterRegistrations(eventId, status, cleanSearch).stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Admin: Get single registration details
     */
    public RegistrationResponse getRegistrationById(Long id) {
        Registration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + id));
        return RegistrationResponse.fromEntity(reg);
    }

    /**
     * Admin: Update registration status (Approve / Reject)
     */
    @Transactional
    public RegistrationResponse updateRegistrationStatus(Long id, RegistrationStatusUpdateRequest req) {
        Registration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + id));

        RegistrationStatus oldStatus = reg.getStatus();
        RegistrationStatus newStatus = req.getStatus();

        reg.setStatus(newStatus);
        reg.setUpdatedAt(LocalDateTime.now());
        if (req.getRemarks() != null && !req.getRemarks().trim().isEmpty()) {
            reg.setAdminRemarks(req.getRemarks().trim());
        }

        // Adjust event capacity if rejected/cancelled from approved/pending
        Event event = reg.getEvent();
        if ((newStatus == RegistrationStatus.REJECTED || newStatus == RegistrationStatus.CANCELLED) &&
            (oldStatus == RegistrationStatus.APPROVED || oldStatus == RegistrationStatus.PENDING)) {
            if (event.getCurrentRegistrations() > 0) {
                event.setCurrentRegistrations(event.getCurrentRegistrations() - 1);
                eventRepository.save(event);
            }
        } else if ((newStatus == RegistrationStatus.APPROVED || newStatus == RegistrationStatus.PENDING) &&
                   (oldStatus == RegistrationStatus.REJECTED || oldStatus == RegistrationStatus.CANCELLED)) {
            event.setCurrentRegistrations(event.getCurrentRegistrations() + 1);
            eventRepository.save(event);
        }

        Registration saved = registrationRepository.save(reg);
        return RegistrationResponse.fromEntity(saved);
    }
}

