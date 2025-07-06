// ============================
// FILE: app/api/summarize.ts
// ============================
import { NextRequest, NextResponse } from 'next/server'
import { getEmbedding } from '@/utils/getEmbedding'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabaseClient'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {
  const { content } = await req.json()
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: `Ringkas ini: ${content}` }]
  })
  const summary = res.choices[0].message.content || ''
  const embedding = await getEmbedding(content)

  await supabase.from('notes').insert({ content, summary, embedding })
  return NextResponse.json({ summary })
}
export async function GET() {
  const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}