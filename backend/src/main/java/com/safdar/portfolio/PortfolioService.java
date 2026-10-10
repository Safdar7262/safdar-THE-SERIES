package com.safdar.portfolio;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Service;

/** Layer 2 - business logic. Turns the JSON text stored in PostgreSQL into JSON objects. */
@Service
public class PortfolioService {

    private final PortfolioRepository repository;
    private final ObjectMapper objectMapper;

    public PortfolioService(PortfolioRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public Map<String, JsonNode> getAllSections() {
        Map<String, JsonNode> result = new LinkedHashMap<>();
        repository.findAll().forEach((name, json) -> result.put(name, parse(json)));
        return result;
    }

    public Optional<JsonNode> getSection(String name) {
        return repository.findByName(name).map(this::parse);
    }

    public void saveSection(String name, JsonNode content) {
        repository.upsert(name, content.toString());
    }

    private JsonNode parse(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Invalid JSON stored in the database", e);
        }
    }
}
