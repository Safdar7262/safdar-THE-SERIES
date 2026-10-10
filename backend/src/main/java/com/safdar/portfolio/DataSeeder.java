package com.safdar.portfolio;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/**
 * Copies src/main/resources/portfolio-data.json into PostgreSQL when the app starts.
 * Each top-level key of the JSON file ("profile", "projects", ...) becomes one row.
 * Switch it off with SEED_ENABLED=false.
 */
@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final PortfolioService service;
    private final ObjectMapper objectMapper;

    public DataSeeder(PortfolioService service, ObjectMapper objectMapper) {
        this.service = service;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        try (InputStream in = new ClassPathResource("portfolio-data.json").getInputStream()) {
            JsonNode root = objectMapper.readTree(in);
            root.fields().forEachRemaining(entry -> service.saveSection(entry.getKey(), entry.getValue()));
            log.info("Portfolio data loaded into PostgreSQL ({} sections)", root.size());
        }
    }
}
