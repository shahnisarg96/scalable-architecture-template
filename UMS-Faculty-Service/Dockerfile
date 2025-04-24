# 1) Builder stage: compile & package with Maven
FROM maven:3.8.3-amazoncorretto-17 AS builder
WORKDIR /app

# Copy only the files needed for dependency resolution first
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code & build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# 2) Runtime stage: run the JAR on a slimmer JRE image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /

# Copy the jar from the builder
COPY --from=builder /app/target/*.jar app.jar

# Pass Spring profile or other args as needed
ENTRYPOINT ["java", "-jar", "/app.jar", "--spring.profiles.active=k8s"]