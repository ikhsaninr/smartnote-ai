// ============================
// FILE: utils/getEmbedding.ts
// ============================
import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function getEmbedding(text: string) {
  const res = await openai.embeddings.create({
    input: text,
    model: 'text-embedding-3-small',
  })
  return res.data[0].embedding
}