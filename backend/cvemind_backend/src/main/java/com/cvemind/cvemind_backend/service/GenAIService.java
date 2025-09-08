package com.cvemind.cvemind_backend.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GenAIService {
    private final WebClient webClient;

    @Value("${genai.api.key}")
    private String apiKey;

    @Value("${genai.model}")
    private String model;

    public GenAIService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://openrouter.ai/api/v1").build();
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    public String summarizeCve(String cveDetails) {
        Map<String, Object> requestBody = Map.of(
            "model", model,
            "messages", new Object[] {
                Map.of("role", "system", "content", "You are a cybersecurity assistant."),
                Map.of("role", "user", "content", "Summarize the following CVE details in a concise manner: " + cveDetails)
            }
        );

        Map response = this.webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return ((Map<String, Object>) ((Map) ((java.util.List) response.get("choices")).get(0)).get("message")).get("content").toString();
    }
}
