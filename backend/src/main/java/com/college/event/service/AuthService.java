package com.college.event.service;

import com.college.event.dto.AuthRequest;
import com.college.event.dto.AuthResponse;
import com.college.event.dto.StudentRegisterRequest;
import com.college.event.entity.Admin;
import com.college.event.entity.Organizer;
import com.college.event.entity.Student;
import com.college.event.exception.BadRequestException;
import com.college.event.repository.AdminRepository;
import com.college.event.repository.OrganizerRepository;
import com.college.event.repository.StudentRepository;
import com.college.event.security.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final OrganizerRepository organizerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(AdminRepository adminRepository,
                       StudentRepository studentRepository,
                       OrganizerRepository organizerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
        this.organizerRepository = organizerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse registerStudent(StudentRegisterRequest req) {
        if (studentRepository.existsByStudentId(req.getStudentId())) {
            throw new BadRequestException("Student ID '" + req.getStudentId() + "' is already registered");
        }
        if (studentRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email address '" + req.getEmail() + "' is already registered");
        }

        Student student = new Student(
                req.getStudentId().trim(),
                req.getFullName().trim(),
                req.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(req.getPassword()),
                req.getPhone().trim(),
                req.getDepartment().trim(),
                req.getYearOfStudy().trim()
        );

        Student saved = studentRepository.save(student);

        String token = jwtUtil.generateToken(
                saved.getEmail(),
                saved.getRole(),
                saved.getId(),
                saved.getStudentId()
        );

        return new AuthResponse(
                token,
                saved.getRole(),
                saved.getId(),
                saved.getStudentId(),
                saved.getFullName(),
                saved.getEmail(),
                saved.getStudentId()
        );
    }

    public AuthResponse loginStudent(AuthRequest req) {
        String identifier = req.getUsername().trim();
        Optional<Student> studentOpt = studentRepository.findByEmail(identifier.toLowerCase());
        if (studentOpt.isEmpty()) {
            studentOpt = studentRepository.findByStudentId(identifier);
        }

        if (studentOpt.isEmpty()) {
            throw new BadCredentialsException("Student account not found with given ID or Email");
        }

        Student student = studentOpt.get();
        if (!passwordEncoder.matches(req.getPassword(), student.getPassword())) {
            throw new BadCredentialsException("Invalid password for student account");
        }

        String token = jwtUtil.generateToken(
                student.getEmail(),
                student.getRole(),
                student.getId(),
                student.getStudentId()
        );

        return new AuthResponse(
                token,
                student.getRole(),
                student.getId(),
                student.getStudentId(),
                student.getFullName(),
                student.getEmail(),
                student.getStudentId()
        );
    }

    public AuthResponse loginAdmin(AuthRequest req) {
        String identifier = req.getUsername().trim();
        Optional<Admin> adminOpt = adminRepository.findByUsername(identifier);
        if (adminOpt.isEmpty()) {
            adminOpt = adminRepository.findByEmail(identifier.toLowerCase());
        }

        if (adminOpt.isEmpty()) {
            throw new BadCredentialsException("Admin account not found");
        }

        Admin admin = adminOpt.get();
        if (!passwordEncoder.matches(req.getPassword(), admin.getPassword())) {
            throw new BadCredentialsException("Invalid admin password");
        }

        String token = jwtUtil.generateToken(
                admin.getUsername(),
                admin.getRole(),
                admin.getId(),
                null
        );

        return new AuthResponse(
                token,
                admin.getRole(),
                admin.getId(),
                admin.getUsername(),
                admin.getFullName(),
                admin.getEmail(),
                null
        );
    }

    public AuthResponse loginOrganizer(AuthRequest req) {
        String identifier = req.getUsername().trim();
        Optional<Organizer> orgOpt = organizerRepository.findByUsername(identifier);
        if (orgOpt.isEmpty()) {
            orgOpt = organizerRepository.findByEmail(identifier.toLowerCase());
        }

        if (orgOpt.isEmpty()) {
            throw new BadCredentialsException("Organizer account not found");
        }

        Organizer organizer = orgOpt.get();
        if (!organizer.getIsActive()) {
            throw new BadCredentialsException("Organizer account has been deactivated");
        }

        if (!passwordEncoder.matches(req.getPassword(), organizer.getPassword())) {
            throw new BadCredentialsException("Invalid organizer password");
        }

        String token = jwtUtil.generateToken(
                organizer.getUsername(),
                organizer.getRole(),
                organizer.getId(),
                null
        );

        return new AuthResponse(
                token,
                organizer.getRole(),
                organizer.getId(),
                organizer.getUsername(),
                organizer.getFullName(),
                organizer.getEmail(),
                null
        );
    }
}

