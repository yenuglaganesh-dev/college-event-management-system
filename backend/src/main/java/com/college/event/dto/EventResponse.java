package com.college.event.dto;

import com.college.event.entity.Event;
import com.college.event.entity.EventStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EventResponse {
    private Long id;
    private String title;
    private String category;
    private String description;
    private String venue;
    private LocalDate eventDate;
    private String eventTime;
    private LocalDateTime registrationDeadline;
    private Integer maxCapacity;
    private Integer currentRegistrations;
    private EventStatus status;
    private String imageUrl;
    private String officialSource;
    private String permissionStatus;
    private boolean registrationOpen;
    private boolean full;
    private LocalDateTime createdAt;

    public EventResponse() {}

    public static EventResponse fromEntity(Event event) {
        EventResponse resp = new EventResponse();
        resp.setId(event.getId());
        resp.setTitle(event.getTitle());
        resp.setCategory(event.getCategory());
        resp.setDescription(event.getDescription());
        resp.setVenue(event.getVenue());
        resp.setEventDate(event.getEventDate());
        resp.setEventTime(event.getEventTime());
        resp.setRegistrationDeadline(event.getRegistrationDeadline());
        resp.setMaxCapacity(event.getMaxCapacity());
        resp.setCurrentRegistrations(event.getCurrentRegistrations());
        resp.setStatus(event.getStatus());
        resp.setImageUrl(event.getImageUrl());
        resp.setOfficialSource(event.getOfficialSource());
        resp.setPermissionStatus(event.getPermissionStatus());
        resp.setCreatedAt(event.getCreatedAt());

        boolean notExpired = LocalDateTime.now().isBefore(event.getRegistrationDeadline());
        boolean hasCapacity = event.getCurrentRegistrations() < event.getMaxCapacity();
        boolean isActive = event.getStatus() == EventStatus.ACTIVE;

        resp.setRegistrationOpen(isActive && notExpired && hasCapacity);
        resp.setFull(!hasCapacity);
        return resp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public String getEventTime() { return eventTime; }
    public void setEventTime(String eventTime) { this.eventTime = eventTime; }

    public LocalDateTime getRegistrationDeadline() { return registrationDeadline; }
    public void setRegistrationDeadline(LocalDateTime registrationDeadline) { this.registrationDeadline = registrationDeadline; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public Integer getCurrentRegistrations() { return currentRegistrations; }
    public void setCurrentRegistrations(Integer currentRegistrations) { this.currentRegistrations = currentRegistrations; }

    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getOfficialSource() { return officialSource; }
    public void setOfficialSource(String officialSource) { this.officialSource = officialSource; }

    public String getPermissionStatus() { return permissionStatus; }
    public void setPermissionStatus(String permissionStatus) { this.permissionStatus = permissionStatus; }

    public boolean isRegistrationOpen() { return registrationOpen; }
    public void setRegistrationOpen(boolean registrationOpen) { this.registrationOpen = registrationOpen; }

    public boolean isFull() { return full; }
    public void setFull(boolean full) { this.full = full; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

