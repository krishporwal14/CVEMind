package com.cvemind.cvemind_backend.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cves")
public class CveEntity {
    @Id
    private String id;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String severity;

    private Instant publishedDate;

    // Removed rawJson field

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public Instant getPublishedDate() { return publishedDate; }
    public void setPublishedDate(Instant publishedDate) { this.publishedDate = publishedDate; }
}
