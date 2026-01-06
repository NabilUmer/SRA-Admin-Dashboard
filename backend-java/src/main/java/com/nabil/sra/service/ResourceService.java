package com.nabil.sra.service;

import com.nabil.sra.dto.ResourceRequest;
import com.nabil.sra.dto.PatchResourceRequest;

import com.nabil.sra.repository.ResourceRepository;
import com.nabil.sra.entity.ResourceEntity;
import com.nabil.sra.exception.ResourceNotFoundException;
import com.nabil.sra.exception.WriteConflictException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository repo;

    public ResourceService(ResourceRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<ResourceEntity> list() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public ResourceEntity get(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("resource " + id + " not found"));
    }

    @Transactional
    public ResourceEntity create(ResourceRequest req) {
        ResourceEntity e = new ResourceEntity();
        e.setName(req.getName());
        e.setQuantity(req.getQuantity());
        return repo.save(e);
    }

    @Transactional
    public ResourceEntity replace(Long id, ResourceRequest req) {
        ResourceEntity e = get(id);
        e.setName(req.getName());
        e.setQuantity(req.getQuantity());
        return repo.save(e);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("resource " + id + " not found");
        }
        repo.deleteById(id);
    }

    // --- PATCH ---
    @Transactional
    public ResourceEntity patch(Long id, PatchResourceRequest req) {
        ResourceEntity e = get(id);

        if (req.getVersion() == null) {
            throw new WriteConflictException("version required");
        }
        if (!req.getVersion().equals(e.getVersion())) {
            throw new WriteConflictException("stale version: expected " + e.getVersion() + " but got " + req.getVersion());
        }

        if (req.getName() != null) {
            e.setName(req.getName());
        }
        if (req.getQuantity() != null) {
            e.setQuantity(req.getQuantity());
        }

        return repo.save(e);
    }
}
