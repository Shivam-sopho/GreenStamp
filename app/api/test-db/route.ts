import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

// Create a new Prisma client with connection parameters
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=1&pool_timeout=20&connect_timeout=60',
    },
  },
  log: ['error', 'warn'],
});

export async function GET() {
  try {
    // Test 1: Basic connection
    console.log('🔍 Testing database connection...');
    
    // Test 2: Simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Basic query successful:', result);
    
    // Test 3: Count proofs
    const proofCount = await prisma.proof.count();
    console.log('✅ Proof count query successful:', proofCount);
    
    // Test 4: Get one proof
    const oneProof = await prisma.proof.findFirst({
      select: { id: true, cid: true, createdAt: true }
    });
    console.log('✅ Proof fetch successful:', oneProof);
    
    return NextResponse.json({
      message: "Database connection test successful",
      timestamp: new Date().toISOString(),
      tests: {
        connection: "✅ Connected",
        basicQuery: "✅ Working",
        proofCount: proofCount,
        proofFetch: oneProof ? "✅ Working" : "⚠️ No proofs found"
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        connectionString: process.env.DATABASE_URL ? 
          `${process.env.DATABASE_URL.substring(0, 30)}...` : 'Not set'
      }
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    return NextResponse.json({
      message: "Database connection test failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        meta: (error as any)?.meta,
        stack: error instanceof Error ? error.stack : undefined
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        connectionString: process.env.DATABASE_URL ? 
          `${process.env.DATABASE_URL.substring(0, 30)}...` : 'Not set'
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 