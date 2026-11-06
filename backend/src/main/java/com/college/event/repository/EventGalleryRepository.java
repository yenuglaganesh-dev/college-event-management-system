package com.college.event.repository;

import com.college.event.entity.EventGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventGalleryRepository extends JpaRepository<EventGallery, Long> {
    List<EventGallery> findAllByOrderByDisplayOrderAscCreatedAtDesc();
    List<EventGallery> findByCategoryOrderByDisplayOrderAscCreatedAtDesc(String category);
    List<EventGallery> findByEventId(Long eventId);
}

