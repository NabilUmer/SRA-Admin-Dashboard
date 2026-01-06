package com.nabil.sra.controller;

import com.nabil.sra.service.ResourceService;
import com.nabil.sra.entity.ResourceEntity;
import com.nabil.sra.dto.ResourceRequest;
import com.nabil.sra.dto.PatchResourceRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // Unlocks the "Security Gate"
@RestController
@RequestMapping("/resources")
public class ResourceController {
    private final ResourceService service;

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    @GetMapping
    public List<ResourceEntity> list() { return service.list(); }
    @DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id); // Ensure your ResourceService has a delete(id) method
    return ResponseEntity.noContent().build();
}

    @PostMapping
    public ResponseEntity<ResourceEntity> create(@Valid @RequestBody ResourceRequest req) {
        ResourceEntity e = service.create(req);
        return ResponseEntity.created(URI.create("/resources/" + e.getId())).body(e);
    }
}