package com.college.event.dto;

import com.college.event.entity.RegistrationStatus;
import jakarta.validation.constraints.NotNull;

public class RegistrationStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private RegistrationStatus status;

    private String remarks;

    public RegistrationStatusUpdateRequest() {}

    public RegistrationStatusUpdateRequest(RegistrationStatus status, String remarks) {
        this.status = status;
        this.remarks = remarks;
    }

    public RegistrationStatus getStatus() { return status; }
    public void setStatus(RegistrationStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

