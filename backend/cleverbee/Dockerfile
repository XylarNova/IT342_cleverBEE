# Build stage: Maven + JDK
FROM maven:3.9.4-eclipse-temurin-21 AS build

# Set working directory inside container
WORKDIR /app

# Copy everything inside cleverbee folder
COPY ./ ./

# Build the project
RUN mvn clean package -DskipTests

# Run stage: JDK only
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
