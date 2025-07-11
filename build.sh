#!/bin/bash

echo "🏗️  Building Cafe Billing Application for Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend dependencies installation failed${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend dependencies installation failed${NC}"
    exit 1
fi

cd ..

echo -e "${BLUE}🗄️  Initializing database...${NC}"
cd backend
npm run init-db

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database initialization failed${NC}"
    exit 1
fi

cd ..

echo -e "${BLUE}🌐 Building frontend for production...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Production build completed successfully!${NC}"
echo ""
echo -e "${BLUE}📁 Build artifacts:${NC}"
echo -e "   Frontend: ${GREEN}dist/${NC}"
echo -e "   Backend: ${GREEN}backend/${NC}"
echo -e "   Database: ${GREEN}backend/data/cafe.db${NC}"
echo ""
echo -e "${YELLOW}🚀 To start the application:${NC}"
echo -e "   ./start.sh"
echo ""
echo -e "${YELLOW}📋 Production deployment checklist:${NC}"
echo -e "   ✅ Set NODE_ENV=production"
echo -e "   ✅ Configure JWT_SECRET"
echo -e "   ✅ Set up proper CORS origins"
echo -e "   ✅ Configure database (PostgreSQL/MySQL for production)"
echo -e "   ✅ Set up SSL/TLS certificates"
echo -e "   ✅ Configure reverse proxy (nginx)"
echo -e "   ✅ Set up logging and monitoring" 