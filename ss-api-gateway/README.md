# SS API Gateway

The API Gateway for the Scalable Services Architecture. It acts as the single entry point for all client requests, handling routing, authentication, rate limiting, logging, and proxying to downstream microservices. It also integrates with Kafka for centralized, persistent logging and exposes interactive API documentation via Swagger.

---

## Features

- **Centralized Routing:** Proxies requests to Auth, Student, Course, Faculty, and Enrollment services.
- **Authentication & Authorization:** JWT-based, with RBAC enforced at the gateway.
- **Rate Limiting:** Configurable per-IP rate limiting.
- **Request/Response Logging:** Logs all API traffic to console, file, and Kafka.
- **Kafka Integration:** Sends logs to a Kafka topic (`app-logs`) for audit and monitoring.
- **Swagger UI:** Interactive OpenAPI docs at `/swagger-ui`.
- **Security:** Uses Helmet, CORS, and trace headers for enhanced security and observability.
- **Graceful Shutdown:** Handles SIGTERM/SIGINT for safe shutdowns.

---

## Folder Structure

```
ss-api-gateway/
├── deployment.yaml
├── Dockerfile
├── package.json
├── README.md
├── swagger.yml
├── tsconfig.json
├── .env.example
├── keys/
│   ├── private.pem
│   └── public.pem
├── logs/
│   └── app.log
└── src/
    ├── app.ts
    ├── server.ts
    ├── config/
    │   └── index.ts
    ├── middlewares/
    │   ├── auth.ts
    │   ├── errorHandler.ts
    │   ├── rateLimiter.ts
    │   └── requestResponseLogger.ts
    ├── routes/
    │   ├── index.ts
    │   └── swagger.ts
    └── utils/
        ├── kafkaAdmin.ts
        ├── kafkaProducer.ts
        ├── logger.ts
        └── proxy.ts
```

---

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```env
PORT=8080
REQUEST_TIMEOUT=10000
RATE_LIMIT_POINTS=10
RATE_LIMIT_DURATION=60
MAX_RETRIES=3

AUTH_SERVICE_URL=http://auth-service:8081/
STUDENT_SERVICE_URL=http://student-service:8082/
COURSE_SERVICE_URL=http://course-service:8083/
FACULTY_SERVICE_URL=http://faculty-service:8084/
ENROLLMENT_SERVICE_URL=http://enrollment-service:8085/

KAFKA_URL=kafka.ums.svc.cluster.local:9092
KAFKA_CLIENT_ID=api-gateway
KAFKA_TOPIC=app-logs
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- Docker
- Kafka cluster (local or remote)
- Downstream microservices running and accessible

### Install & Build

```bash
npm install
npm run build
```

### Start

```bash
npm run start
```

---

## Docker

### Build

```bash
docker build -t ss-api-gateway:latest .
```

### Run

```bash
docker run --env-file .env -p 8080:8080 ss-api-gateway:latest
```

---

## Kubernetes Deployment

See `deployment.yaml`:

```bash
kubectl apply -f deployment.yaml
```

This will:
- Deploy the API Gateway with environment variables and JWT keys mounted from Kubernetes secrets.
- Expose the service on NodePort `30080`.

---

## Kafka Logging

All API request/response logs are sent to the `app-logs` Kafka topic.

- See: `src/utils/logger.ts` and `src/utils/kafkaProducer.ts`
- The Audit Service (not included here) can consume these logs for persistent storage or monitoring.

---

## API Documentation

- **Swagger UI:** http://localhost:30080/swagger-ui  
- **OpenAPI Spec:** `swagger.yml`

---

## Key Endpoints

- `GET /health` — Health check  
- `POST /auth/login` — User login  
- `POST /auth/signup` — User signup  
- `/students`, `/courses`, `/faculty`, `/enrollment` — Proxied to respective services (with RBAC enforced)

---

## Security

- **JWT Auth:** Uses RS256 public/private key pair (see `keys/`).
- **Helmet:** Sets secure HTTP headers.
- **CORS:** Configurable allowed origins.
- **Rate Limiting:** Prevents abuse.
- **Traceability:** Adds `x-trace-id` to all requests.

---

## Development

- Hot reload: `npm run dev`
- Linting/Formatting: Add your preferred tools.

---

## Troubleshooting

- **Logs:** See `logs/app.log` or your Kafka consumer.
- **Kafka:** Ensure the topic exists and the broker is reachable.
- **JWT:** Ensure keys are mounted and valid.
- **Downstream Services:** Check service URLs and health.

---

## License

MIT

---

## Credits

Built with Express, Winston, KafkaJS, Swagger UI Express, and more.

---
