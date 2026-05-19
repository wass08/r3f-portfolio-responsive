#!/bin/bash
# AI Twin Quick Start Script
# Run this to set up the AI Twin backend

echo "🤖 AI Twin Setup"
echo "==============="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install express cors dotenv

echo ""
echo "✅ Dependencies installed!"
echo ""

# Create .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    echo "# AI Twin API Configuration" > .env
    echo "ANTHROPIC_API_KEY=your_api_key_here" >> .env
    echo ""
    echo "✅ .env file created!"
    echo ""
    echo "📌 IMPORTANT: Edit .env file and add your ANTHROPIC_API_KEY"
    echo "   Get your API key from: https://console.anthropic.com"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your ANTHROPIC_API_KEY"
echo "2. Run: node ai-twin-server.js (in one terminal)"
echo "3. Run: npm run dev (in another terminal)"
echo ""
