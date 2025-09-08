package com.cvemind.cvemind_backend.config;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimitFilter implements Filter {
    
    private static final Logger logger = LoggerFactory.getLogger(RateLimitFilter.class);
    
    private final ConcurrentHashMap<String, Bucket> cache = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        // Allow 100 requests per minute per IP
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String clientIp = getClientIP(httpRequest);
        String requestUri = httpRequest.getRequestURI();
        
        logger.debug("Processing request from IP: {} to URI: {}", clientIp, requestUri);
        
        Bucket bucket = cache.computeIfAbsent(clientIp, k -> {
            logger.debug("Creating new rate limit bucket for IP: {}", clientIp);
            return createNewBucket();
        });

        if (bucket.tryConsume(1)) {
            logger.debug("Request allowed for IP: {} to URI: {}", clientIp, requestUri);
            chain.doFilter(request, response);
        } else {
            logger.warn("Rate limit exceeded for IP: {} to URI: {}", clientIp, requestUri);
            httpResponse.setStatus(429);
            httpResponse.getWriter().write("Rate limit exceeded. Please try again later.");
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
