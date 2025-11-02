#!/bin/bash
set -e

echo "========================================="
echo "Starting Render Build Process"
echo "========================================="

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Build the React frontend
echo "🎨 Building React frontend..."
cd client
npm ci
npm run build
cd ..

echo "✅ Build completed successfully!"
echo "========================================="

