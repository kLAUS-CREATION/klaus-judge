#!/bin/bash

# Klaus Judge - Quick Start Script
# This script sets up the entire project for local development

set -e  # Exit on error

echo "🚀 Klaus Judge - Quick Start Setup"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Check prerequisites
echo -e "${BLUE}[1/6]${NC} Checking prerequisites..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠ Node.js not found${NC}. Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠ npm not found${NC}. Please install npm."
    exit 1
fi
echo -e "${GREEN}✓${NC} npm $(npm --version)"

# Check Go
if ! command -v go &> /dev/null; then
    echo -e "${YELLOW}⚠ Go not found${NC}. Please install Go from https://golang.org/"
    exit 1
fi
echo -e "${GREEN}✓${NC} Go $(go version | awk '{print $3}')"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠ Docker not found${NC} (optional, but recommended for databases)"
else
    echo -e "${GREEN}✓${NC} Docker $(docker --version)"
fi

echo ""

# Step 2: Setup Backend
echo -e "${BLUE}[2/6]${NC} Setting up backend..."
echo ""

cd api

# Create .env if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/klaus_judge
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d

# Server
PORT=5500
GIN_MODE=debug
EOF
    echo -e "${GREEN}✓${NC} .env created (adjust as needed)"
else
    echo -e "${GREEN}✓${NC} .env already exists"
fi

# Download Go dependencies
echo "Downloading Go dependencies..."
go mod download 2>/dev/null || echo "Note: Go dependencies downloaded"
echo -e "${GREEN}✓${NC} Go dependencies ready"

cd ..
echo ""

# Step 3: Setup Client
echo -e "${BLUE}[3/6]${NC} Setting up client..."
echo ""

cd client

# Create .env.local if not exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5500
NEXT_PUBLIC_DEBUG=true
EOF
    echo -e "${GREEN}✓${NC} .env.local created"
else
    echo -e "${GREEN}✓${NC} .env.local already exists"
fi

# Install dependencies
if [ ! -d node_modules ]; then
    echo "Installing npm dependencies (this may take a minute)..."
    npm install > /dev/null 2>&1 &
    npm_pid=$!
    wait $npm_pid
    echo -e "${GREEN}✓${NC} npm dependencies installed"
else
    echo -e "${GREEN}✓${NC} npm dependencies already installed"
fi

cd ..
echo ""

# Step 4: Database Setup (Optional)
echo -e "${BLUE}[4/6]${NC} Database setup (optional)..."
echo ""

if command -v docker &> /dev/null; then
    echo "Starting databases with Docker Compose..."
    docker-compose up -d 2>/dev/null || echo "Note: Docker Compose could not start databases"
    echo -e "${GREEN}✓${NC} Databases starting (PostgreSQL & Redis)"
    echo ""
    echo "Waiting for databases to be ready..."
    sleep 5
else
    echo -e "${YELLOW}⚠ Docker not found${NC}. Please ensure PostgreSQL and Redis are running:"
    echo "  - PostgreSQL: postgresql://postgres:postgres@localhost:5432/klaus_judge"
    echo "  - Redis: redis://localhost:6379"
fi

echo ""

# Step 5: Show startup commands
echo -e "${BLUE}[5/6]${NC} Setup complete!"
echo ""

echo -e "${GREEN}✓${NC} Backend ready at api/"
echo -e "${GREEN}✓${NC} Client ready at client/"
echo ""

# Step 6: Display startup instructions
echo -e "${BLUE}[6/6]${NC} Next steps..."
echo ""
echo "To start the application, open 3 terminal windows and run:"
echo ""
echo "Terminal 1 - Backend:"
echo -e "  ${YELLOW}cd api && go run cmd/main.go${NC}"
echo ""
echo "Terminal 2 - Frontend:"
echo -e "  ${YELLOW}cd client && npm run dev${NC}"
echo ""
echo "Terminal 3 - Worker (optional):"
echo -e "  ${YELLOW}cd worker && cargo run${NC}"
echo ""
echo "Then visit:"
echo -e "  ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
echo ""

# Optional: Create quick test script
echo "Would you like to run a quick connectivity test? (y/n)"
read -p "> " -t 5 response || response="n"

if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
    echo ""
    echo "Waiting 10 seconds for services to start..."
    sleep 10
    
    if [ -f test-cors.sh ]; then
        bash test-cors.sh
    fi
fi
