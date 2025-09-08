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
        logger.info("GenAIService initialized with model: {}", genAiProperties.getModel());
    }

    public String summarizeCve(String cveDetails) {
        logger.debug("Starting CVE summarization for CVE details length: {}", cveDetails.length());
        
        String systemPrompt = """
            You are a cybersecurity expert specializing in vulnerability analysis. 
            Provide clear, actionable summaries of CVE (Common Vulnerabilities and Exposures) information.
            Focus on practical implications for security teams and developers.
            """;

        String userPrompt = String.format("""
            Analyze the following CVE details and provide a comprehensive summary including:
            
            1. **Vulnerability Overview**: Brief description of what the vulnerability is
            2. **Severity Assessment**: Impact level and CVSS score interpretation
            3. **Affected Systems**: What products, versions, or components are vulnerable
            4. **Attack Vector**: How an attacker could exploit this vulnerability
            5. **Business Impact**: Potential consequences if exploited
            6. **Mitigation Priority**: Urgency level for patching/remediation
            7. **Recommended Actions**: Specific steps to address the vulnerability
            
            CVE Details:
            %s
            
            Format your response with clear sections and bullet points for easy reading.
            """, cveDetails);

        try {
            String result = makeApiCall(systemPrompt, userPrompt);
            logger.info("Successfully generated CVE summary");
            return result;
        } catch (Exception e) {
            logger.error("Failed to generate CVE summary: {}", e.getMessage(), e);
            throw e;
        }
    }

    public String generateMitigationStrategy(String cveDetails) {
        logger.debug("Starting mitigation strategy generation for CVE details length: {}", cveDetails.length());
        
        String systemPrompt = """
            You are a cybersecurity consultant specializing in vulnerability remediation strategies.
            Provide detailed, actionable mitigation plans that organizations can implement immediately.
            """;

        String userPrompt = String.format("""
            Based on the following CVE information, create a detailed mitigation strategy including:
            
            1. **Immediate Actions** (0-24 hours):
               - Emergency measures to reduce exposure
               - Temporary workarounds if patches aren't available
            
            2. **Short-term Actions** (1-7 days):
               - Patch deployment strategy
               - Configuration changes
               - Monitoring enhancements
            
            3. **Long-term Actions** (1-4 weeks):
               - Infrastructure improvements
               - Process updates
               - Prevention measures
            
            4. **Resources and Tools**:
               - Recommended security tools
               - Useful documentation links
               - Compliance considerations
            
            CVE Details:
            %s
            
            Provide specific, implementable recommendations.
            """, cveDetails);

        try {
            String result = makeApiCall(systemPrompt, userPrompt);
            logger.info("Successfully generated mitigation strategy");
            return result;
        } catch (Exception e) {
            logger.error("Failed to generate mitigation strategy: {}", e.getMessage(), e);
            throw e;
        }
    }

    public String assessRiskContext(String cveDetails, String organizationContext) {
        logger.debug("Starting risk assessment for organization context length: {}", organizationContext.length());
        
        String systemPrompt = """
            You are a risk assessment specialist who helps organizations understand 
            the specific impact of vulnerabilities in their unique environment.
            """;

        String userPrompt = String.format("""
            Perform a contextualized risk assessment for this CVE based on the organization's profile:
            
            **Organization Context:**
            %s
            
            **CVE Details:**
            %s
            
            Please provide:
            
            1. **Risk Level for This Organization**: High/Medium/Low with justification
            2. **Specific Threats**: Relevant attack scenarios for this environment
            3. **Asset Impact Analysis**: Which systems/data are most at risk
            4. **Compliance Implications**: Regulatory requirements that may be affected
            5. **Cost-Benefit Analysis**: Effort vs. risk reduction for remediation
            6. **Stakeholder Communication**: Key points for management briefing
            
            Tailor your assessment to this specific organizational context.
            """, organizationContext, cveDetails);

        try {
            String result = makeApiCall(systemPrompt, userPrompt);
            logger.info("Successfully generated risk assessment");
            return result;
        } catch (Exception e) {
            logger.error("Failed to generate risk assessment: {}", e.getMessage(), e);
            throw e;
        }
    }

    public String generateTechnicalAnalysis(String cveDetails) {
        logger.debug("Starting technical analysis for CVE details length: {}", cveDetails.length());
        
        String systemPrompt = """
            You are a senior security researcher with deep technical expertise in vulnerability analysis.
            Provide detailed technical insights for security engineers and developers.
            """;

        String userPrompt = String.format("""
            Provide a detailed technical analysis of this CVE:
            
            1. **Root Cause Analysis**:
               - What programming/design flaw caused this vulnerability
               - Code-level explanation where applicable
            
            2. **Exploitation Mechanics**:
               - Step-by-step attack methodology
               - Required conditions for successful exploitation
               - Proof-of-concept availability
            
            3. **Detection Methods**:
               - Log signatures to monitor
               - Network indicators of compromise
               - System behavior anomalies
            
            4. **Technical Remediation**:
               - Code fixes and patches
               - Configuration hardening
               - Architectural improvements
            
            5. **Testing and Validation**:
               - How to verify the fix works
               - Regression testing considerations
            
            CVE Details:
            %s
            
            Focus on technical depth and actionable engineering insights.
            """, cveDetails);

        try {
            String result = makeApiCall(systemPrompt, userPrompt);
            logger.info("Successfully generated technical analysis");
            return result;
        } catch (Exception e) {
            logger.error("Failed to generate technical analysis: {}", e.getMessage(), e);
            throw e;
        }
    }

    public String getRelatedResources(String cveId, String cveDetails) {
        logger.debug("Generating related resources for CVE: {}", cveId);
        
        String systemPrompt = """
            You are a cybersecurity information specialist who helps teams find 
            relevant resources and references for vulnerability research and remediation.
            """;

        String userPrompt = String.format("""
            For CVE %s, provide a comprehensive list of related resources:
            
            1. **Official Resources**:
               - Vendor advisories and patches
               - NIST NVD details
               - MITRE CVE entry
            
            2. **Technical Resources**:
               - Security research papers
               - Proof-of-concept code repositories
               - Technical blog posts and analyses
            
            3. **Tools and Scanners**:
               - Vulnerability scanners that detect this CVE
               - Exploitation frameworks (for testing)
               - Remediation tools
            
            4. **Community Resources**:
               - Security forums discussions
               - Reddit/Twitter conversations
               - Conference presentations
            
            5. **Compliance and Standards**:
               - Relevant compliance frameworks
               - Industry best practices
               - Regulatory guidance
            
            CVE Details:
            %s
            
            Provide actual URLs, tool names, and specific resource titles where possible.
            Format as a structured list with brief descriptions.
            """, cveId, cveDetails);

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
            "max_tokens", 2000,
            "temperature", 0.3
        );

        try {
            logger.debug("Sending request to OpenRouter API with model: {}", genAiProperties.getModel());
            
            Map response = this.webClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + genAiProperties.getApiKey())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            String result = ((Map<String, Object>) ((Map) ((java.util.List) response.get("choices")).get(0)).get("message")).get("content").toString();
            logger.debug("Successfully received response from GenAI API, length: {}", result.length());
            return result;
            
        } catch (Exception e) {
            logger.error("GenAI API call failed: {}", e.getMessage(), e);
            return "Error generating AI response: " + e.getMessage();
        }
    }
}
