# Build the jar, then run it on a small Java image.
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/portfolio-backend-1.0.0.jar app.jar
# Keep memory small enough for free hosting (512 MB)
ENV JAVA_TOOL_OPTIONS="-Xmx300m"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
