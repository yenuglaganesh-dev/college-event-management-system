package com.college.event.service;

import com.college.event.dto.DashboardStatsResponse;
import com.college.event.dto.RegistrationResponse;
import com.college.event.entity.EventStatus;
import com.college.event.entity.RegistrationStatus;
import com.college.event.repository.EventRepository;
import com.college.event.repository.RegistrationRepository;
import com.college.event.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final RegistrationRepository registrationRepository;

    public DashboardService(EventRepository eventRepository,
                            StudentRepository studentRepository,
                            RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.studentRepository = studentRepository;
        this.registrationRepository = registrationRepository;
    }

    public DashboardStatsResponse getAdminDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalEvents(eventRepository.count());
        stats.setActiveEvents(eventRepository.countByStatus(EventStatus.ACTIVE));
        stats.setTotalStudents(studentRepository.count());
        stats.setTotalRegistrations(registrationRepository.count());
        stats.setPendingRegistrations(registrationRepository.countByStatus(RegistrationStatus.PENDING));
        stats.setApprovedRegistrations(registrationRepository.countByStatus(RegistrationStatus.APPROVED));
        stats.setRejectedRegistrations(registrationRepository.countByStatus(RegistrationStatus.REJECTED));
        stats.setCancelledRegistrations(registrationRepository.countByStatus(RegistrationStatus.CANCELLED));

        // Get top 5 recent registrations
        List<RegistrationResponse> recent = registrationRepository.findAllByOrderByRegistrationDateDesc().stream()
                .limit(5)
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
        stats.setRecentRegistrations(recent);

        return stats;
    }
}

