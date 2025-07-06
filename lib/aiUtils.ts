import axios from 'axios'
import { supabase } from './supabaseClient'

export async function summarizeAndSaveToVector(content: string): Promise<string> {
  try {
    // 🔹 1. Panggil OpenRouter untuk ringkasan
    const aiRes = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Ringkas catatan berikut dengan gaya padat dan profesional.'
          },
          {
            role: 'user',
            content
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const summary = aiRes.data.choices?.[0]?.message?.content?.trim()

    // 🔹 2. Simpan ke Supabase `notes_vector`
    const { error } = await supabase.from('notes_vector').insert({
      content,
      summary
    })

    if (error) {
      console.error('Gagal simpan ke notes_vector:', error)
      return 'Ringkasan berhasil, tapi gagal simpan ke database.'
    }

    return summary ?? 'Ringkasan tidak tersedia.'

  } catch (err) {
    console.error('Error summarize:', err)
    return 'Gagal meringkas.'
  }
}
