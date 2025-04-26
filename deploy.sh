#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "🚀 Starting deployment script..."

# Utility: Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

# 1. Check required commands: minikube, kubectl, docker, openssl
echo "🔍 Checking required command-line tools..."
required_commands=(minikube kubectl docker openssl)
for cmd in "${required_commands[@]}"; do
    if ! command -v $cmd &>/dev/null; then
        echo -e "${RED}❌ '$cmd' is required but not installed. Please install it first.${NC}"
        exit 1
    fi
done
echo "✅ All required tools are installed."

# 2. Verify Docker daemon is running
echo "🐳 Verifying Docker daemon status..."
if ! docker info &>/dev/null; then
    echo -e "${RED}❌ Docker daemon not running! Please start Docker.${NC}"
    exit 1
fi
echo "✅ Docker daemon is running."

# 3. Ensure Minikube is running and set Docker daemon environment
echo "☸️ Checking Minikube status..."
if ! minikube status --format='{{.Host}}' 2>/dev/null | grep -q Running; then
    echo "${YELLOW}🟡 Minikube not running; starting Minikube...${NC}"
    minikube start
fi
echo "✅ Minikube is running."

# 4. Force kubectl to use minikube context
echo "⚙️ Setting kubectl context to Minikube..."
kubectl config use-context minikube || { echo -e "${RED}❌ Failed to switch kubectl context to Minikube.${NC}"; exit 1; }
echo "✅ kubectl context is set to 'minikube'."

# 5. Set Docker daemon to Minikube environment
echo "🔄 Switching to Minikube Docker daemon environment..."
eval "$(minikube docker-env)"
echo "✅ Docker daemon is now using the Minikube environment."

# 6. (Optional) Create a Kubernetes namespace for the application
NAMESPACE="university-ms"
echo "🏷️ Creating namespace: $NAMESPACE if it doesn't exist..."
kubectl create namespace "$NAMESPACE" 2>/dev/null || true
echo "✅ Namespace '$NAMESPACE' created (if it didn't exist)."

# 7. (Optional) Prune Docker builder cache in Minikube
echo "🧹 Pruning Docker builder cache in Minikube (optional)..."
# docker builder prune --all --force || true
echo "ℹ️ Docker builder cache pruning skipped (commented out)."

# 8. Generate RSA keys for JWT signing
echo "🔑 Generating RSA keys for JWT authentication..."
mkdir -p keys
openssl genpkey -algorithm RSA -out keys/private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in keys/private.pem -out keys/public.pem
echo "✅ RSA keys generated in the 'keys' directory."

# 9. Create Kubernetes secrets for the JWT keys in the specified namespace
echo "🔒 Creating Kubernetes secrets for JWT keys in namespace: $NAMESPACE..."
kubectl create secret generic jwt-keys \
    --from-file=private.pem=keys/private.pem \
    --from-file=public.pem=keys/public.pem \
    -n "$NAMESPACE" \
    --dry-run=client -o yaml | kubectl apply -f -
echo "✅ Kubernetes secret 'jwt-keys' created in namespace '$NAMESPACE'."

# 10. Build Docker images for all microservices
echo "🐳 Building Docker images for microservices..."
docker build -t ss-auth-service ./ss-auth-service
echo "✅ Docker image 'ss-auth-service' built."
docker build -t ss-api-gateway ./ss-api-gateway
echo "✅ Docker image 'ss-api-gateway' built."
docker build -t student-service ./UMS-Student-Service
echo "✅ Docker image 'student-service' built."
docker build -t faculty-service ./UMS-Faculty-Service
echo "✅ Docker image 'faculty-service' built."
docker build -t course-service ./UMS-Course-Service
echo "✅ Docker image 'course-service' built."
docker build -t enrollment-service ./UMS-Enrollment-Service
echo "✅ Docker image 'enrollment-service' built."

# 11. Deploy PostgreSQL database in the specified namespace
echo "📦 Deploying PostgreSQL database in namespace: $NAMESPACE..."
kubectl apply -f ss-postgres-service/ -n "$NAMESPACE"
echo "✅ PostgreSQL deployment started in namespace '$NAMESPACE'."

# 12. Wait for PostgreSQL pod to be ready in the specified namespace
echo "⏳ Waiting for PostgreSQL pod to be ready in namespace: $NAMESPACE..."
kubectl wait --for=condition=ready pod -l app=postgres -n "$NAMESPACE" --timeout=120s
echo "✅ PostgreSQL pod is ready in namespace '$NAMESPACE'."

# 13. Initialize database schema using a Kubernetes Job in the specified namespace
echo "🚧 Initializing database schema in namespace: $NAMESPACE..."
kubectl apply -f ss-postgres-service/db-init-job.yaml -n "$NAMESPACE"
echo "✅ Database initialization job created in namespace '$NAMESPACE'."
echo "⏳ Waiting for db-init job to complete in namespace: $NAMESPACE..."
kubectl wait --for=condition=complete job/db-init -n "$NAMESPACE" --timeout=120s
echo "✅ Database schema initialized successfully in namespace '$NAMESPACE'."

# 14. Deploy core microservices in the specified namespace
echo "🚀 Deploying core microservices in namespace: $NAMESPACE..."
kubectl apply -f ss-auth-service/deployment.yaml -n "$NAMESPACE"
echo "✅ Auth service deployment started in namespace '$NAMESPACE'."
kubectl apply -f UMS-Course-Service/deployment.yaml -n "$NAMESPACE"
echo "✅ Course service deployment started in namespace '$NAMESPACE'."
kubectl apply -f UMS-Student-Service/deployment.yaml -n "$NAMESPACE"
echo "✅ Student service deployment started in namespace '$NAMESPACE'."
kubectl apply -f UMS-Faculty-Service/deployment.yaml -n "$NAMESPACE"
echo "✅ Faculty service deployment started in namespace '$NAMESPACE'."
kubectl apply -f UMS-Enrollment-Service/deployment.yaml -n "$NAMESPACE"
echo "✅ Enrollment service deployment started in namespace '$NAMESPACE'."

# 15. Deploy API Gateway in the specified namespace
echo "🌐 Deploying API Gateway in namespace: $NAMESPACE..."
kubectl apply -f ss-api-gateway/deployment.yaml -n "$NAMESPACE"
echo "✅ API Gateway deployment started in namespace '$NAMESPACE'."

# 16. Print all services in the specified namespace
echo -e "${GREEN}✅ All services deployed in namespace: $NAMESPACE. Services:${NC}"
kubectl get services -n "$NAMESPACE"

# 17. Print all pods in the specified namespace
echo -e "${GREEN}✅ All pods deployed in namespace: $NAMESPACE. Pods:${NC}"
kubectl get pods -n "$NAMESPACE"

echo "🎉 Deployment complete!"

# 18. Port-forward the API Gateway service to localhost:30080 in the specified namespace
echo "⏳ Waiting for API Gateway pod to be ready in namespace: $NAMESPACE..."
kubectl wait --for=condition=ready pod -l app=api-gateway -n "$NAMESPACE" --timeout=120s
echo "🔁 Setting up port forwarding from localhost:30080 to api-gateway-service in namespace: $NAMESPACE..."
echo -e "${YELLOW}⚠️ Keep this terminal open to access the API Gateway.${NC}"
echo "🔗 Access the API Gateway now at: http://localhost:30080"
kubectl port-forward service/api-gateway-service -n "$NAMESPACE" 30080:8080 &
echo -e "${YELLOW}ℹ️ Port forwarding is running in the background. You can access the API Gateway.${NC}"