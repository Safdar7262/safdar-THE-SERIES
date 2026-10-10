package com.safdar.portfolio;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Layer 1 - HTTP. Only translates requests into service calls.
 *
 *   GET /api/portfolio            -> every section in one JSON object (the React app uses this)
 *   GET /api/portfolio/projects   -> a single section
 */
@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService service;

    public PortfolioController(PortfolioService service) {
        this.service = service;
    }

    @GetMapping
    public Map<String, JsonNode> getAll() {
        return service.getAllSections();
    }

    @GetMapping("/{section}")
    public JsonNode getOne(@PathVariable String section) {
        return service.getSection(section)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown section: " + section));
    }
}
