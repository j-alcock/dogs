#!/bin/bash

# Pact Broker Setup Script
# This script sets up a local Pact broker for contract testing

echo "🐕 Setting up Pact Broker for Dog Breeds Contract Testing"
echo "=========================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Pact broker is already running
if docker ps | grep -q "pact-broker"; then
    echo "✅ Pact broker is already running"
    echo "🌐 Access Pact broker at: http://localhost:9292"
    exit 0
fi

echo "🚀 Starting Pact broker..."

# Create a Docker network for the broker
docker network create pact-broker-network 2>/dev/null || true

# Start PostgreSQL for Pact broker
echo "📦 Starting PostgreSQL database..."
docker run -d \
    --name pact-broker-postgres \
    --network pact-broker-network \
    -e POSTGRES_PASSWORD=pact_broker \
    -e POSTGRES_USER=pact_broker \
    -e POSTGRES_DB=pact_broker \
    postgres:13

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Start Pact broker
echo "🌐 Starting Pact broker..."
docker run -d \
    --name pact-broker \
    --network pact-broker-network \
    -p 9292:9292 \
    -e PACT_BROKER_DATABASE_URL=postgres://pact_broker:pact_broker@postgres/pact_broker \
    -e PACT_BROKER_BASIC_AUTH_USERNAME=pact \
    -e PACT_BROKER_BASIC_AUTH_PASSWORD=pact \
    -e PACT_BROKER_PUBLIC_HEARTBEAT=true \
    pactfoundation/pact-broker:latest

# Wait for broker to be ready
echo "⏳ Waiting for Pact broker to be ready..."
sleep 15

# Check if broker is running
if curl -s http://localhost:9292 > /dev/null; then
    echo "✅ Pact broker is running successfully!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   • Pact Broker: http://localhost:9292"
    echo "   • Username: pact"
    echo "   • Password: pact"
    echo ""
    echo "📚 Next steps:"
    echo "   1. Run consumer tests: npm run test:pact:consumer"
    echo "   2. Run provider tests: npm run test:pact:provider"
    echo "   3. View contracts in the broker"
    echo ""
    echo "🔧 To stop the broker:"
    echo "   docker stop pact-broker pact-broker-postgres"
    echo "   docker rm pact-broker pact-broker-postgres"
else
    echo "❌ Failed to start Pact broker. Check Docker logs:"
    echo "   docker logs pact-broker"
    exit 1
fi 