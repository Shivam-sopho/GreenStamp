#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

# Build Next.js application
echo "🏗️ Building Next.js application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi

echo "🎉 Vercel build process completed!" 