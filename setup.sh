#!/bin/bash

echo "🌱 Setting up AgriTech AI System Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please update your .env file with your MongoDB URL and other configurations."
    echo "🔗 MongoDB Atlas: https://cloud.mongodb.com/"
else
    echo "✅ .env file found"
fi

# Create logs directory
mkdir -p logs
echo "📁 Created logs directory"

# Create uploads directory
mkdir -p uploads
echo "📁 Created uploads directory"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env file with your MongoDB URL"
echo "2. Run: npm run init-db (to initialize the database)"
echo "3. Run: npm run dev (to start the development server)"
echo ""
echo "🔗 Default URLs:"
echo "   - Main site: http://localhost:3000"
echo "   - API health: http://localhost:3000/api/health"
echo "   - Farmer portal: http://localhost:3000/farmer-login"
echo "   - Agent portal: http://localhost:3000/agent-login"
echo ""
echo "🔑 Default login credentials:"
echo "   - Farmer: farmer@example.com / farmer123"
echo "   - Agent: agent@example.com / agent123"
