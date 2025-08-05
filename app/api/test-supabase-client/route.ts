import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 Testing Supabase JavaScript client...');
    
    // Check if we have the required environment variables
    if (!process.env.SUPABASE_KEY) {
      throw new Error('SUPABASE_KEY environment variable not set');
    }
    
    const supabaseUrl = 'https://dgbevojijyhhcicahrvi.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Has Supabase Key:', !!supabaseKey);
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test 1: Basic connection test
    console.log('🔍 Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('Proof')
      .select('id')
      .limit(1);
    
    if (testError) {
      throw new Error(`Connection test failed: ${testError.message}`);
    }
    
    console.log('✅ Basic connection successful');
    
    // Test 2: Count proofs
    console.log('🔍 Testing proof count...');
    const { count: proofCount, error: countError } = await supabase
      .from('Proof')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw new Error(`Count test failed: ${countError.message}`);
    }
    
    console.log('✅ Proof count successful:', proofCount);
    
    // Test 3: Get one proof
    console.log('🔍 Testing proof fetch...');
    const { data: oneProof, error: fetchError } = await supabase
      .from('Proof')
      .select('id, cid, createdAt')
      .limit(1);
    
    if (fetchError) {
      throw new Error(`Fetch test failed: ${fetchError.message}`);
    }
    
    console.log('✅ Proof fetch successful');
    
    return NextResponse.json({
      message: "Supabase JavaScript client successful",
      timestamp: new Date().toISOString(),
      connection: "✅ Connected using Supabase client",
      method: "Supabase JavaScript client (REST API)",
      tests: {
        basicConnection: "✅ Working",
        proofCount: proofCount || 0,
        proofFetch: oneProof ? "✅ Working" : "⚠️ No proofs found"
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasSupabaseKey: !!process.env.SUPABASE_KEY,
        supabaseUrl: supabaseUrl
      }
    });
    
  } catch (error) {
    console.error('❌ Supabase client test failed:', error);
    
    return NextResponse.json({
      message: "Supabase JavaScript client failed",
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      method: "Supabase JavaScript client (REST API)",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasSupabaseKey: !!process.env.SUPABASE_KEY,
        missingEnvironment: !process.env.SUPABASE_KEY ? 'SUPABASE_KEY' : null
      }
    }, { status: 500 });
  }
} 