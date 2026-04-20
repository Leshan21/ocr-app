#!/bin/bash

# OCR App Backend - Quick Setup Guide

echo "========================================="
echo "🗄️  Setting up Neon Database"
echo "========================================="
echo ""
echo "Step 1: Create a Neon Project"
echo "  1. Go to https://console.neon.tech"
echo "  2. Sign up or log in"
echo "  3. Click 'New Project'"
echo "  4. Choose PostgreSQL"
echo "  5. Click 'Create Project'"
echo ""
echo "Step 2: Get Connection String"
echo "  1. In Neon Dashboard, find your project"
echo "  2. Click on your database"
echo "  3. Click 'Connection strings' tab"
echo "  4. Copy the 'Connection string' (starts with postgresql://)"
echo ""
echo "Step 3: Update .env file"
echo "  Edit backend/.env and paste the connection string as DATABASE_URL"
echo ""
echo "Step 4: Run migrations"
echo "  npm run db:push"
echo ""
echo "========================================="
echo ""

# Check if DATABASE_URL is set
if grep -q "DATABASE_URL=" .env; then
  DB_URL=$(grep "DATABASE_URL=" .env | cut -d'=' -f2-)
  if [[ "$DB_URL" == *"neon.tech"* ]]; then
    echo "✅ DATABASE_URL looks valid (Neon endpoint detected)"
  else
    echo "⚠️  DATABASE_URL doesn't look like a Neon endpoint"
    echo "   Expected format: postgresql://user:password@host/database"
  fi
else
  echo "❌ DATABASE_URL not set in .env"
fi

echo ""
echo "Current DATABASE_URL:"
grep "DATABASE_URL=" .env || echo "Not found"
