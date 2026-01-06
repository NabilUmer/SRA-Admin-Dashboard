package com.nabil.sra.service;

import com.nabil.sra.dto.BookingRequestDTO;
import com.nabil.sra.dto.BookingResponseDTO;
import com.nabil.sra.entity.BookingEntity;
import com.nabil.sra.repository.BookingRepository;
import com.nabil.sra.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRepository bookingRepository, ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
    }

    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        var resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        BookingEntity booking = new BookingEntity();
        booking.setResource(resource);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        
        BookingEntity saved = bookingRepository.save(booking);
        
        return new BookingResponseDTO(
            saved.getId(),
            saved.getResource().getId(),
            saved.getStartTime(),
            saved.getEndTime(),
            "CONFIRMED"
        );
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(booking -> new BookingResponseDTO(
                    booking.getId(),
                    booking.getResource().getId(),
                    booking.getStartTime(),
                    booking.getEndTime(),
                    "CONFIRMED"
                ))
                .collect(Collectors.toList());
    }
}