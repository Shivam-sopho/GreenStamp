import { NextResponse } from "next/server";

export async function GET() {
  const envCheck = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasHederaAccountId: !!process.env.HEDERA_ACCOUNT_ID,
    hasHederaPrivateKey: !!process.env.HEDERA_PRIVATE_KEY,
    hasPinataToken: !!process.env.PINATA_JWT_TOKEN,
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    databaseUrlPreview: process.env.DATABASE_URL ? 
      `${process.env.DATABASE_URL.substring(0, 20)}...` : 'Not set',
  };

  return NextResponse.json({
    message: "Environment variables check",
    timestamp: new Date().toISOString(),
    environment: envCheck,
  });
} 