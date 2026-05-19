@echo off
REM AI Twin Quick Start Script (Windows)
REM Run this to set up the AI Twin backend

echo.
echo 🤖 AI Twin Setup
echo ===============
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found:
node --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install express cors dotenv

echo.
echo ✅ Dependencies installed!
echo.

REM Create .env file
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo # AI Twin API Configuration
        echo ANTHROPIC_API_KEY=your_api_key_here
    ) > .env
    echo.
    echo ✅ .env file created!
    echo.
    echo 📌 IMPORTANT: Edit .env file and add your ANTHROPIC_API_KEY
    echo    Get your API key from: https://console.anthropic.com
) else (
    echo ✅ .env file already exists
)

echo.
echo 🚀 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env and add your ANTHROPIC_API_KEY
echo 2. Run: node ai-twin-server.js (in one terminal)
echo 3. Run: npm run dev (in another terminal)
echo.
pause
