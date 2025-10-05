package com.cvemind.cvemind_backend.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cvemind.cvemind_backend.dto.CveDto;
import com.cvemind.cvemind_backend.service.CveDataService;
import com.cvemind.cvemind_backend.service.GenAIService;
import com.cvemind.cvemind_backend.service.NVDService;

@RestController
@RequestMapping("/api/v1/cve")
@CrossOrigin(origins = "*")
public class CveController {

    private static final Logger logger = LoggerFactory.getLogger(CveController.class);

    private final CveDataService cveDataService;
    private final NVDService nvdService;
    private final GenAIService genAIService;

    public CveController(CveDataService cveDataService, NVDService nvdService, GenAIService genAIService) {
        this.cveDataService = cveDataService;
        this.nvdService = nvdService;
        this.genAIService = genAIService;
        logger.info("CveController initialized successfully");
    }

    // ========== CVE Search and Retrieval ==========

    @GetMapping("/search")
    public ResponseEntity<List<CveDto>> searchCves(@RequestParam String keyword) {
        logger.info("Received search request for keyword: {}", keyword);

        if (keyword == null || keyword.trim().isEmpty()) {
            logger.warn("Empty keyword provided for CVE search");
            return ResponseEntity.badRequest().build();
        }

        try {
            List<CveDto> cves = cveDataService.searchByKeyword(keyword.trim());
            logger.info("Returning {} CVEs for keyword: {}", cves.size(), keyword);
            return ResponseEntity.ok(cves);
        } catch (Exception e) {
            logger.error("Error searching CVEs with keyword {}: {}", keyword, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{cveId}")
    public ResponseEntity<CveDto> getCveById(@PathVariable String cveId) {
        logger.info("Received request for CVE: {}", cveId);

        if (cveId == null || cveId.trim().isEmpty()) {
            logger.warn("Empty CVE ID provided");
            return ResponseEntity.badRequest().build();
        }

        try {
            CveDto cve = cveDataService.getCveById(cveId.trim());
            if (cve != null) {
                logger.info("Successfully retrieved CVE: {}", cveId);
                return ResponseEntity.ok(cve);
            } else {
                logger.warn("CVE not found: {}", cveId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error retrieving CVE {}: {}", cveId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<CveDto>> getAllCves() {
        logger.info("Received request for all CVEs");

        try {
            List<CveDto> cves = cveDataService.getAllCves();
            logger.info("Returning {} CVEs from database", cves.size());
            return ResponseEntity.ok(cves);
        } catch (Exception e) {
            logger.error("Error retrieving all CVEs: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========== NVD Service Direct Access ==========

    @GetMapping("/nvd/search")
    public ResponseEntity<List<CveDto>> searchNvd(@RequestParam String keyword) {

        logger.info("Direct NVD search for keyword: {}", keyword);

        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            List<CveDto> cves = nvdService.fetchCveByKeyword(keyword.trim());
            logger.info("NVD returned {} CVEs for keyword: {}", cves.size(), keyword);
            return ResponseEntity.ok(cves);
        } catch (Exception e) {
            logger.error("Error in direct NVD search for keyword {}: {}", keyword, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/nvd/{cveId}")
    public ResponseEntity<CveDto> getCveFromNvd(@PathVariable String cveId) {
        logger.info("Direct NVD request for CVE: {}", cveId);

        try {
            CveDto cve = nvdService.fetchCVEById(cveId);
            if (cve != null) {
                return ResponseEntity.ok(cve);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error in direct NVD fetch for CVE {}: {}", cveId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========== AI Analysis Endpoints ==========

    @PostMapping("/{cveId}/summarize")
    public ResponseEntity<Map<String, String>> summarizeCve(@PathVariable String cveId) {
        logger.info("Generating AI summary for CVE: {}", cveId);

        try {
            // Use special method that gets rawJson for AI processing
            CveDto cve = cveDataService.getCveWithRawJsonForAI(cveId);
            if (cve == null) {
                logger.warn("CVE not found for summarization: {}", cveId);
                return ResponseEntity.notFound().build();
            }

            String cveDetails = formatCveForAI(cve);
            String summary = genAIService.summarizeCve(cveDetails);

            logger.info("Successfully generated summary for CVE: {}", cveId);
            return ResponseEntity.ok(Map.of("summary", summary));
        } catch (Exception e) {
            logger.error("Error generating summary for CVE {}: {}", cveId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate summary"));
        }
    }
    
    // ========== Batch AI Analysis ==========

    @PostMapping("/batch/summarize")
    public ResponseEntity<Map<String, String>> batchSummarize(@RequestBody List<String> cveIds) {
        logger.info("Generating batch summaries for {} CVEs", cveIds.size());

        try {
            Map<String, String> summaries = new java.util.HashMap<>();

            for (String cveId : cveIds) {
                try {
                    CveDto cve = cveDataService.getCveById(cveId);
                    if (cve != null) {
                        String cveDetails = formatCveForAI(cve);
                        String summary = genAIService.summarizeCve(cveDetails);
                        summaries.put(cveId, summary);
                    } else {
                        summaries.put(cveId, "CVE not found");
                    }
                } catch (Exception e) {
                    logger.warn("Failed to summarize CVE {}: {}", cveId, e.getMessage());
                    summaries.put(cveId, "Error generating summary");
                }
            }

            logger.info("Successfully generated {} summaries", summaries.size());
            return ResponseEntity.ok(summaries);
        } catch (Exception e) {
            logger.error("Error in batch summarization: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========== Utility Endpoints ==========

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "healthy",
                "timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                "services", "CveDataService, NVDService, GenAIService"));
    }

    @GetMapping("/test-ai")
    public ResponseEntity<Map<String, String>> testAI() {
        logger.info("Testing AI service with simple prompt");

        try {
            String testResult = genAIService
                    .summarizeCve("Test CVE: This is a simple test to check if the API key is working correctly.");
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "result", testResult,
                    "timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
        } catch (Exception e) {
            logger.error("AI test failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "error", e.getMessage(),
                            "timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        try {
            List<CveDto> allCves = cveDataService.getAllCves();
            Map<String, Long> severityCount = allCves.stream()
                    .collect(java.util.stream.Collectors.groupingBy(
                            cve -> cve.getSeverity() != null ? cve.getSeverity() : "UNKNOWN",
                            java.util.stream.Collectors.counting()));

            Map<String, Object> stats = Map.of(
                    "totalCves", allCves.size(),
                    "severityDistribution", severityCount,
                    "lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error generating stats: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========== Helper Methods ==========

    private String formatCveForAI(CveDto cve) {
        StringBuilder details = new StringBuilder();
        details.append("CVE ID: ").append(cve.getId()).append("\n");
        details.append("Description: ").append(cve.getDescription()).append("\n");
        details.append("Severity: ").append(cve.getSeverity()).append("\n");

        if (cve.getPublishedDate() != null) {
            details.append("Published Date: ").append(cve.getPublishedDate()).append("\n");
        }

        if (cve.getReferences() != null && !cve.getReferences().isEmpty()) {
            details.append("References: ").append(cve.getReferences()).append("\n");
        }

        return details.toString();
    }

    // ========== Exception Handler ==========

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        logger.error("Unhandled exception in CveController: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error", "message", e.getMessage()));
    }
}
