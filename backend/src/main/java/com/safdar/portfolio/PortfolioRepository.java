package com.safdar.portfolio;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.stereotype.Repository;

/** Layer 3 - database access. The only class that contains SQL. */
@Repository
public class PortfolioRepository {

    private final JdbcTemplate jdbc;

    public PortfolioRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /** section name -> JSON text */
    public Map<String, String> findAll() {
        Map<String, String> rows = new LinkedHashMap<>();
        jdbc.query(
                "SELECT name, content::text AS content FROM portfolio_section ORDER BY name",
                (RowCallbackHandler) rs -> rows.put(rs.getString("name"), rs.getString("content")));
        return rows;
    }

    public Optional<String> findByName(String name) {
        return jdbc.query(
                        "SELECT content::text AS content FROM portfolio_section WHERE name = ?",
                        (rs, i) -> rs.getString("content"),
                        name)
                .stream()
                .findFirst();
    }

    /** Insert the section, or replace it if it already exists. */
    public void upsert(String name, String json) {
        jdbc.update(
                "INSERT INTO portfolio_section (name, content) VALUES (?, ?::jsonb) "
                        + "ON CONFLICT (name) DO UPDATE SET content = EXCLUDED.content, updated_at = now()",
                name,
                json);
    }
}
