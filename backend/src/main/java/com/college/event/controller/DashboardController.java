package com.college.event.controller;

import com.college.event.dto.ApiResponse;
import com.college.event.dto.DashboardStatsResponse;
import com.college.event.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getAdminStats() {
        DashboardStatsResponse stats = dashboardService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Admin dashboard statistics retrieved", stats));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getPublicStats() {
        DashboardStatsResponse stats = dashboardService.getAdminDashboardStats();
        // Hide sensitive details for public, provide counts only
        stats.setRecentRegistrations(null);
        return ResponseEntity.ok(ApiResponse.ok("Public statistics retrieved", stats));
    }
}

