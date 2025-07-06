// ============================
// FILE: app/api/search.ts
// ============================
import { NextRequest, NextResponse } from 'next/server'
import { getEmbedding } from '@/utils/getEmbedding'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  const embedding = await getEmbedding(query)

  const { data } = await supabase.rpc('match_notes', {
    query_embedding: embedding,
    match_threshold: 0.8,
    match_count: 5
  })

  return NextResponse.json({ results: data || [] })
}