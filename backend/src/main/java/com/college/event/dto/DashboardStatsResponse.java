package com.college.event.dto;

import java.util.List;

public class DashboardStatsResponse {
    private long totalEvents;
    private long activeEvents;
    private long totalStudents;
    private long totalRegistrations;
    private long pendingRegistrations;
    private long approvedRegistrations;
    private long rejectedRegistrations;
    private long cancelledRegistrations;
    private List<RegistrationResponse> recentRegistrations;

    public DashboardStatsResponse() {}

    public long getTotalEvents() { return totalEvents; }
    public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }

    public long getActiveEvents() { return activeEvents; }
    public void setActiveEvents(long activeEvents) { this.activeEvents = activeEvents; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalRegistrations() { return totalRegistrations; }
    public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }

    public long getPendingRegistrations() { return pendingRegistrations; }
    public void setPendingRegistrations(long pendingRegistrations) { this.pendingRegistrations = pendingRegistrations; }

    public long getApprovedRegistrations() { return approvedRegistrations; }
    public void setApprovedRegistrations(long approvedRegistrations) { this.approvedRegistrations = approvedRegistrations; }

    public long getRejectedRegistrations() { return rejectedRegistrations; }
    public void setRejectedRegistrations(long rejectedRegistrations) { this.rejectedRegistrations = rejectedRegistrations; }

    public long getCancelledRegistrations() { return cancelledRegistrations; }
    public void setCancelledRegistrations(long cancelledRegistrations) { this.cancelledRegistrations = cancelledRegistrations; }

    public List<RegistrationResponse> getRecentRegistrations() { return recentRegistrations; }
    public void setRecentRegistrations(List<RegistrationResponse> recentRegistrations) { this.recentRegistrations = recentRegistrations; }
}

