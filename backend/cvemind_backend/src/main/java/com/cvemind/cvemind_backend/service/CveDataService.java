package com.cvemind.cvemind_backend.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.cvemind.cvemind_backend.dto.CveDto;
import com.cvemind.cvemind_backend.entity.CveEntity;
import com.cvemind.cvemind_backend.repository.CveRepository;
import com.cvemind.cvemind_backend.utils.CveMapper;

@Service
public class CveDataService {
    
    private static final Logger logger = LoggerFactory.getLogger(CveDataService.class);
    
    private final CveRepository cveRepository;
    private final NVDService nvdService;

    public CveDataService(CveRepository cveRepository, NVDService nvdService) {
        this.cveRepository = cveRepository;
        this.nvdService = nvdService;
        logger.info("CveDataService initialized successfully");
    }

    public CveDto getCveById(String cveId) {
        logger.debug("Fetching CVE by ID: {}", cveId);
        
        try {
            // Check local database first
            Optional<CveEntity> localCve = cveRepository.findById(cveId);
            if (localCve.isPresent()) {
                logger.debug("Found CVE {} in local database", cveId);
                return CveMapper.toDto(localCve.get());
            }

            // If not found locally, fetch from NVD
            logger.info("CVE {} not found locally, fetching from NVD", cveId);
            CveDto nvdCve = nvdService.fetchCVEById(cveId);
            
            if (nvdCve != null) {
                // Save to database
                try {
                    CveEntity entity = CveMapper.toEntity(nvdCve, nvdCve.getRawJson());
                    cveRepository.save(entity);
                    logger.debug("Saved CVE {} to local database", cveId);
                } catch (Exception e) {
                    logger.warn("Failed to save CVE {} to database: {}", cveId, e.getMessage());
                }
                
                logger.info("Successfully fetched CVE {} from NVD", cveId);
                return nvdCve;
            } else {
                logger.warn("CVE {} not found in NVD", cveId);
                return null;
            }
            
        } catch (Exception e) {
            logger.error("Error fetching CVE {}: {}", cveId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch CVE", e);
        }
    }

    public List<CveDto> searchByKeyword(String keyword) {
        logger.debug("Searching CVEs with keyword: {}", keyword);
        
        try {
            // First check local database
            List<CveEntity> localCves = cveRepository.findByDescriptionContainingIgnoreCase(keyword);
            logger.debug("Found {} CVEs in local database for keyword: {}", localCves.size(), keyword);
            
            if (!localCves.isEmpty()) {
                logger.info("Returning {} CVEs from local database for keyword: {}", localCves.size(), keyword);
                return localCves.stream().map(CveMapper::toDto).toList();
            }

            // If not found locally, fetch from NVD
            logger.info("No local CVEs found, fetching from NVD for keyword: {}", keyword);
            List<CveDto> nvdCves = nvdService.fetchCveByKeyword(keyword);
            
            // Save to database for future use
            nvdCves.forEach(cve -> {
                try {
                    CveEntity entity = CveMapper.toEntity(cve, cve.getRawJson());
                    cveRepository.save(entity);
                    logger.debug("Saved CVE {} to local database", cve.getId());
                } catch (Exception e) {
                    logger.warn("Failed to save CVE {} to database: {}", cve.getId(), e.getMessage());
                }
            });
            
            logger.info("Successfully fetched and cached {} CVEs from NVD for keyword: {}", nvdCves.size(), keyword);
            return nvdCves;
            
        } catch (Exception e) {
            logger.error("Error searching CVEs with keyword {}: {}", keyword, e.getMessage(), e);
            throw new RuntimeException("Failed to search CVEs", e);
        }
    }


    public List<CveDto> searchBySeverity(String severity) {
        logger.debug("Searching CVEs by severity: {}", severity);
        
        try {
            List<CveEntity> entities = cveRepository.findBySeverityIgnoreCase(severity);
            List<CveDto> dtos = entities.stream().map(CveMapper::toDto).toList();
            
            logger.info("Found {} CVEs with severity: {}", dtos.size(), severity);
            return dtos;
            
        } catch (Exception e) {
            logger.error("Error searching CVEs by severity {}: {}", severity, e.getMessage(), e);
            throw new RuntimeException("Failed to search CVEs by severity", e);
        }
    }

    public CveDto saveCVE(CveDto cveDto) {
        logger.debug("Saving CVE: {}", cveDto.getId());
        
        try {
            CveEntity entity = CveMapper.toEntity(cveDto, cveDto.getRawJson());
            CveEntity savedEntity = cveRepository.save(entity);
            CveDto savedDto = CveMapper.toDto(savedEntity);
            
            logger.info("Successfully saved CVE: {}", cveDto.getId());
            return savedDto;
            
        } catch (Exception e) {
            logger.error("Error saving CVE {}: {}", cveDto.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to save CVE", e);
        }
    }

    @Cacheable(value = "latestCVEs")
    public List<CveDto> getLatestCves() {
        logger.debug("Fetching latest CVEs");
        
        try {
            List<CveEntity> entities = cveRepository.findAll()
                    .stream()
                    .filter(cve -> cve.getPublishedDate() != null)
                    .sorted((a, b) -> b.getPublishedDate().compareTo(a.getPublishedDate()))
                    .limit(20)
                    .toList();
            
            List<CveDto> dtos = entities.stream().map(CveMapper::toDto).toList();
            
            logger.info("Retrieved {} latest CVEs", dtos.size());
            return dtos;
            
        } catch (Exception e) {
            logger.error("Error fetching latest CVEs: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch latest CVEs", e);
        }
    }

    public List<CveDto> getAllCves() {
        logger.debug("Fetching all CVEs from local database");
        
        try {
            List<CveEntity> allCves = cveRepository.findAll();
            List<CveDto> dtos = allCves.stream().map(CveMapper::toDto).toList();
            
            logger.info("Retrieved {} CVEs from local database", dtos.size());
            return dtos;
            
        } catch (Exception e) {
            logger.error("Error fetching all CVEs: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch all CVEs", e);
        }
    }

    // Additional convenience methods
    public List<CveDto> searchByMultipleCriteria(String keyword, String severity) {
        logger.debug("Searching CVEs with multiple criteria - keyword: {}, severity: {}", 
                    keyword, severity);
        
        try {
            List<CveEntity> entities = cveRepository.findAll().stream()
                    .filter(cve -> keyword == null || keyword.isEmpty() || 
                                  cve.getDescription().toLowerCase().contains(keyword.toLowerCase()))
                    .filter(cve -> severity == null || severity.isEmpty() || 
                                  severity.equalsIgnoreCase(cve.getSeverity()))
                    .toList();
            
            List<CveDto> dtos = entities.stream().map(CveMapper::toDto).toList();
            
            logger.info("Found {} CVEs matching multiple criteria", dtos.size());
            return dtos;
            
        } catch (Exception e) {
            logger.error("Error searching CVEs with multiple criteria: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to search CVEs with multiple criteria", e);
        }
    }

    public long getTotalCveCount() {
        try {
            long count = cveRepository.count();
            logger.debug("Total CVE count: {}", count);
            return count;
        } catch (Exception e) {
            logger.error("Error getting CVE count: {}", e.getMessage(), e);
            return 0;
        }
    }

    public boolean cveExists(String cveId) {
        try {
            boolean exists = cveRepository.existsById(cveId);
            logger.debug("CVE {} exists in database: {}", cveId, exists);
            return exists;
        } catch (Exception e) {
            logger.error("Error checking if CVE {} exists: {}", cveId, e.getMessage(), e);
            return false;
        }
    }
}