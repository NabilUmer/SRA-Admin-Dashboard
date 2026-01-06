package com.nabil.sra.service;

import com.nabil.sra.exception.PolicyViolationException;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;

@Service
public class PolicyEngineService {
    public void validateBookingPolicy(OffsetDateTime start) {
        // Rule: Bookings must be made 12 hours in advance
        if (start.isBefore(OffsetDateTime.now().plusHours(12))) {
            throw new PolicyViolationException("Policy Violation: Bookings must be made 12 hours in advance.");
        }
    }
}
