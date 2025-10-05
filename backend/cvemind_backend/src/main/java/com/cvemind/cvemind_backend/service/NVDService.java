package com.cvemind.cvemind_backend.service;

import java.time.Instant;
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
    private final Logger logger = LoggerFactory.getLogger(NVDService.class);

    public NVDService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://services.nvd.nist.gov/rest/json/cves/2.0")
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024)) // 10MB
                .build();
        this.objectMapper = new ObjectMapper();
        logger.info("NVDService initialized with base URL: https://services.nvd.nist.gov/rest/json/cves/2.0");
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
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> metrics = (Map<String, Object>) cveWrapper.get("metrics");
            if (metrics != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> cvssMetrics = (List<Map<String, Object>>) metrics.get("cvssMetricV31");
                if (cvssMetrics != null && !cvssMetrics.isEmpty()) {
                    Map<String, Object> firstMetric = cvssMetrics.get(0);
                    @SuppressWarnings("unchecked")
                    Map<String, Object> cvssData = (Map<String, Object>) firstMetric.get("cvssData");
                    if (cvssData != null) {
                        severity = (String) cvssData.get("baseSeverity");
                    }
                }
            }
            entity.setSeverity(severity != null ? severity : "UNKNOWN");
            logger.debug("Set severity for CVE {}: {}", id, severity);
        } catch (Exception e) {
            logger.warn("Failed to extract severity for CVE {}: {}", id, e.getMessage());
            entity.setSeverity("UNKNOWN");
        }

        try {
            String publishedStr = (String) cveWrapper.get("published");
            if (publishedStr != null) {
                // Handle timestamp with milliseconds: 2024-04-09T17:15:42.823
                // Remove the milliseconds part and parse as Instant
                if (publishedStr.contains(".")) {
                    publishedStr = publishedStr.substring(0, publishedStr.lastIndexOf('.')) + "Z";
                } else if (!publishedStr.endsWith("Z")) {
                    publishedStr += "Z";
                }
                Instant publishedDate = Instant.parse(publishedStr);
                entity.setPublishedDate(publishedDate);
                logger.debug("Set published date for CVE {}: {}", id, publishedDate);
            }
        } catch (Exception e) {
            logger.warn("Failed to parse published date for CVE {}: {}", id, e.getMessage());
            entity.setPublishedDate(null);
        }

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
