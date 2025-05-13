#!/bin/bash

set -e

PROJECT_NAME="medina"  # Change this if your project is named differently

echo "🛑 Stopping and removing containers..."
docker-compose down

echo "🧹 Removing associated volumes..."
docker volume rm ${PROJECT_NAME}_db_data || echo "No volume to remove."

echo "🗑️  Removing images..."
docker rmi ${PROJECT_NAME}_frontend || echo "Frontend image not found."
docker rmi ${PROJECT_NAME}_backend || echo "Backend image not found."
docker rmi mysql:8.0 || echo "MySQL image not removed (may be shared)."

echo "✅ Teardown complete."
