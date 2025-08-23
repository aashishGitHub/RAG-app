@echo off
echo 🚀 Setting up RAG Chat Application with Couchbase
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd server
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

cd ..

REM Create .env file if it doesn't exist
if not exist "server\.env" (
    echo 🔧 Creating environment configuration file...
    copy "server\env.example" "server\.env"
    echo ⚠️  Please edit server\.env with your Couchbase and OpenAI credentials
) else (
    echo ✅ Environment file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Edit server\.env with your credentials
echo 2. Ensure Couchbase is running at http://localhost:8091
echo 3. Create vector search index in Couchbase UI
echo 4. Start the backend: cd server ^&^& npm run dev
echo 5. Start the frontend: npm run dev
echo.
echo 📖 For detailed setup instructions, see README.md
echo 🔗 Couchbase RAG Guide: https://www.couchbase.com/blog/guide-to-data-prep-for-rag/
pause
