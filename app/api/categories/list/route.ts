import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('Category')
      .select('name')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ categories: [] });
    }

    return NextResponse.json({ 
      categories: categories?.map(cat => cat.name) || [] 
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ categories: [] });
  }
} 