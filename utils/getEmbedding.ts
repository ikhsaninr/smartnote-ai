// utils/getEmbedding.ts
import axios from 'axios'

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/embeddings',
      {
        model: 'openai/text-embedding-ada-002',
        input: text,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://smartnote.vercel.app', // opsional
          'X-Title': 'SmartNote AI',
        },
      }
    )

    return response.data.data[0].embedding
  } catch (error: any) {
    console.error('Gagal mendapatkan embedding:', error.response?.data || error.message)
    throw new Error('Embedding gagal dibuat')
  }
}
