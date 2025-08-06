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

-- Add badges relation to User table (if not already exists)
-- Note: This is handled by the foreign key constraint above 