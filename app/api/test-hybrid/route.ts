import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 Testing hybrid approach...');
    
    // Check environment variables
    if (!process.env.SUPABASE_KEY) {
      throw new Error('SUPABASE_KEY environment variable not set');
    }
    
    const supabaseUrl = 'https://dgbevojijyhhcicahrvi.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY;
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test 1: Get proofs using Supabase client
    console.log('🔍 Testing Supabase client for proofs...');
    const { data: proofs, error: proofsError } = await supabase
      .from('Proof')
      .select('id, cid, title, category, createdAt')
      .order('createdAt', { ascending: false })
      .limit(5);
    
    if (proofsError) {
      throw new Error(`Proofs fetch failed: ${proofsError.message}`);
    }
    
    console.log('✅ Proofs fetch successful');
    
    // Test 2: Get categories
    console.log('🔍 Testing Supabase client for categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('Category')
      .select('id, name, description, totalProofs')
      .order('totalProofs', { ascending: false });
    
    if (categoriesError) {
      throw new Error(`Categories fetch failed: ${categoriesError.message}`);
    }
    
    console.log('✅ Categories fetch successful');
    
    // Test 3: Get NGOs
    console.log('🔍 Testing Supabase client for NGOs...');
    const { data: ngos, error: ngosError } = await supabase
      .from('NGO')
      .select('id, name, description, totalProofs, totalMembers')
      .order('totalProofs', { ascending: false })
      .limit(3);
    
    if (ngosError) {
      throw new Error(`NGOs fetch failed: ${ngosError.message}`);
    }
    
    console.log('✅ NGOs fetch successful');
    
    return NextResponse.json({
      message: "Hybrid approach successful",
      timestamp: new Date().toISOString(),
      connection: "✅ Connected using Supabase client",
      method: "Supabase JavaScript client (REST API)",
      data: {
        proofs: proofs || [],
        categories: categories || [],
        ngos: ngos || []
      },
      counts: {
        proofs: proofs?.length || 0,
        categories: categories?.length || 0,
        ngos: ngos?.length || 0
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        hasSupabaseKey: !!process.env.SUPABASE_KEY,
        supabaseUrl: supabaseUrl
      }
    });
    
  } catch (error) {
    console.error('❌ Hybrid approach failed:', error);
    
    return NextResponse.json({
      message: "Hybrid approach failed",
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