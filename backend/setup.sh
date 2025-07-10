#!/bin/bash

echo "🚀 Setting up Cafe Billing Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created from template"
    echo "⚠️  Please review and update the .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

# Create data directory
echo "📁 Creating data directory..."
mkdir -p data

# Initialize database
echo "🗄️  Initializing database..."
npm run init-db

if [ $? -ne 0 ]; then
    echo "❌ Failed to initialize database"
    exit 1
fi

echo "✅ Database initialized successfully"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Review and update the .env file if needed"
echo "2. Start the server with: npm run dev"
echo "3. The API will be available at: http://localhost:5000"
echo "4. Health check: http://localhost:5000/health"
echo ""
echo "🔑 Default admin credentials:"
echo "   Employee ID: 0001"
echo "   Password: admin123"
echo "   ⚠️  Change the password immediately after first login!"
echo ""
echo "📚 For more information, see README.md" 