package com.college.event.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path reactDistPath = Paths.get("frontend-react/dist").toAbsolutePath().normalize();
        String reactDistUri = "file:" + reactDistPath.toString().replace("\\", "/") + "/";

        Path frontendPath = Paths.get("frontend").toAbsolutePath().normalize();
        String frontendUri = "file:" + frontendPath.toString().replace("\\", "/") + "/";

        registry.addResourceHandler("/**")
                .addResourceLocations(reactDistUri, frontendUri, "classpath:/static/", "classpath:/public/")
                .setCachePeriod(0);
    }
}
