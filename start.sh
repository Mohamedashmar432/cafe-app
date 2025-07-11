#!/bin/bash

echo "🚀 Starting Cafe Billing Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    if check_port $1; then
        echo -e "${YELLOW}Port $1 is in use. Killing existing process...${NC}"
        lsof -ti:$1 | xargs kill -9
        sleep 2
    fi
}

# Check and kill existing processes
kill_port 5000
kill_port 8080

# Start backend
echo -e "${BLUE}📦 Starting Backend Server...${NC}"
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
sleep 5

# Check if backend is running
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:5000${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    exit 1
fi

# Start frontend
echo -e "${BLUE}🌐 Starting Frontend Server...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo -e "${YELLOW}⏳ Waiting for frontend to start...${NC}"
sleep 8

# Check if frontend is running
if curl -s http://localhost:8080/ > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running on http://localhost:8080${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Cafe Billing Application is now running!${NC}"
echo ""
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:8080"
echo -e "${BLUE}🔧 Backend API:${NC} http://localhost:5000"
echo -e "${BLUE}🏥 Health Check:${NC} http://localhost:5000/health"
echo ""
echo -e "${YELLOW}🔑 Default Login Credentials:${NC}"
echo -e "   Employee ID: ${GREEN}0001${NC}"
echo -e "   Password: ${GREEN}admin123${NC}"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop both servers${NC}"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
wait 