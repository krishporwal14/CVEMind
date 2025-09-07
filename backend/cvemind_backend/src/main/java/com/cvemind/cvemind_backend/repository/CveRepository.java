package com.cvemind.cvemind_backend.repository;

import com.cvemind.cvemind_backend.entity.CveEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface CveRepository extends JpaRepository<CveEntity, String> {
    // Find CVEs containing a keyword in description
    List<CveEntity> findByDescriptionContainingIgnoreCase(String keyword);

    // Find CVEs by product name
    List<CveEntity> findByProductContainingIgnoreCase(String product);

    // Filter by severity (LOW, MEDIUM, HIGH, CRITICAL)
    List<CveEntity> findBySeverityIgnoreCase(String severity);
}
