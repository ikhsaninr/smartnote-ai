// ============================
// FILE: app/api/update.ts
// ============================
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { getEmbedding } from '@/utils/getEmbedding'

export async function POST(req: NextRequest) {
  const { id, content } = await req.json()
  const summary = `Updated: ${content.slice(0, 40)}...`
  const embedding = await getEmbedding(content)

  await supabase.from('notes').update({ content, summary, embedding }).eq('id', id)
  return NextResponse.json({ success: true })
}
