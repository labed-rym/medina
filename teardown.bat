@echo off

set PROJECT_NAME=medina

echo 🛑 Stopping and removing containers...
docker-compose down

echo 🧹 Removing associated volume...
docker volume rm %PROJECT_NAME%_db_data

echo 🗑️  Removing images...
docker rmi %PROJECT_NAME%_frontend
docker rmi %PROJECT_NAME%_backend
docker rmi mysql:8.0

echo ✅ Teardown complete.
