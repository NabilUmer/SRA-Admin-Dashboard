package com.nabil.sra.controller;
import com.nabil.sra.dto.*;
import com.nabil.sra.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    private final BookingService service;
    public BookingController(BookingService service) { this.service = service; }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponseDTO create(@RequestBody BookingRequestDTO req) { return service.createBooking(req); }
    @GetMapping
    public List<BookingResponseDTO> getAll() { return service.getAllBookings(); }
}
