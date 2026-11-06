package com.college.event.repository;

import com.college.event.entity.Event;
import com.college.event.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatusOrderByEventDateAsc(EventStatus status);
    List<Event> findAllByOrderByEventDateDesc();
    List<Event> findByCategoryIgnoreCase(String category);

    @Query("SELECT e FROM Event e WHERE " +
           "(:category IS NULL OR LOWER(e.category) = LOWER(:category)) AND " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(e.venue) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY e.eventDate ASC")
    List<Event> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("status") EventStatus status
    );

    long countByStatus(EventStatus status);
    long countByEventDateGreaterThanEqual(LocalDate date);
}

