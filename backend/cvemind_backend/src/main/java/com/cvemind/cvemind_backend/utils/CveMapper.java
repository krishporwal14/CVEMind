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

        // Parse references from rawJson
        List<String> references = extractReferences(entity.getRawJson());
        dto.setReferences(references);

        return dto;
    }

    // Convert DTO -> Entity
    public static CveEntity toEntity(CveDto dto, String rawJson) {
        if (dto == null) return null;

        CveEntity entity = new CveEntity();
        entity.setId(dto.getId());
        entity.setDescription(dto.getDescription());
        entity.setSeverity(dto.getSeverity());
        entity.setPublishedDate(dto.getPublishedDate());
        entity.setRawJson(rawJson); // Keep full JSON for flexibility

        return entity;
    }

    // Helper to extract references from rawJson (NVD API structure)
    private static List<String> extractReferences(String rawJson) {
        List<String> refs = new ArrayList<>();
        if (rawJson == null) return refs;

        try {
            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode referencesNode = root.at("/cve/references/reference_data");
            if (referencesNode.isArray()) {
                Iterator<JsonNode> it = referencesNode.elements();
                while (it.hasNext()) {
                    JsonNode ref = it.next();
                    refs.add(ref.get("url").asText());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return refs;
    }
}
