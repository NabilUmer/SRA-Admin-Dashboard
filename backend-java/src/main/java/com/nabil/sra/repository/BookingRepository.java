package com.nabil.sra.repository;

import com.nabil.sra.entity.BookingEntity; // Required: Points to your entity folder
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // Required for Spring to find this bean
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {
    
    // This allows you to find all bookings for a specific room or tool
    List<BookingEntity> findByResourceId(Long resourceId);
}
