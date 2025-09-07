package com.cvemind.cvemind_backend.config;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    private Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k -> {
            Refill refill = Refill.greedy(60, Duration.ofMinutes(1));
            Bandwidth limit = Bandwidth.classic(60, refill);
            return Bucket.builder().addLimit(limit).build();
        });
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        
        String ip = req.getRemoteAddr();
        Bucket bucket = resolveBucket(ip);

        if(bucket.tryConsume(1)) {
            chain.doFilter(request, response);;
        } else {
            res.setStatus(429);
            res.getWriter().write("Too Many Requests. Please slow down.");
        }
    }
}
