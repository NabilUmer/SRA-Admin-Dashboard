package com.nabil.sra.dto;

import java.time.OffsetDateTime;

public class BookingRequestDTO {
    private Long resourceId;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;

    // IMPORTANT: Empty constructor for JSON mapping
    public BookingRequestDTO() {}

    // Getters and Setters
    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }

    public OffsetDateTime getStartTime() { return startTime; }
    public void setStartTime(OffsetDateTime startTime) { this.startTime = startTime; }

    public OffsetDateTime getEndTime() { return endTime; }
    public void setEndTime(OffsetDateTime endTime) { this.endTime = endTime; }
}