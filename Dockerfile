# Multi-stage Dockerfile for College Event Management System (Render & Cloud Ready)

# Stage 1: Build React Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend-react
COPY frontend-react/package*.json ./
RUN npm install
COPY frontend-react/ ./
RUN npm run build

# Stage 2: Build Spring Boot Backend
FROM maven:3.9.9-eclipse-temurin-21 AS backend-builder
WORKDIR /app

ENV MAVEN_OPTS="-Xmx384m -XX:+UseSerialGC -Dmaven.wagon.http.retryHandler.count=3"

# Copy Maven POM and backend source code
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src

# Overlay compiled React frontend directly onto Spring Boot static resources
COPY --from=frontend-builder /app/frontend-react/dist/ backend/src/main/resources/static/

WORKDIR /app/backend
RUN mvn clean package -DskipTests -Dmaven.test.skip=true --no-transfer-progress

# Stage 3: Lightweight Production JRE Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Ensure /tmp is fully accessible for embedded Tomcat
RUN chmod 1777 /tmp

# Copy the packaged Spring Boot executable JAR
COPY --from=backend-builder /app/backend/target/*.jar app.jar

ENV PORT=10000
EXPOSE 10000

# Run Spring Boot with tuned memory settings for Render free tier (512MB RAM)
ENTRYPOINT ["java", "-Xmx384m", "-XX:+UseSerialGC", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
