# Use a base image that contains Java 21
FROM eclipse-temurin:21-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the target jar file to the container and rename to app.jar
COPY target/cleverbee-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 (Spring Boot default port)
EXPOSE 8080

# Command to run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
