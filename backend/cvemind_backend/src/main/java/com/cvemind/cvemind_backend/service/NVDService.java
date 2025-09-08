package com.cvemind.cvemind_backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.cvemind.cvemind_backend.dto.CveDto;
import com.cvemind.cvemind_backend.entity.CveEntity;
import com.cvemind.cvemind_backend.utils.CveMapper;

@Service
public class NVDService {
    private final WebClient webClient;

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
        List<CveDto> dtos = new ArrayList<>();
        if (response == null || !response.containsKey("vulnerabilities")) return dtos;

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> vulns = (List<Map<String, Object>>) response.get("vulnerabilities");
        for (Map<String, Object> vuln : vulns) {
            @SuppressWarnings("unchecked")
            Map<String, Object> cveWrapper = (Map<String, Object>) vuln.get("cve");
            if (cveWrapper != null) {
                String rawJson = toJsonString(cveWrapper); // store full JSON
                CveEntity entity = extractEntityFromMap(cveWrapper, rawJson);
                dtos.add(CveMapper.toDto(entity));
            }
        }
        return dtos;
    }

    private CveDto mapSingleToDto(@SuppressWarnings("rawtypes") Map response) {
        if (response == null || !response.containsKey("vulnerabilities")) return null;

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> vulns = (List<Map<String, Object>>) response.get("vulnerabilities");
        if (vulns.isEmpty()) return null;

        @SuppressWarnings("unchecked")
        Map<String, Object> cveWrapper = (Map<String, Object>) vulns.get(0).get("cve");
        if (cveWrapper == null) return null;

        String rawJson = toJsonString(cveWrapper);
        CveEntity entity = extractEntityFromMap(cveWrapper, rawJson);

        return CveMapper.toDto(entity);
    }

    private CveEntity extractEntityFromMap(Map<String, Object> cveWrapper, String rawJson) {
        CveEntity entity = new CveEntity();

        // ID
        String id = (String) cveWrapper.get("id");
        entity.setId(id);

        // Description (pick English if multiple exist)
        String description = "";
        @SuppressWarnings("unchecked")
        Map<String, Object> descriptions = (Map<String, Object>) ((List<?>) cveWrapper.get("descriptions")).get(0);
        if (descriptions != null) {
            description = (String) descriptions.get("value");
        }
        entity.setDescription(description);

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
        } catch (Exception ignored) {}
        entity.setSeverity(severity);

        // Published date
        entity.setPublishedDate(null); // optional: parse if provided

        // Raw JSON
        entity.setRawJson(rawJson);

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
