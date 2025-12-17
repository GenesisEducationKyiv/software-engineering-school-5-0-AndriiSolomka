#!/bin/bash

# Script to verify libs package setup

set -e

echo "🔍 Verifying @weather-api/shared package setup..."
echo ""

# Check if libs/package.json exists
if [ ! -f "libs/package.json" ]; then
    echo "❌ libs/package.json not found"
    exit 1
fi
echo "✅ libs/package.json exists"

# Check if libs/tsconfig.json exists
if [ ! -f "libs/tsconfig.json" ]; then
    echo "❌ libs/tsconfig.json not found"
    exit 1
fi
echo "✅ libs/tsconfig.json exists"

# Check if libs/index.ts exists
if [ ! -f "libs/index.ts" ]; then
    echo "❌ libs/index.ts not found"
    exit 1
fi
echo "✅ libs/index.ts exists"

# Check if package.json contains the dependency
if ! grep -q "@weather-api/shared" package.json; then
    echo "❌ @weather-api/shared not found in package.json"
    exit 1
fi
echo "✅ @weather-api/shared found in package.json"

# Check if tsconfig.json contains paths
if ! grep -q "@weather-api/shared" tsconfig.json; then
    echo "❌ @weather-api/shared paths not found in tsconfig.json"
    exit 1
fi
echo "✅ @weather-api/shared paths configured in tsconfig.json"

# Check Dockerfiles
echo ""
echo "🐳 Checking Dockerfiles..."

DOCKERFILES=(
    "apps/weather/Dockerfile"
    "apps/weather/Dockerfile.test"
    "apps/weather/dockerfile.dev"
    "apps/subscription/Dockerfile"
    "apps/subscription/Dockerfile.test"
    "apps/subscription/Dockerfile.dev"
    "apps/gateway/Dockerfile"
    "apps/gateway/Dockerfile.test"
    "apps/gateway/Dockerfile.dev"
    "apps/email/Dockerfile"
    "apps/email/Dockerfile.test"
    "apps/email/dockerfile.dev"
    "apps/notification/Dockerfile"
    "apps/notification/Dockerfile.test"
    "apps/notification/Dockerfile.dev"
)

for dockerfile in "${DOCKERFILES[@]}"; do
    if [ -f "$dockerfile" ]; then
        if grep -q "COPY libs/ ./libs/" "$dockerfile"; then
            echo "✅ $dockerfile updated"
        else
            echo "❌ $dockerfile not updated with libs copy"
            exit 1
        fi
    else
        echo "⚠️  $dockerfile not found (skipping)"
    fi
done

echo ""
echo "🎉 All checks passed!"
echo ""
echo "Next steps:"
echo "1. Run: ./setup-libs.sh"
echo "2. Test with Docker: docker-compose -f docker-compose.test.yml up --build"
echo ""
