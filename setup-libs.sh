#!/bin/bash

# Script to setup the libs package

echo "Setting up @weather-api/shared package..."

cd libs

echo "Building libs package..."
npm run build

cd ..

echo "Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "You can now run tests using Docker:"
echo "  docker-compose -f docker-compose.test.yml up --build"
echo ""
echo "Or run individual service tests:"
echo "  npm run test:weather:unit"
echo "  npm run test:weather:integration"
echo "  npm run test:subscription:unit"
echo "  npm run test:subscription:integration"
echo ""
