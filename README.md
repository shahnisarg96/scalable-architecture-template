# Scalable Services Bundle

A microservices-based architecture designed to handle scalable and modular services for a university management system. This project includes services for authentication, student management, faculty management, course management, and enrollment, all orchestrated through an API Gateway. Additionally, Kafka is integrated for logging and event-driven communication.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Services](#services)
- [Kafka Integration](#kafka-integration)
- [Setup and Installation](#setup-and-installation)
- [Troubleshooting](#troubleshooting)
- [API Documentation](#api-documentation)

---

## Overview

The **Scalable Services Bundle** is a modular and scalable microservices architecture designed for managing various aspects of a university system. Each service is independently deployable and communicates with others through REST APIs. The API Gateway acts as a single entry point for all client requests, providing routing, authentication, rate-limiting, and logging functionalities.

---

## Features

- **Microservices Architecture**: Independent services for authentication, students, faculty, courses, and enrollment.
- **API Gateway**: Centralized routing, authentication, rate-limiting, and logging.
- **Kafka Integration**: Event-driven communication for logging and audit purposes.
- **Database Integration**: PostgreSQL as the primary database for all services.
- **Authentication**: JWT-based authentication for secure access.
- **Scalability**: Each service can be scaled independently.
- **Dockerized Deployment**: Easy containerized deployment using Docker and Kubernetes.
- **Rate Limiting**: Protects services from abuse.
- **Logging and Monitoring**: Centralized logging using Kafka and audit logs.

---

## Architecture

The project follows a microservices architecture with the following components:

1. **API Gateway**:
   - Handles routing, authentication, rate-limiting, and logging.
   - Sends logs to Kafka for centralized logging.

2. **Authentication Service**:
   - Manages user signup, login, and JWT token generation.

3. **Student Service**:
   - Handles CRUD operations for student data.

4. **Faculty Service**:
   - Manages faculty data and their course assignments.

5. **Course Service**:
   - Handles CRUD operations for course data.

6. **Enrollment Service**:
   - Manages student enrollments in courses.

7. **Audit Service**:
   - Consumes logs from Kafka and writes them to a persistent log file.

8. **Kafka**:
   - Acts as the message broker for event-driven communication and logging.

9. **PostgreSQL Database**:
   - Each microservice has its own database schema for isolation.

---

## Services

### 1. **Authentication Service**
- **Endpoints**:
  - `POST /auth/signup`: Create a new user.
  - `POST /auth/login`: Authenticate a user and return a JWT token.
- **Database**: PostgreSQL with a `User` model.

### 2. **Student Service**
- **Endpoints**:
  - `POST /students`: Add a new student.
  - `GET /students`: Retrieve all students.
  - `GET /students/:id`: Retrieve a student by ID.
  - `PUT /students/:id`: Update a student's details.
  - `DELETE /students/:id`: Delete a student.

### 3. **Faculty Service**
- **Endpoints**:
  - `POST /faculty`: Add a new faculty member.
  - `GET /faculty`: Retrieve all faculty members.
  - `GET /faculty/:id`: Retrieve a faculty member by ID.
  - `PUT /faculty/:id`: Update a faculty member's details.
  - `DELETE /faculty/:id`: Delete a faculty member.

### 4. **Course Service**
- **Endpoints**:
  - `POST /courses`: Add a new course.
  - `GET /courses`: Retrieve all courses.
  - `GET /courses/:id`: Retrieve a course by ID.
  - `PUT /courses/:id`: Update a course's details.
  - `DELETE /courses/:id`: Delete a course.

### 5. **Enrollment Service**
- **Endpoints**:
  - `POST /enrollment/:studentId/course/:courseId`: Enroll a student in a course.
  - `GET /enrollment/student/:studentId`: Get all courses for a student.
  - `GET /enrollment/course/:courseId`: Get all students enrolled in a course.

### 6. **Audit Service**
- **Functionality**:
  - Consumes logs from the Kafka topic (`app-logs`).
  - Writes logs to a persistent log file located at `/app/logs/audit.log`.

---

## Kafka Integration

### Producer: API Gateway
- The API Gateway sends logs to a Kafka topic (`app-logs`) using a Kafka producer.
- Logs include request and response details for all API calls.

### Consumer: Audit Service
- The Audit Service consumes logs from the Kafka topic (`app-logs`) and writes them to a persistent log file.
- Logs are stored in a directory mounted on a persistent volume.

---


## Setup and Installation

## Running the Microservices Bundle Locally with Minikube

This section provides step-by-step instructions to set up Minikube and `kubectl` on your local machine and deploy the microservices bundle using the `deploy.sh` script.

---

### Prerequisites

1. **Minikube**:
   - Install Minikube by following the official guide: [Minikube Installation](https://minikube.sigs.k8s.io/docs/start/).
   - Verify the installation:
     ```bash
     minikube version
     ```

2. **kubectl**:
   - Install `kubectl` by following the official guide: [kubectl Installation](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
   - Verify the installation:
     ```bash
     kubectl version --client
     ```

3. **Docker**:
   - Ensure Docker is installed and running on your machine.
   - Verify the installation:
     ```bash
     docker --version
     ```

---

### Steps to Deploy the Microservices Bundle

1. **Start Minikube**:
   - Start Minikube if it is not already running:
     ```bash
     minikube start
     ```

2. **Switch Docker to Minikube's Daemon**:
   - Configure Docker to use Minikube's Docker daemon:
     ```bash
     eval $(minikube docker-env)
     ```

3. **Clone the Repository**:
   - Clone the project repository to your local machine:
     ```bash
     git clone https://github.com/2023tm93733/Scalable-Services-Assignment.git
     cd scalable-services-bundle
     ```

4. **Make the Deploy Script Executable**:
   - Ensure the `deploy.sh` script is executable:
     ```bash
     chmod +x deploy.sh
     ```

5. **Run the Deploy Script**:
   - Execute the `deploy.sh` script to build and deploy the microservices:
     ```bash
     ./deploy.sh
     ```

6. **Access the API Gateway**:
   - Once the script completes, the API Gateway will be accessible at:
     ```
     http://localhost:30080
     ```

---

### What the `deploy.sh` Script Does

1. **Starts Minikube** (if not already running).
2. **Switches Docker to Minikube's Daemon** to build images directly in Minikube's environment.
3. **Generates RSA Keys for JWT**:
   - The script generates a private-public key pair (`private.pem` and `public.pem`) for JWT signing and verification using the RS256 algorithm.
   - These keys are stored in a `keys` directory.
4. **Creates Kubernetes Secrets for JWT Keys**:
   - The generated keys are securely stored as Kubernetes secrets (`jwt-keys`) and mounted into the `ss-auth-service` and `ss-api-gateway` pods.
5. **Builds Docker Images**:
   - Builds Docker images for all microservices without using the cache.
6. **Deploys PostgreSQL**:
   - Deploys the PostgreSQL database and waits for it to be ready.
7. **Initializes the Database Schema**:
   - Runs a Kubernetes Job to initialize the database schema.
8. **Deploys Core Microservices**:
   - Authentication Service
   - Student Service
   - Faculty Service
   - Course Service
   - Enrollment Service
9. **Deploys the API Gateway**:
   - Deploys the API Gateway and waits for it to be ready.
10. **Sets Up Port Forwarding**:
    - Forwards the API Gateway service to `localhost:30080`.

---

### Verifying the Deployment

1. **Check Services**:
   - Ensure all services are running:
     ```bash
     kubectl get services
     ```

2. **Check Pods**:
   - Ensure all pods are running and ready:
     ```bash
     kubectl get pods
     ```

3. **Test the API Gateway**:
   - Use `curl` or Postman to test the `/health` endpoint:
     ```bash
     curl http://localhost:30080/health
     ```

4. **Verify JWT Keys**:
   - Ensure the `jwt-keys` secret is created:
     ```bash
     kubectl get secrets
     ```
   - Check that the keys are mounted in the `ss-auth-service` pod:
     ```bash
     kubectl exec -it <pod-name> -- ls /app/keys
     ```

---

## Troubleshooting

1. **Check Logs**:
   - If a service fails, check its logs:
     ```bash
     kubectl logs <pod-name>
     ```

2. **Restart Minikube**:
   - If Minikube encounters issues, restart it:
     ```bash
     minikube stop
     minikube start
     ```

3. **Re-run the Deploy Script**:
   - If deployment fails, re-run the script:
     ```bash
     [deploy.sh](http://_vscodecontentref_/2)
     ```

## Verifying Kafka Integration

1. **Check Kafka Logs**:
   - Verify that the API Gateway is producing logs to the Kafka topic:
     ```bash
     kubectl logs <api-gateway-pod-name>
     ```

2. **Check Audit Logs**:
   - Verify that the Audit Service is consuming logs and writing them to the file:
     ```bash
     kubectl exec -it <audit-service-pod-name> -- cat /app/logs/audit.log
     ```

---

## API Documentation

### Swagger Documentation
The Swagger documentation for the microservices is available at the following endpoint once the services are running:
```
http://localhost:30080/swagger-ui
```
This provides an interactive API documentation interface for testing and exploring the available endpoints.

### Postman Collection
A Postman collection is included in the project repository for testing the API endpoints. You can find the collection file in the parent directory of the project:
```
./postman_collection.json
```
To use the collection:
1. Open Postman.
2. Import the collection file by navigating to `File > Import` and selecting the `.json` file.
3. Use the pre-configured requests to test the API endpoints.

--- 

By following these steps, you can deploy and run the entire microservices bundle locally using Minikube. Let me know if you encounter any issues!