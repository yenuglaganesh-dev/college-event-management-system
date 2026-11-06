package com.college.event.repository;

import com.college.event.entity.Organizer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizerRepository extends JpaRepository<Organizer, Long> {
    Optional<Organizer> findByUsername(String username);
    Optional<Organizer> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}

