#!/bin/bash

# Exit on any error
set -e

# Load environment variables
source .env.production

# Validate required environment variables
if [ -z "$DATABASE_URL" ] || [ -z "$NEXTAUTH_SECRET" ]; then
    echo "Error: Missing critical environment variables"
    exit 1
fi

# Clean previous builds
npm run clean

# Install dependencies
npm ci

# Run database migrations
npx prisma migrate deploy

# Build the application
npm run build

# Run tests
npm test

# Start the application
npm run start:production

# Optional: Deployment to Vercel
vercel deploy --prod

# Optional: Deployment to Railway
railway up --detach

# Notify deployment success (replace with your preferred notification method)
curl -X POST https://your-monitoring-service.com/deploy-success \
     -H "Content-Type: application/json" \
     -d '{"app": "MemeMAtes", "status": "success", "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}'

echo "Deployment completed successfully!"
