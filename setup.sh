#!/bin/bash

set -e

DB_CONTAINER="medina-db-1"  # Replace with your actual container name if different
SQL_FILE="./backend/medina.sql"
DB_NAME="medina"
DB_USER="root"
DB_PASSWORD="22022006"

echo "🚀 Building and starting Docker containers..."
docker-compose up -d --build

echo "⏳ Waiting for MySQL to become available..."
until docker exec "$DB_CONTAINER" mysql -u"$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME;" &> /dev/null; do
  sleep 2
done

echo "✅ MySQL is ready."

echo "📥 Importing $SQL_FILE into '$DB_NAME' database..."
docker exec -i "$DB_CONTAINER" sh -c "exec mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME" < "$SQL_FILE"

echo "✅ SQL import completed."
