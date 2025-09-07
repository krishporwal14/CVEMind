package com.cvemind.cvemind_backend.dto;

import java.time.Instant;
import java.util.List;

public class CveDto {
    private String id;
    private String description;
    private String severity;
    private Instant publishedDate;
    private List<String> references;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public Instant getPublishedDate() { return publishedDate; }
    public void setPublishedDate(Instant publishedDate) { this.publishedDate = publishedDate; }
    public List<String> getReferences() { return references; }
    public void setReferences(List<String> references) { this.references = references; }
}
