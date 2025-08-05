import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    console.log('🔍 Testing exact same Prisma setup as local...');
    console.log('Using prisma from @/lib/db (same as local)');
    
    // Test 1: Basic connection test
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Exact Prisma setup successful:', result);
    
    // Test 2: Count proofs
    const proofCount = await prisma.proof.count();
    console.log('✅ Proof count successful:', proofCount);
    
    return NextResponse.json({
      message: "Exact Prisma setup successful",
      timestamp: new Date().toISOString(),
      connection: "✅ Connected using same setup as local",
      method: "Using @/lib/db (same as local environment)",
      tests: {
        basicQuery: "✅ Working",
        proofCount: proofCount
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        usingLocalSetup: true
      }
    });
    
  } catch (error) {
    console.error('❌ Exact Prisma setup failed:', error);
    
    return NextResponse.json({
      message: "Exact Prisma setup failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        meta: (error as any)?.meta
      },
      method: "Using @/lib/db (same as local environment)",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        usingLocalSetup: true
      }
    }, { status: 500 });
  }
} 