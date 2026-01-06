package com.nabil.sra.repository;

import com.nabil.sra.entity.ResourceEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<ResourceEntity, Long> {
}
