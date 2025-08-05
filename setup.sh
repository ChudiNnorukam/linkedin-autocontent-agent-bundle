#!/bin/bash

# LinkedIn AutoContent Agent Bundle Setup Script
# This script helps you set up the LinkedIn AutoContent Agent Bundle

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 LinkedIn AutoContent Agent Bundle Setup${NC}"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ is required${NC}"
    echo "Current version: $(node -v)"
    echo "Please upgrade to Node.js 18+"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) is installed${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}🔧 Creating .env file...${NC}"
    cp env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env file with your LinkedIn API credentials${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Set proper permissions on .env file
chmod 600 .env
echo -e "${GREEN}✅ Set secure permissions on .env file${NC}"

# Create necessary directories
echo -e "${BLUE}📁 Creating necessary directories...${NC}"
mkdir -p logs
mkdir -p data/analytics
mkdir -p data/reports
mkdir -p data/scheduled
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/fixtures
mkdir -p tests/mocks

echo -e "${GREEN}✅ Directories created${NC}"

# Initialize git repository if not already done
if [ ! -d .git ]; then
    echo -e "${BLUE}🔧 Initializing git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit: LinkedIn AutoContent Agent Bundle"
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${GREEN}✅ Git repository already exists${NC}"
fi

# Run tests to verify setup
echo -e "${BLUE}🧪 Running tests to verify setup...${NC}"
if npm test > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Tests passed${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed (this is normal for initial setup)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Edit .env file with your LinkedIn API credentials"
echo "2. Set up your LinkedIn Developer App"
echo "3. Get your LinkedIn API credentials"
echo "4. Test the system with: npm start"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "- README.md - Complete setup guide"
echo "- CONTRIBUTING.md - Development guidelines"
echo "- CHANGELOG.md - Version history"
echo ""
echo -e "${BLUE}Support:${NC}"
echo "- GitHub Issues: https://github.com/yourusername/linkedin-autocontent-agent-bundle/issues"
echo "- GitHub Discussions: https://github.com/yourusername/linkedin-autocontent-agent-bundle/discussions"
echo ""
echo -e "${GREEN}Happy automating! 🚀${NC}" 