package com.cvemind.cvemind_backend.utils;

import com.cvemind.cvemind_backend.dto.CveDto;
import com.cvemind.cvemind_backend.entity.CveEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class CveMapper {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    // Convert Entity -> DTO
    public static CveDto toDto(CveEntity entity) {
        if (entity == null) return null;

        CveDto dto = new CveDto();
        dto.setId(entity.getId());
        dto.setDescription(entity.getDescription());
        dto.setSeverity(entity.getSeverity());
        dto.setPublishedDate(entity.getPublishedDate());
        // Don't set rawJson from entity since we're not storing it
        dto.setRawJson(null);
        // Set empty references since we can't extract from stored rawJson
        dto.setReferences(new ArrayList<>());

        return dto;
    }

    // Convert DTO -> Entity (no rawJson parameter needed)
    public static CveEntity toEntity(CveDto dto) {
        if (dto == null) return null;

        CveEntity entity = new CveEntity();
        entity.setId(dto.getId());
        entity.setDescription(dto.getDescription());
        entity.setSeverity(dto.getSeverity());
        entity.setPublishedDate(dto.getPublishedDate());
        // No rawJson field to set

        return entity;
    }

    // Keep this for NVD processing - extract references during DTO creation from NVD
    public static CveDto toDtoWithReferences(CveEntity entity, String rawJson) {
        if (entity == null) return null;

        CveDto dto = new CveDto();
        dto.setId(entity.getId());
        dto.setDescription(entity.getDescription());
        dto.setSeverity(entity.getSeverity());
        dto.setPublishedDate(entity.getPublishedDate());
        dto.setRawJson(rawJson); // Keep rawJson in DTO for AI processing
        
        // Extract references from rawJson
        List<String> references = extractReferences(rawJson);
        dto.setReferences(references);

        return dto;
    }

    // Helper to extract references from rawJson (NVD API structure)
    private static List<String> extractReferences(String rawJson) {
        List<String> refs = new ArrayList<>();
        if (rawJson == null) return refs;

        try {
            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode referencesNode = root.at("/references");
            if (referencesNode.isArray()) {
                Iterator<JsonNode> it = referencesNode.elements();
                while (it.hasNext()) {
                    JsonNode ref = it.next();
                    JsonNode urlNode = ref.get("url");
                    if (urlNode != null) {
                        refs.add(urlNode.asText());
                    }
                }
            }
        } catch (IOException e) {
            // Log error but don't fail
            System.err.println("Error parsing references from rawJson: " + e.getMessage());
        }

        return refs;
    }
}
