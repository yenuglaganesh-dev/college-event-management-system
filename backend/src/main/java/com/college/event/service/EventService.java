package com.college.event.service;

import com.college.event.dto.EventRequest;
import com.college.event.dto.EventResponse;
import com.college.event.entity.Event;
import com.college.event.entity.EventStatus;
import com.college.event.exception.BadRequestException;
import com.college.event.exception.ResourceNotFoundException;
import com.college.event.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateDesc().stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getActiveEvents() {
        return eventRepository.findByStatusOrderByEventDateAsc(EventStatus.ACTIVE).stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        return EventResponse.fromEntity(event);
    }

    public List<EventResponse> searchAndFilterEvents(String keyword, String category, EventStatus status) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanCategory = (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) ? category.trim() : null;

        return eventRepository.searchAndFilter(cleanKeyword, cleanCategory, status).stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventResponse createEvent(EventRequest req) {
        if (req.getMaxCapacity() == null || req.getMaxCapacity() <= 0) {
            throw new BadRequestException("Capacity must be at least 1");
        }

        Event event = new Event(
                req.getTitle().trim(),
                req.getCategory().trim(),
                req.getDescription().trim(),
                req.getVenue().trim(),
                req.getEventDate(),
                req.getEventTime().trim(),
                req.getRegistrationDeadline(),
                req.getMaxCapacity(),
                req.getImageUrl()
        );

        if (req.getStatus() != null) {
            event.setStatus(req.getStatus());
        }

        Event saved = eventRepository.save(event);
        return EventResponse.fromEntity(saved);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest req) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (req.getMaxCapacity() < event.getCurrentRegistrations()) {
            throw new BadRequestException("Cannot set capacity lower than current registered participants (" + event.getCurrentRegistrations() + ")");
        }

        event.setTitle(req.getTitle().trim());
        event.setCategory(req.getCategory().trim());
        event.setDescription(req.getDescription().trim());
        event.setVenue(req.getVenue().trim());
        event.setEventDate(req.getEventDate());
        event.setEventTime(req.getEventTime().trim());
        event.setRegistrationDeadline(req.getRegistrationDeadline());
        event.setMaxCapacity(req.getMaxCapacity());
        if (req.getStatus() != null) {
            event.setStatus(req.getStatus());
        }
        if (req.getImageUrl() != null) {
            event.setImageUrl(req.getImageUrl());
        }

        Event updated = eventRepository.save(event);
        return EventResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with ID: " + id);
        }
        eventRepository.deleteById(id);
    }
}

