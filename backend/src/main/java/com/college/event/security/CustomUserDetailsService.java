package com.college.event.security;

import com.college.event.entity.Admin;
import com.college.event.entity.Organizer;
import com.college.event.entity.Student;
import com.college.event.repository.AdminRepository;
import com.college.event.repository.OrganizerRepository;
import com.college.event.repository.StudentRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final OrganizerRepository organizerRepository;

    public CustomUserDetailsService(AdminRepository adminRepository,
                                    StudentRepository studentRepository,
                                    OrganizerRepository organizerRepository) {
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
        this.organizerRepository = organizerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // 1. Try finding in Admins
        Optional<Admin> adminOpt = adminRepository.findByUsername(identifier);
        if (adminOpt.isEmpty()) {
            adminOpt = adminRepository.findByEmail(identifier);
        }
        if (adminOpt.isPresent()) {
            Admin a = adminOpt.get();
            return new CustomUserDetails(
                    a.getId(),
                    a.getUsername(),
                    a.getPassword(),
                    a.getRole(),
                    a.getFullName(),
                    a.getEmail(),
                    null
            );
        }

        // 2. Try finding in Organizers
        Optional<Organizer> orgOpt = organizerRepository.findByUsername(identifier);
        if (orgOpt.isEmpty()) {
            orgOpt = organizerRepository.findByEmail(identifier);
        }
        if (orgOpt.isPresent()) {
            Organizer o = orgOpt.get();
            return new CustomUserDetails(
                    o.getId(),
                    o.getUsername(),
                    o.getPassword(),
                    o.getRole(),
                    o.getFullName(),
                    o.getEmail(),
                    null
            );
        }

        // 3. Try finding in Students (by email or studentId)
        Optional<Student> studentOpt = studentRepository.findByEmail(identifier);
        if (studentOpt.isEmpty()) {
            studentOpt = studentRepository.findByStudentId(identifier);
        }
        if (studentOpt.isPresent()) {
            Student s = studentOpt.get();
            return new CustomUserDetails(
                    s.getId(),
                    s.getEmail(), // use email as principal username
                    s.getPassword(),
                    s.getRole(),
                    s.getFullName(),
                    s.getEmail(),
                    s.getStudentId()
            );
        }

        throw new UsernameNotFoundException("User not found with identifier: " + identifier);
    }
}

