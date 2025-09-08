package com.cvemind.cvemind_backend.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.cvemind.cvemind_backend.dto.CveDto;
import com.cvemind.cvemind_backend.entity.CveEntity;
import com.cvemind.cvemind_backend.utils.CveMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class NVDService {
    
    private static final Logger logger = LoggerFactory.getLogger(NVDService.class);
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public NVDService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://services.nvd.nist.gov/rest/json/cves/2.0")
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024)) // 10MB
                .build();
        this.objectMapper = new ObjectMapper();
        logger.info("NVDService initialized with base URL: https://services.nvd.nist.gov/rest/json/cves/2.0");
    }

    public List<CveDto> fetchCveByKeyword(String keyword) {
        logger.info("Fetching CVEs by keyword: {}", keyword);
        long startTime = System.currentTimeMillis();
        
        try {
            @SuppressWarnings("rawtypes")
            Map response = this.webClient.get()
                    .uri(uriBuilder -> {
                        String uri = uriBuilder
                                .queryParam("keywordSearch", keyword)
                                .build()
                                .toString();
                        logger.debug("Making request to NVD API: {}", uri);
                        return uriBuilder
                                .queryParam("keywordSearch", keyword)
                                .build();
                    })
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();
            
            List<CveDto> results = mapResponseToDtos(response);
            long duration = System.currentTimeMillis() - startTime;
            
            logger.info("Successfully fetched {} CVEs for keyword '{}' in {}ms", 
                       results.size(), keyword, duration);
            
            return results;
            
        } catch (WebClientResponseException e) {
            long duration = System.currentTimeMillis() - startTime;
            logger.error("HTTP error fetching CVEs by keyword '{}' after {}ms: Status={}, Body={}", 
                        keyword, duration, e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to fetch CVEs from NVD: " + e.getMessage(), e);
            
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            logger.error("Error fetching CVEs by keyword '{}' after {}ms: {}", 
                        keyword, duration, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch CVEs from NVD", e);
        }
    }

    public CveDto fetchCVEById(String cveId) {
        logger.info("Fetching CVE by ID: {}", cveId);
        long startTime = System.currentTimeMillis();
        
        try {
            @SuppressWarnings("rawtypes")
            Map response = this.webClient.get()
                    .uri(uriBuilder -> {
                        String uri = uriBuilder
                                .queryParam("cveId", cveId)
                                .build()
                                .toString();
                        logger.debug("Making request to NVD API: {}", uri);
                        return uriBuilder
                                .queryParam("cveId", cveId)
                                .build();
                    })
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            CveDto result = mapSingleToDto(response);
            long duration = System.currentTimeMillis() - startTime;
            
            if (result != null) {
                logger.info("Successfully fetched CVE '{}' in {}ms", cveId, duration);
            } else {
                logger.warn("CVE '{}' not found after {}ms", cveId, duration);
            }
            
            return result;
            
        } catch (WebClientResponseException e) {
            long duration = System.currentTimeMillis() - startTime;
            logger.error("HTTP error fetching CVE '{}' after {}ms: Status={}, Body={}", 
                        cveId, duration, e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to fetch CVE from NVD: " + e.getMessage(), e);
            
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            logger.error("Error fetching CVE '{}' after {}ms: {}", 
                        cveId, duration, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch CVE from NVD", e);
        }
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
                    CveEntity entity = extractEntityFromMap(cveWrapper, rawJson);
                    dtos.add(CveMapper.toDto(entity));
                    
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
            CveEntity entity = extractEntityFromMap(cveWrapper, rawJson);
            
            logger.debug("Successfully processed single CVE: {}", cveId);
            return CveMapper.toDto(entity);
            
        } catch (Exception e) {
            logger.error("Error mapping single CVE: {}", e.getMessage(), e);
            return null;
        }
    }

    private CveEntity extractEntityFromMap(Map<String, Object> cveWrapper, String rawJson) {
        String cveId = (String) cveWrapper.get("id");
        logger.debug("Extracting entity data for CVE: {}", cveId);
        
        CveEntity entity = new CveEntity();

        // ID
        entity.setId(cveId);
        logger.debug("Set CVE ID: {}", cveId);

        // Description (pick English if multiple exist)
        try {
            String description = extractDescription(cveWrapper);
            entity.setDescription(description);
            logger.debug("Set description for CVE {}: {} characters", cveId, description.length());
        } catch (Exception e) {
            logger.warn("Failed to extract description for CVE {}: {}", cveId, e.getMessage());
            entity.setDescription("");
        }

        // Severity (extract CVSS base severity if available)
        try {
            String severity = extractSeverity(cveWrapper);
            entity.setSeverity(severity);
            logger.debug("Set severity for CVE {}: {}", cveId, severity);
        } catch (Exception e) {
            logger.warn("Failed to extract severity for CVE {}: {}", cveId, e.getMessage());
            entity.setSeverity("UNKNOWN");
        }

        // Published date
        try {
            String publishedStr = (String) cveWrapper.get("published");
            if (publishedStr != null) {
                // Parse ISO date format: 2023-01-01T00:00:00.000
                LocalDateTime publishedDate = LocalDateTime.parse(publishedStr.substring(0, 19));
                entity.setPublishedDate(publishedDate.atZone(java.time.ZoneId.systemDefault()).toInstant());
                logger.debug("Set published date for CVE {}: {}", cveId, publishedDate);
            }
        } catch (Exception e) {
            logger.warn("Failed to parse published date for CVE {}: {}", cveId, e.getMessage());
            entity.setPublishedDate(null);
        }

        // Raw JSON
        entity.setRawJson(rawJson);
        logger.debug("Set raw JSON for CVE {}: {} characters", cveId, rawJson.length());

        logger.debug("Successfully extracted all available data for CVE: {}", cveId);
        return entity;
    }

    @SuppressWarnings("unchecked")
    private String extractDescription(Map<String, Object> cveWrapper) {
        List<Map<String, Object>> descriptions = (List<Map<String, Object>>) cveWrapper.get("descriptions");
        if (descriptions == null || descriptions.isEmpty()) {
            logger.debug("No descriptions found in CVE data");
            return "";
        }

        // Try to find English description first
        Optional<Map<String, Object>> englishDesc = descriptions.stream()
                .filter(desc -> "en".equals(desc.get("lang")))
                .findFirst();

        if (englishDesc.isPresent()) {
            String description = (String) englishDesc.get().get("value");
            logger.debug("Found English description: {} characters", description.length());
            return description;
        } else {
            // Fallback to first available description
            String description = (String) descriptions.get(0).get("value");
            String lang = (String) descriptions.get(0).get("lang");
            logger.debug("Using fallback description in language '{}': {} characters", lang, description.length());
            return description;
        }
    }

    @SuppressWarnings("unchecked")
    private String extractSeverity(Map<String, Object> cveWrapper) {
        Map<String, Object> metrics = (Map<String, Object>) cveWrapper.get("metrics");
        if (metrics == null) {
            logger.debug("No metrics found in CVE data");
            return "UNKNOWN";
        }

        // Try CVSS v3.1 first
        if (metrics.containsKey("cvssMetricV31")) {
            List<Map<String, Object>> cvssMetrics = (List<Map<String, Object>>) metrics.get("cvssMetricV31");
            if (cvssMetrics != null && !cvssMetrics.isEmpty()) {
                Map<String, Object> firstMetric = cvssMetrics.get(0);
                Map<String, Object> cvssData = (Map<String, Object>) firstMetric.get("cvssData");
                if (cvssData != null) {
                    String severity = (String) cvssData.get("baseSeverity");
                    logger.debug("Found CVSS v3.1 severity: {}", severity);
                    return severity != null ? severity : "UNKNOWN";
                }
            }
        }

        // Try CVSS v3.0 as fallback
        if (metrics.containsKey("cvssMetricV30")) {
            List<Map<String, Object>> cvssMetrics = (List<Map<String, Object>>) metrics.get("cvssMetricV30");
            if (cvssMetrics != null && !cvssMetrics.isEmpty()) {
                Map<String, Object> firstMetric = cvssMetrics.get(0);
                Map<String, Object> cvssData = (Map<String, Object>) firstMetric.get("cvssData");
                if (cvssData != null) {
                    String severity = (String) cvssData.get("baseSeverity");
                    logger.debug("Found CVSS v3.0 severity: {}", severity);
                    return severity != null ? severity : "UNKNOWN";
                }
            }
        }

        logger.debug("No CVSS severity found in metrics");
        return "UNKNOWN";
    }

    private String toJsonString(Object obj) {
        try {
            String json = objectMapper.writeValueAsString(obj);
            logger.debug("Successfully converted object to JSON: {} characters", json.length());
            return json;
        } catch (Exception e) {
            logger.error("Error converting object to JSON: {}", e.getMessage(), e);
            return "{}";
        }
    }
}
