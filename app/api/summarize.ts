// app/api/summarize.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import axios from 'axios'

export async function POST(req: NextRequest) {
  const { content } = await req.json()

  if (!content) {
    return NextResponse.json({ error: 'Konten kosong' }, { status: 400 })
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Kamu adalah AI ringkasan catatan.' },
          { role: 'user', content: `Ringkas catatan ini:\n\n${content}` }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://smartnote.vercel.app',
          'X-Title': 'SmartNote AI'
        }
      }
    )

    const summary = response.data.choices[0].message.content

    // Simpan ringkasan ke tabel notes_vector (optional)
    await supabase.from('notes_vector').insert({
      content,
      summary,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({ summary })
  } catch (err: any) {
    console.error('Ringkasan gagal:', err.response?.data || err.message)
    return NextResponse.json({ error: 'Gagal meringkas' }, { status: 500 })
  }
}
