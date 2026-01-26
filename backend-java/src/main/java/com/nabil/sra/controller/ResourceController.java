package com.nabil.sra.controller;

import com.nabil.sra.entity.ResourceEntity;
import com.nabil.sra.repository.ResourceRepository;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173")
public class ResourceController {
    private final ResourceRepository repo;

    public ResourceController(ResourceRepository repo) { this.repo = repo; }

    @GetMapping
    public List<ResourceEntity> getAll() { return repo.findAll(); }

    @PostMapping("/seed")
    public ResourceEntity seed(@RequestBody ResourceEntity resource) {
        resource.setCreatedAt(OffsetDateTime.now());
        resource.setUpdatedAt(OffsetDateTime.now());
        resource.setVersion(0L);
        return repo.save(resource);
    }
}
