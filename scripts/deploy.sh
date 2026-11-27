
#!/usr/bin/env bash

set -euo pipefail

DEPLOY_DIR="/home/ubuntu/task-management-rest"
COMPOSE_FILE="docker-compose.prod.yml"
PROJECT_NAME="task-management-rest"

IMAGE_TAG="${1:?Image tag is required}"

export IMAGE_TAG

cd "$DEPLOY_DIR"

# Prevent simultaneous deployments on EC2
exec 9>".deploy.lock"
flock -w 300 9

echo "========================================"
echo "Starting application deployment"
echo "Image tag: $IMAGE_TAG"
echo "========================================"

# Verify required files
test -f .env
test -f "$COMPOSE_FILE"

compose() {
    docker compose \
        -p "$PROJECT_NAME" \
        -f "$COMPOSE_FILE" \
        "$@"
}

# Validate Docker Compose configuration
echo "Validating Compose configuration..."
compose config --quiet

# Pull the exact published Docker image
echo "Pulling Docker image..."
compose pull api

# Recreate containers and wait for health checks
echo "Starting application containers..."
compose up -d --wait --wait-timeout 180

# Verify application health
echo "Checking application health..."
curl --fail --silent --show-error \
    --max-time 10 \
    http://127.0.0.1:5000/health

echo ""

# Persist the successfully deployed image tag
echo "Saving deployed image tag..."

if grep -q '^IMAGE_TAG=' .env; then
    sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$IMAGE_TAG/" .env
else
    printf '\nIMAGE_TAG=%s\n' "$IMAGE_TAG" >> .env
fi

chmod 600 .env

# Display container status
echo "Container status:"
compose ps

# Display deployed image
echo "Deployed image:"
docker inspect production-api \
    --format '{{.Config.Image}}'

echo "========================================"
echo "Deployment completed successfully"
echo "========================================"
