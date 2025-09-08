package com.cvemind.cvemind_backend.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.cvemind.cvemind_backend.dto.CveDto;
import com.cvemind.cvemind_backend.entity.CveEntity;
import com.cvemind.cvemind_backend.utils.CveMapper;

@Service
public class NVDService {
    private final WebClient webClient;
    private final Logger logger = LoggerFactory.getLogger(NVDService.class);

    public NVDService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://services.nvd.nist.gov/rest/json/cves/2.0").build();
    }

    public List<CveDto> fetchCveByKeyword(String keyword) {
        @SuppressWarnings("rawtypes")
        Map response = this.webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("keywordSearch", keyword)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        
        return mapResponseToDtos(response);
    }

    public CveDto fetchCVEById(String cveId) {
        @SuppressWarnings("rawtypes")
        Map response = this.webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("cveId", cveId)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return mapSingleToDto(response);
    }

    private List<CveDto> mapResponseToDtos(@SuppressWarnings("rawtypes") Map response) {
        logger.debug("Mapping NVD response to DTOs");
        
        List<CveDto> dtos = new ArrayList<>();
        if (response == null) {
            logger.warn("Received null response from NVD");
            return dtos;
        }
        
        if (!response.containsKey("vulnerabilities")) {
            logger.warn("No 'vulnerabilities' key found in NVD response");
            return dtos;
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> vulns = (List<Map<String, Object>>) response.get("vulnerabilities");
        logger.debug("Processing {} vulnerabilities from NVD response", vulns.size());
        
        int successCount = 0;
        int errorCount = 0;
        
        for (Map<String, Object> vuln : vulns) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> cveWrapper = (Map<String, Object>) vuln.get("cve");
                if (cveWrapper != null) {
                    String cveId = (String) cveWrapper.get("id");
                    logger.debug("Processing CVE: {}", cveId);
                    
                    String rawJson = toJsonString(cveWrapper);
                    CveEntity entity = extractEntityFromMap(cveWrapper);
                    
                    // Create DTO with rawJson for AI processing
                    CveDto dto = CveMapper.toDtoWithReferences(entity, rawJson);
                    dtos.add(dto);
                    
                    successCount++;
                    logger.debug("Successfully processed CVE: {}", cveId);
                } else {
                    logger.warn("CVE wrapper is null in vulnerability entry");
                    errorCount++;
                }
            } catch (Exception e) {
                errorCount++;
                logger.warn("Error processing vulnerability entry: {}", e.getMessage(), e);
            }
        }
        
        logger.info("Mapped {} CVEs successfully, {} errors encountered", successCount, errorCount);
        return dtos;
    }

    private CveDto mapSingleToDto(@SuppressWarnings("rawtypes") Map response) {
        logger.debug("Mapping single CVE from NVD response");
        
        if (response == null) {
            logger.warn("Received null response from NVD");
            return null;
        }
        
        if (!response.containsKey("vulnerabilities")) {
            logger.warn("No 'vulnerabilities' key found in NVD response");
            return null;
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> vulns = (List<Map<String, Object>>) response.get("vulnerabilities");
        if (vulns.isEmpty()) {
            logger.warn("Empty vulnerabilities list in NVD response");
            return null;
        }

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> cveWrapper = (Map<String, Object>) vulns.get(0).get("cve");
            if (cveWrapper == null) {
                logger.warn("CVE wrapper is null in vulnerability entry");
                return null;
            }

            String cveId = (String) cveWrapper.get("id");
            logger.debug("Processing single CVE: {}", cveId);
            
            String rawJson = toJsonString(cveWrapper);
            CveEntity entity = extractEntityFromMap(cveWrapper);
            
            // Create DTO with rawJson for AI processing
            CveDto dto = CveMapper.toDtoWithReferences(entity, rawJson);
            
            logger.debug("Successfully processed single CVE: {}", cveId);
            return dto;
            
        } catch (Exception e) {
            logger.error("Error mapping single CVE: {}", e.getMessage(), e);
            return null;
        }
    }

    private CveEntity extractEntityFromMap(Map<String, Object> cveWrapper) {
        CveEntity entity = new CveEntity();
        logger.debug("Extracting entity data for CVE: {}", cveWrapper.get("id"));

        // ID
        String id = (String) cveWrapper.get("id");
        entity.setId(id);
        logger.debug("Set CVE ID: {}", id);

        try {
            // Description (pick English if multiple exist)
            String description = "";
            @SuppressWarnings("unchecked")
            Map<String, Object> descriptions = (Map<String, Object>) ((List<?>) cveWrapper.get("descriptions")).get(0);
            if (descriptions != null) {
                description = (String) descriptions.get("value");
            }
            entity.setDescription(description);
            logger.debug("Set description for CVE {}: {} characters", id, description.length());
        } catch (Exception e) {
            logger.warn("Failed to extract description for CVE {}: {}", id, e.getMessage());
            entity.setDescription("");
        }

        // Severity (extract CVSS base severity if available)
        String severity = "UNKNOWN";
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> metrics = (Map<String, Object>) ((Map<?, ?>) cveWrapper.get("metrics")).get("cvssMetricV31");
            if (metrics != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> firstMetric = (Map<String, Object>) ((List<?>) metrics).get(0);
                @SuppressWarnings("unchecked")
                Map<String, Object> cvssData = (Map<String, Object>) firstMetric.get("cvssData");
                severity = (String) cvssData.get("baseSeverity");
            }
            entity.setSeverity(severity);
            logger.debug("Set severity for CVE {}: {}", id, severity);
        } catch (Exception e) {
            logger.warn("Failed to extract severity for CVE {}: {}", id, e.getMessage());
            entity.setSeverity("UNKNOWN");
        }

        try {
            String publishedStr = (String) cveWrapper.get("published");
            if (publishedStr != null) {
                // Convert to Instant
                Instant publishedDate = Instant.parse(publishedStr);
                entity.setPublishedDate(publishedDate);
                logger.debug("Set published date for CVE {}: {}", id, publishedDate);
            }
        } catch (Exception e) {
            logger.warn("Failed to parse published date for CVE {}: {}", id, e.getMessage());
            entity.setPublishedDate(null);
        }

        return entity;
    }

    private String toJsonString(Object obj) {
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }
}
