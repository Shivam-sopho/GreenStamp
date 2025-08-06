# 🚀 Complete Setup Guide for GreenStamp Badge System

## Overview
This guide will help you set up the complete badge system with eco-actors, including database tables, foreign key relationships, and sample data.

## Step 1: Create Badge Tables in Supabase

Go to your Supabase Dashboard → SQL Editor and run these commands:

### 1.1 Create Badge Table
```sql
CREATE TABLE IF NOT EXISTS "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);
```

### 1.2 Create UserBadge Table
```sql
CREATE TABLE IF NOT EXISTS "UserBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "awardedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);
```

### 1.3 Add Constraints and Indexes
```sql
-- Add unique constraint for UserBadge
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_badgeId_key" UNIQUE ("userId", "badgeId");

-- Add foreign key constraints
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add indexes
CREATE INDEX IF NOT EXISTS "Badge_name_idx" ON "Badge"("name");
CREATE INDEX IF NOT EXISTS "UserBadge_userId_idx" ON "UserBadge"("userId");
CREATE INDEX IF NOT EXISTS "UserBadge_badgeId_idx" ON "UserBadge"("badgeId");
CREATE INDEX IF NOT EXISTS "UserBadge_awardedAt_idx" ON "UserBadge"("awardedAt");
```

## Step 2: Create Sample Eco-Actors

After creating the tables, create sample users by calling the seed API:

### Method 1: Using Browser Console
1. Open your website
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run this command:
```javascript
fetch('/api/seed-users', { method: 'POST' }).then(r => r.json()).then(console.log)
```

### Method 2: Using curl
```bash
curl -X POST https://your-domain.vercel.app/api/seed-users
```

### Method 3: Using Postman/Insomnia
- Method: POST
- URL: `https://your-domain.vercel.app/api/seed-users`

## Step 3: Create Sample Badges

Create some sample badges by calling the badge creation API:

### Method 1: Using Browser Console
```javascript
// Create sample badges
const badges = [
  {
    id: crypto.randomUUID(),
    name: "Tree Planter",
    description: "Awarded for planting trees and contributing to reforestation",
    icon: "🌳",
    color: "bg-green-500",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: "Beach Cleaner",
    description: "Awarded for cleaning beaches and protecting marine life",
    icon: "🏖️",
    color: "bg-blue-500",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: "Recycling Champion",
    description: "Awarded for promoting recycling and waste reduction",
    icon: "♻️",
    color: "bg-purple-500",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: "Energy Saver",
    description: "Awarded for energy conservation and renewable energy adoption",
    icon: "⚡",
    color: "bg-yellow-500",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: "Water Guardian",
    description: "Awarded for water conservation and protection efforts",
    icon: "💧",
    color: "bg-cyan-500",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Insert badges
badges.forEach(badge => {
  fetch('/api/badges/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(badge)
  }).then(r => r.json()).then(console.log);
});
```

## Step 4: Test the System

### 4.1 Test Badge System
Visit: `/api/badges/test`

### 4.2 Test Eco-Actors
Visit: `/api/eco-actors`

### 4.3 Test User Profile
Visit: `/profile` (should show user selector)

### 4.4 Test Sponsor Dashboard
Visit: `/sponsor` (should show eco-actors list)

## Step 5: Award Badges

1. Go to `/sponsor`
2. Select an eco-actor from the list
3. Choose a badge to award
4. Click "Award Badge"

## Troubleshooting

### Issue: "Could not find a relationship between 'User' and 'UserBadge'"
**Solution**: The foreign key relationships haven't been created. Run the SQL commands in Step 1.3.

### Issue: "Badge table not accessible"
**Solution**: The Badge table doesn't exist. Run the SQL commands in Step 1.1.

### Issue: No eco-actors showing
**Solution**: Create sample users using Step 2.

### Issue: No badges available for awarding
**Solution**: Create sample badges using Step 3.

### Issue: Profile page not loading
**Solution**: Make sure you have users in the database and the profile API is working.

## API Endpoints Reference

- `POST /api/seed-users` - Create sample eco-actors
- `GET /api/eco-actors` - Get all eco-actors with their badges
- `GET /api/users/[id]/profile` - Get user profile with badges and proofs
- `POST /api/badges/award` - Award a badge to a user
- `GET /api/badges/test` - Test badge system functionality

## Database Schema

### User Table
- `id` (TEXT, Primary Key)
- `name` (TEXT)
- `email` (TEXT)
- `avatar` (TEXT, nullable)
- `bio` (TEXT, nullable)
- `totalProofs` (INTEGER)
- `totalImpact` (INTEGER)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Badge Table
- `id` (TEXT, Primary Key)
- `name` (TEXT)
- `description` (TEXT, nullable)
- `icon` (TEXT, nullable)
- `color` (TEXT, nullable)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### UserBadge Table
- `id` (TEXT, Primary Key)
- `userId` (TEXT, Foreign Key to User.id)
- `badgeId` (TEXT, Foreign Key to Badge.id)
- `awardedAt` (TIMESTAMP)
- `awardedBy` (TEXT)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## Next Steps

After completing this setup:

1. **Test the complete flow**: Submit proofs → Award badges → View profiles
2. **Customize badges**: Create your own badge types
3. **Add more features**: Implement badge levels, achievements, etc.
4. **Deploy to production**: Ensure all environment variables are set in Vercel

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all SQL commands executed successfully
3. Ensure all API endpoints are accessible
4. Check that environment variables are properly set 