package com.cvemind.cvemind_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.cvemind.cvemind_backend.entity.CveEntity;
import com.cvemind.cvemind_backend.repository.CveRepository;

@Service
public class CveDataService {
    private final CveRepository cveRepository;

    public CveDataService(CveRepository cveRepository) {
        this.cveRepository = cveRepository;
    }

    public Optional<CveEntity> getCveById(String cveId) {
        return cveRepository.findById(cveId);
    }

    public List<CveEntity> searchByKeyword(String keyword) {
        return cveRepository.findByDescriptionContainingIgnoreCase(keyword);
    }

    public List<CveEntity> searchBySeverity(String severity) {
        return cveRepository.findBySeverityIgnoreCase(severity);
    }

    public CveEntity saveCVE(CveEntity entity) {
        return cveRepository.save(entity);
    }

    @Cacheable(value = "latestCVEs")
    public List<CveEntity> getLatestCves() {
        return cveRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getPublishedDate().compareTo(a.getPublishedDate()))
                .limit(20)
                .toList();
    }
}
