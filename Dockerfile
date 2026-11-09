# Multi-stage Dockerfile for College Event Management System
# Builds React Frontend and Spring Boot Backend into a unified container

# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend-react
COPY frontend-react/package*.json ./
RUN npm install
COPY frontend-react/ ./
RUN npm run build

# Stage 2: Build Spring Boot Application with Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app
COPY backend/pom.xml backend/pom.xml
# Copy static frontend assets into backend
COPY --from=frontend-builder /app/frontend-react/dist backend/src/main/resources/static
COPY backend/src backend/src
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Stage 3: Lightweight Production JRE Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=backend-builder --chown=appuser:appgroup /app/backend/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
