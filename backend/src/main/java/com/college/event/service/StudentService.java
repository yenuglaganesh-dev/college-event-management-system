package com.college.event.service;

import com.college.event.dto.StudentProfileResponse;
import com.college.event.entity.Student;
import com.college.event.exception.ResourceNotFoundException;
import com.college.event.repository.RegistrationRepository;
import com.college.event.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final RegistrationRepository registrationRepository;

    public StudentService(StudentRepository studentRepository, RegistrationRepository registrationRepository) {
        this.studentRepository = studentRepository;
        this.registrationRepository = registrationRepository;
    }

    public StudentProfileResponse getStudentProfile(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        long count = registrationRepository.findByStudentIdOrderByRegistrationDateDesc(studentId).size();
        return StudentProfileResponse.fromEntity(student, count);
    }

    public List<StudentProfileResponse> getAllStudents() {
        return studentRepository.findAll().stream().map(student -> {
            long count = registrationRepository.findByStudentIdOrderByRegistrationDateDesc(student.getId()).size();
            return StudentProfileResponse.fromEntity(student, count);
        }).collect(Collectors.toList());
    }

    public StudentProfileResponse updateStudentProfile(Long studentId, Student updatedData) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        if (updatedData.getFullName() != null) student.setFullName(updatedData.getFullName().trim());
        if (updatedData.getPhone() != null) student.setPhone(updatedData.getPhone().trim());
        if (updatedData.getDepartment() != null) student.setDepartment(updatedData.getDepartment().trim());
        if (updatedData.getYearOfStudy() != null) student.setYearOfStudy(updatedData.getYearOfStudy().trim());

        Student saved = studentRepository.save(student);
        long count = registrationRepository.findByStudentIdOrderByRegistrationDateDesc(studentId).size();
        return StudentProfileResponse.fromEntity(saved, count);
    }
}

