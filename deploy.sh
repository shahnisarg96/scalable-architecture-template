#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# 0. If Minikube is installed but not running, start it; then switch Docker to Minikube's daemon
if command -v minikube &>/dev/null; then
    if ! minikube status --format='{{.Host}}' 2>/dev/null | grep -q Running; then
        echo "🟢 Minikube not running; starting Minikube..."
        minikube start
    fi
    echo "🔄 Switching to Minikube Docker daemon"
    eval "$(minikube docker-env)"
else
    echo "⚪ Minikube not detected — skipping docker context switch"
fi

# 1. Prune Docker builder cache to ensure truly fresh builds
echo "🧹 Pruning Docker builder cache in Minikube..."
# docker builder prune --all --force || true

echo "🟡 Starting Kubernetes deployment..."

# 2. Generate RSA keys for JWT signing
echo "🔑 Generating RSA keys for JWT..."
mkdir -p keys
openssl genpkey -algorithm RSA -out keys/private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in keys/private.pem -out keys/public.pem

# 3. Create Kubernetes secrets for the keys
echo "🔒 Creating Kubernetes secrets for JWT keys..."
kubectl create secret generic jwt-keys \
    --from-file=private.pem=keys/private.pem \
    --from-file=public.pem=keys/public.pem \
    --dry-run=client -o yaml | kubectl apply -f -

# 4. Build Docker images without cache
docker build -t ss-auth-service ./ss-auth-service
docker build -t ss-api-gateway ./ss-api-gateway
docker build -t student-service ./UMS-Student-Service
docker build -t faculty-service ./UMS-Faculty-Service
docker build -t course-service ./UMS-Course-Service
docker build -t enrollment-service ./UMS-Enrollment-Service

# 5. Deploy PostgreSQL
echo "📦 Deploying PostgreSQL..."
kubectl apply -f ss-postgres-service/

# 6. Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL pod to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s

# 7. Initialize database schema via Job
echo "🚧 Initializing database schema..."
kubectl apply -f ss-postgres-service/db-init-job.yaml
echo "⏳ Waiting for db-init job to complete..."
kubectl wait --for=condition=complete job/db-init --timeout=120s

# 8. Deploy core microservices
echo "🚀 Deploying Microservices..."
kubectl apply -f ss-auth-service/deployment.yaml
kubectl apply -f UMS-Course-Service/deployment.yaml
kubectl apply -f UMS-Student-Service/deployment.yaml
kubectl apply -f UMS-Faculty-Service/deployment.yaml
kubectl apply -f UMS-Enrollment-Service/deployment.yaml

# 9. Deploy API Gateway
echo "🌐 Deploying API Gateway..."
kubectl apply -f ss-api-gateway/deployment.yaml

# 10. Print all services and pods
echo "✅ All services deployed. Access info:"
kubectl get services
echo "✅ All pods deployed. Access info:"
kubectl get pods
echo "🎉 Deployment complete!"

# 11. Port-forward the API Gateway service to localhost:30080
kubectl wait --for=condition=ready pod -l app=api-gateway --timeout=120s
echo "🔁 Setting up port forwarding from localhost:30080 to api-gateway-service..."
echo "🔗 Access the API Gateway now at: http://localhost:30080"
kubectl port-forward service/api-gateway-service 30080:8080