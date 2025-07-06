// ============================
// FILE: app/api/delete.ts
// ============================
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  const { id } = await req.json()
  await supabase.from('notes_basic').delete().eq('id', id)
  return NextResponse.json({ success: true })
}
