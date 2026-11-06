package com.college.event.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_gallery")
public class EventGallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 255)
    private String caption;

    @Column(nullable = false, length = 50)
    private String category = "General";

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "official_source", length = 500)
    private String officialSource;

    @Column(name = "permission_status", length = 50)
    private String permissionStatus = "VERIFIED_OFFICIAL_CUTMAP";

    @Column(name = "event_date", length = 50)
    private String eventDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public EventGallery() {}

    public EventGallery(Long eventId, String imageUrl, String title, String caption, String category, Integer displayOrder) {
        this.eventId = eventId;
        this.imageUrl = imageUrl;
        this.title = title;
        this.caption = caption;
        this.category = category != null ? category : "General";
        this.displayOrder = displayOrder != null ? displayOrder : 0;
        this.createdAt = LocalDateTime.now();
    }

    public EventGallery(Long eventId, String imageUrl, String title, String caption, String category, Integer displayOrder, String officialSource, String permissionStatus, String eventDate) {
        this.eventId = eventId;
        this.imageUrl = imageUrl;
        this.title = title;
        this.caption = caption;
        this.category = category != null ? category : "General";
        this.displayOrder = displayOrder != null ? displayOrder : 0;
        this.officialSource = officialSource;
        this.permissionStatus = permissionStatus;
        this.eventDate = eventDate;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public String getOfficialSource() { return officialSource; }
    public void setOfficialSource(String officialSource) { this.officialSource = officialSource; }

    public String getPermissionStatus() { return permissionStatus; }
    public void setPermissionStatus(String permissionStatus) { this.permissionStatus = permissionStatus; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

