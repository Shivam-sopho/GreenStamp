# Manual Badge Tables Setup for Supabase

Since the automated setup might not work, here's how to manually create the badge tables in Supabase:

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `dgbevojijyhhcicahrvi`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**

## Step 2: Create Badge Table

Copy and paste this SQL:

```sql
-- Create Badge table
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

Click **Run** to execute.

## Step 3: Create UserBadge Table

Copy and paste this SQL:

```sql
-- Create UserBadge table
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

Click **Run** to execute.

## Step 4: Add Constraints and Indexes

Copy and paste this SQL:

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

Click **Run** to execute.

## Step 5: Verify Tables Created

Run this query to verify the tables exist:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('Badge', 'UserBadge');
```

You should see both `Badge` and `UserBadge` in the results.

## Step 6: Test the Badge System

After creating the tables, you can test the badge system by visiting:

- `/api/badges/test` - Test badge system functionality
- `/sponsor` - Sponsor dashboard
- `/profile` - User profile page

## Alternative: Use Supabase CLI

If you have Supabase CLI installed, you can also run:

```bash
# Create a migration file
supabase migration new create-badge-tables

# Add the SQL to the generated migration file
# Then run:
supabase db push
```

## Troubleshooting

If you get errors:

1. **Table already exists**: The `IF NOT EXISTS` clause should prevent this
2. **Foreign key errors**: Make sure the `User` table exists first
3. **Permission errors**: Check your Supabase role permissions

## Next Steps

Once the tables are created:

1. Test the badge system: `/api/badges/test`
2. Visit the sponsor dashboard: `/sponsor`
3. Award some badges to test users
4. Check user profiles: `/profile` 