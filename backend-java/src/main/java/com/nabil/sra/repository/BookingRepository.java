package com.nabil.sra.repository;
import com.nabil.sra.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {
    @Query("SELECT COUNT(b) > 0 FROM BookingEntity b WHERE b.resource.id = :resId " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    boolean existsConflict(@Param("resId") Long resId, @Param("startTime") OffsetDateTime startTime, @Param("endTime") OffsetDateTime endTime);
}
