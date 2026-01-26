package com.nabil.sra.service;
import com.nabil.sra.dto.*;
import com.nabil.sra.entity.BookingEntity;
import com.nabil.sra.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private final BookingRepository bookingRepo;
    private final ResourceRepository resRepo;
    public BookingService(BookingRepository bookingRepo, ResourceRepository resRepo) {
        this.bookingRepo = bookingRepo;
        this.resRepo = resRepo;
    }
    public BookingResponseDTO createBooking(BookingRequestDTO req) {
        if (bookingRepo.existsConflict(req.getResourceId(), req.getStartTime(), req.getEndTime())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Resource already booked.");
        }
        var resource = resRepo.findById(req.getResourceId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        BookingEntity booking = new BookingEntity();
        booking.setResource(resource);
        booking.setStartTime(req.getStartTime());
        booking.setEndTime(req.getEndTime());
        BookingEntity saved = bookingRepo.save(booking);
        return new BookingResponseDTO(saved.getId(), saved.getResource().getId(), saved.getStartTime(), saved.getEndTime(), "CONFIRMED");
    }
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepo.findAll().stream().map(b -> new BookingResponseDTO(b.getId(), b.getResource().getId(), b.getStartTime(), b.getEndTime(), "CONFIRMED")).collect(Collectors.toList());
    }
}
