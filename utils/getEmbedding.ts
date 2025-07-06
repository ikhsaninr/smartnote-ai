// ============================
// FILE: utils/getEmbedding.ts
// ============================
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
})

export async function getEmbedding(text: string) {
  const res = await openai.embeddings.create({
    input: text,
    model: 'openai/text-embedding-ada-002',
  })
  return res.data[0].embedding
}