package com.cvemind.cvemind_backend.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    public List<CveDto> searchCves(String keyword) {
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
                    CveEntity entity = CveMapper.toEntity(nvdCve, cveId);
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

    public List<CveDto> getAllCves() {
        logger.debug("Fetching all CVEs from local database");
        
        try {
            List<CveEntity> allCves = cveRepository.findAll();
            logger.info("Retrieved {} CVEs from local database", allCves.size());
            return allCves.stream().map(CveMapper::toDto).toList();
            
        } catch (Exception e) {
            logger.error("Error fetching all CVEs: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch all CVEs", e);
        }
    }
}
