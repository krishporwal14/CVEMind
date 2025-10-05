package com.cvemind.cvemind_backend.service;

import java.util.Map;
import java.util.List;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.cvemind.cvemind_backend.config.GenAiProperties;

@Service
public class GenAIService {

    private static final Logger logger = LoggerFactory.getLogger(GenAIService.class);

    private final WebClient webClient;
    private final GenAiProperties genAiProperties;

    public GenAIService(WebClient.Builder builder, GenAiProperties genAiProperties) {
        this.webClient = builder.baseUrl("https://openrouter.ai/api/v1").build();
        this.genAiProperties = genAiProperties;

        // Log API key status (without exposing the actual key)
        if (genAiProperties.getApiKey() != null && !genAiProperties.getApiKey().isEmpty()) {
            logger.info("GenAI Service initialized with API key: {}...{}",
                    genAiProperties.getApiKey().substring(0, Math.min(10, genAiProperties.getApiKey().length())),
                    genAiProperties.getApiKey().substring(Math.max(0, genAiProperties.getApiKey().length() - 4)));
            logger.info("Using model: {}", genAiProperties.getModel());
            logger.info("API key length: {}", genAiProperties.getApiKey().length());
        } else {
            logger.error("GenAI Service initialized but API key is missing or empty!");
        }
    }

    public String summarizeCve(String cveDetails) {
        String systemPrompt = """
                You are a comprehensive cybersecurity expert with expertise in vulnerability analysis,
                risk assessment, technical analysis, and remediation strategies. Provide a complete,
                actionable analysis of CVE information covering all aspects that security teams and
                developers need to understand and respond to vulnerabilities effectively.
                """;

        String userPrompt = String.format(
                """
                        Provide a comprehensive analysis of the following CVE details. Your response should include ALL of the following sections:

                        ## 1. VULNERABILITY OVERVIEW
                        - Brief description of what the vulnerability is
                        - Root cause analysis (programming/design flaw)
                        - Affected products, versions, and components

                        ## 2. SEVERITY & RISK ASSESSMENT
                        - Impact level and CVSS score interpretation
                        - Risk level (High/Medium/Low) with justification
                        - Business impact and potential consequences if exploited

                        ## 3. TECHNICAL ANALYSIS
                        - Attack vector and exploitation mechanics
                        - Step-by-step attack methodology
                        - Required conditions for successful exploitation
                        - Proof-of-concept availability status

                        ## 4. DETECTION & MONITORING
                        - Log signatures to monitor
                        - Network indicators of compromise (IoCs)
                        - System behavior anomalies to watch for
                        - Recommended detection tools and scanners

                        ## 5. IMMEDIATE MITIGATION STRATEGY
                        **Immediate Actions (0-24 hours):**
                        - Emergency measures to reduce exposure
                        - Temporary workarounds if patches aren't available
                        - Critical systems to isolate or protect

                        **Short-term Actions (1-7 days):**
                        - Patch deployment strategy and timeline
                        - Configuration changes and hardening
                        - Enhanced monitoring implementation

                        **Long-term Actions (1-4 weeks):**
                        - Infrastructure improvements
                        - Process updates and prevention measures
                        - Security architecture enhancements

                        ## 6. TECHNICAL REMEDIATION
                        - Specific code fixes and patches available
                        - Configuration hardening recommendations
                        - Architectural improvements to prevent similar issues
                        - Testing and validation procedures

                        ## 7. COMPLIANCE & GOVERNANCE
                        - Regulatory requirements that may be affected
                        - Industry compliance frameworks (SOC2, PCI-DSS, etc.)
                        - Reporting and documentation requirements
                        - Stakeholder communication key points

                        ## 8. RESOURCES & TOOLS
                        **Official Resources:**
                        - Vendor advisories and patches
                        - NIST NVD and MITRE CVE references

                        **Technical Resources:**
                        - Security research papers and analyses
                        - Community discussions and expert insights

                        **Recommended Tools:**
                        - Vulnerability scanners for detection
                        - Security tools for protection
                        - Monitoring and alerting solutions

                        ## 9. PRIORITY & TIMELINE
                        - Urgency level for patching/remediation
                        - Recommended timeline for each action
                        - Resource allocation suggestions
                        - Risk vs. effort analysis

                        CVE Details to Analyze:
                        %s

                        Format your response with clear markdown sections, bullet points, and actionable recommendations.
                        Ensure each section provides specific, implementable guidance rather than generic advice.
                        """,
                cveDetails);

        try {
            String result = makeApiCall(systemPrompt, userPrompt);
            logger.info("Successfully generated related resources for CVE: {}", cveId);
            return result;
        } catch (Exception e) {
            logger.error("Failed to generate related resources for CVE {}: {}", cveId, e.getMessage(), e);
            throw e;
        }
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    private String makeApiCall(String systemPrompt, String userPrompt) {
        logger.debug("Making API call to GenAI service");

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userPrompt));

        Map<String, Object> requestBody = Map.of(
                "model", genAiProperties.getModel(),
                "messages", messages,
                "max_tokens", 4000,
                "temperature", 0.3);

        try {
            logger.debug("Sending request to OpenRouter API with model: {}", genAiProperties.getModel());
            logger.debug("API Key status: {}", genAiProperties.getApiKey() != null ? "Present" : "Missing");
            logger.debug("API Key starts with: {}", genAiProperties.getApiKey() != null
                    ? genAiProperties.getApiKey().substring(0, Math.min(15, genAiProperties.getApiKey().length()))
                    : "null");

            Map response = this.webClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + genAiProperties.getApiKey())
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(), clientResponse -> {
                        logger.error("Client error {}: Status Code {}", clientResponse.statusCode(),
                                clientResponse.statusCode().value());
                        return clientResponse.bodyToMono(String.class)
                                .doOnNext(body -> logger.error("Error response body: {}", body))
                                .then(clientResponse.createException());
                    })
                    .bodyToMono(Map.class)
                    .block();

            String result = ((Map<String, Object>) ((Map) ((java.util.List) response.get("choices")).get(0))
                    .get("message")).get("content").toString();
            logger.debug("Successfully received response from GenAI API, length: {}", result.length());
            return result;

        } catch (Exception e) {
            logger.error("GenAI API call failed: {}", e.getMessage(), e);
            return "Error generating AI response: " + e.getMessage();
        }
    }
}
