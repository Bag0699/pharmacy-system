# ===============================
# 1. ETAPA DE CONSTRUCCIÓN (BUILD STAGE)
# Imagen de Maven y JDK
# ===============================
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src /app/src

RUN mvn clean package -DskipTests

# ===============================
# 2. ETAPA DE EJECUCIÓN (RUNTIME STAGE)
# Uso de JRE (Máquina Virtual de Java)
# ===============================

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]