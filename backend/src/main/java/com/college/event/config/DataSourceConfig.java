package com.college.event.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${SPRING_DATASOURCE_URL:${spring.datasource.url:}}")
    private String configuredUrl;

    @Value("${SPRING_DATASOURCE_USERNAME:${spring.datasource.username:}}")
    private String configuredUsername;

    @Value("${SPRING_DATASOURCE_PASSWORD:${spring.datasource.password:}}")
    private String configuredPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String targetUrl = (configuredUrl != null && !configuredUrl.trim().isEmpty())
                ? configuredUrl.trim()
                : "jdbc:mysql://localhost:3306/college_event_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        String targetUser = (configuredUsername != null && !configuredUsername.trim().isEmpty()) ? configuredUsername.trim() : "root";
        String targetPass = configuredPassword != null ? configuredPassword : "";

        // If target URL is MySQL, test connectivity quickly with a 2-second timeout
        if (targetUrl.startsWith("jdbc:mysql:")) {
            log.info("Testing connection to MySQL at: {}", targetUrl.split("\\?")[0]);
            try {
                DriverManager.setLoginTimeout(2);
                try (Connection conn = DriverManager.getConnection(targetUrl, targetUser, targetPass)) {
                    log.info("Successfully connected to MySQL database!");
                    HikariConfig config = new HikariConfig();
                    config.setJdbcUrl(targetUrl);
                    config.setUsername(targetUser);
                    config.setPassword(targetPass);
                    config.setDriverClassName("com.mysql.cj.jdbc.Driver");
                    config.setMaximumPoolSize(10);
                    return new HikariDataSource(config);
                }
            } catch (Exception ex) {
                log.warn("MySQL connection could not be established ({}: {}). Falling back to resilient in-memory database with MySQL emulation.",
                        ex.getClass().getSimpleName(), ex.getMessage());
            }
        } else if (targetUrl.startsWith("jdbc:h2:")) {
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(targetUrl);
            config.setUsername(targetUser.isEmpty() ? "sa" : targetUser);
            config.setPassword(targetPass);
            config.setDriverClassName("org.h2.Driver");
            return new HikariDataSource(config);
        }

        // Resilient Fallback to H2 in MySQL emulation mode for instant cloud deployment
        log.info("Initializing in-memory database (MySQL mode) for zero-setup cloud deployment...");
        HikariConfig h2Config = new HikariConfig();
        h2Config.setJdbcUrl("jdbc:h2:mem:college_event_db;MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE");
        h2Config.setUsername("sa");
        h2Config.setPassword("");
        h2Config.setDriverClassName("org.h2.Driver");
        return new HikariDataSource(h2Config);
    }
}

