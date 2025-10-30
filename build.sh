#!/bin/bash
set -e

echo "🔧 Installing dependencies with pnpm..."
pnpm install --no-frozen-lockfile

echo "🏗️ Building project..."
pnpm build

echo "✅ Build completed successfully!"

