package com.nabil.sra.dto;

import java.time.OffsetDateTime;

public class BookingResponseDTO {
    private Long id;
    private Long resourceId;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private String status;

    public BookingResponseDTO(Long id, Long resourceId, OffsetDateTime startTime, OffsetDateTime endTime, String status) {
        this.id = id;
        this.resourceId = resourceId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    public Long getId() { return id; }
    public Long getResourceId() { return resourceId; }
    public OffsetDateTime getStartTime() { return startTime; }
    public OffsetDateTime getEndTime() { return endTime; }
    public String getStatus() { return status; }
}
