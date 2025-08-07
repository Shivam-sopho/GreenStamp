-- =====================================================
-- AI VALIDATION FIELDS MIGRATION SCRIPT
-- =====================================================
-- This script adds AI validation fields to the Proof table
-- Includes both FORWARD migration and ROLLBACK options
-- =====================================================

-- =====================================================
-- OPTION 1: FORWARD MIGRATION (Add AI Fields)
-- =====================================================
-- Uncomment the section below to ADD the AI validation fields

/*
-- Start transaction for safe migration
BEGIN;

-- Add new columns for AI validation
ALTER TABLE "Proof" 
ADD COLUMN IF NOT EXISTS "aiValidationStatus" TEXT,
ADD COLUMN IF NOT EXISTS "aiConfidenceScore" DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS "aiEnvironmentalScore" DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS "aiSafetyScore" DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS "aiDetectedObjects" TEXT[],
ADD COLUMN IF NOT EXISTS "aiDetectedLabels" TEXT[],
ADD COLUMN IF NOT EXISTS "aiTextContent" TEXT[],
ADD COLUMN IF NOT EXISTS "aiSuggestedCategory" TEXT,
ADD COLUMN IF NOT EXISTS "aiValidationDetails" JSONB;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "Proof_aiValidationStatus_idx" ON "Proof"("aiValidationStatus");
CREATE INDEX IF NOT EXISTS "Proof_aiEnvironmentalScore_idx" ON "Proof"("aiEnvironmentalScore");

-- Set default values for existing records
UPDATE "Proof" 
SET 
  "aiValidationStatus" = 'not_applicable',
  "aiDetectedObjects" = '{}',
  "aiDetectedLabels" = '{}',
  "aiTextContent" = '{}'
WHERE "aiValidationStatus" IS NULL;

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'Proof' 
AND column_name LIKE 'ai%'
ORDER BY column_name;

-- If everything looks good, commit the transaction
COMMIT;

-- If you want to rollback instead, use: ROLLBACK;
*/

-- =====================================================
-- OPTION 2: ROLLBACK MIGRATION (Remove AI Fields)
-- =====================================================
-- Uncomment the section below to REMOVE the AI validation fields
-- ⚠️ WARNING: This will permanently delete AI validation data!

/*
-- Start transaction for safe rollback
BEGIN;

-- Drop indexes first
DROP INDEX IF EXISTS "Proof_aiValidationStatus_idx";
DROP INDEX IF EXISTS "Proof_aiEnvironmentalScore_idx";

-- Remove AI validation columns
ALTER TABLE "Proof" 
DROP COLUMN IF EXISTS "aiValidationStatus",
DROP COLUMN IF EXISTS "aiConfidenceScore",
DROP COLUMN IF EXISTS "aiEnvironmentalScore",
DROP COLUMN IF EXISTS "aiSafetyScore",
DROP COLUMN IF EXISTS "aiDetectedObjects",
DROP COLUMN IF EXISTS "aiDetectedLabels",
DROP COLUMN IF EXISTS "aiTextContent",
DROP COLUMN IF EXISTS "aiSuggestedCategory",
DROP COLUMN IF EXISTS "aiValidationDetails";

-- Verify the rollback
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'Proof' 
ORDER BY column_name;

-- If rollback looks good, commit
COMMIT;

-- If you want to undo the rollback, use: ROLLBACK;
*/

-- =====================================================
-- OPTION 3: CHECK CURRENT SCHEMA
-- =====================================================
-- Run this to see current table structure

SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'Proof' 
ORDER BY ordinal_position; 