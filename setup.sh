#!/bin/bash

echo "🚀 Setting up RAG Chat Application with Couchbase"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "🔧 Creating environment configuration file..."
    cp server/env.example server/.env
    echo "⚠️  Please edit server/.env with your Couchbase and OpenAI credentials"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit server/.env with your credentials"
echo "2. Ensure Couchbase is running at http://localhost:8091"
echo "3. Create vector search index in Couchbase UI"
echo "4. Start the backend: cd server && npm run dev"
echo "5. Start the frontend: npm run dev"
echo ""
echo "📖 For detailed setup instructions, see README.md"
echo "🔗 Couchbase RAG Guide: https://www.couchbase.com/blog/guide-to-data-prep-for-rag/"
