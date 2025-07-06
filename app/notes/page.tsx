'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { supabase } from '@/lib/supabaseClient'

type Note = {
  id: number
  title: string
  content: string
  created_at: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [search, setSearch] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes_basic')
      .select('*')
      .ilike('title', `%${search}%`)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setNotes(data as Note[])
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [search])

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return alert('Judul dan isi wajib diisi')

    if (editId) {
      await supabase.from('notes_basic').update({ title, content }).eq('id', editId)
    } else {
      await supabase.from('notes_basic').insert({ title, content })
    }

    setTitle('')
    setContent('')
    setEditId(null)
    fetchNotes()
  }

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Yakin ingin hapus catatan ini?')
    if (confirm) {
      await supabase.from('notes_basic').delete().eq('id', id)
      fetchNotes()
    }
  }

  const handleEdit = (note: Note) => {
    setTitle(note.title)
    setContent(note.content)
    setEditId(note.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSummarize = async () => {
    if (!content) return alert('Isi kosong!')
    setLoading(true)

    const summary = await summarizeContent(content)

    setLoading(false)
    alert(`🧠 Ringkasan AI:\n\n${summary}`)

    // Simpan ringkasan ke tabel vector (opsional)
    await supabase.from('notes_vector').insert({
      original_text: content,
      summary
    })
  }

  const summarizeContent = async (text: string) => {
    try {
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openrouter/openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Kamu adalah AI yang membantu meringkas catatan pengguna.'
            },
            {
              role: 'user',
              content: `Ringkas catatan berikut:\n\n${text}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://smartnote.vercel.app',
            'X-Title': 'SmartNote AI'
          }
        }
      )

      return res.data.choices[0].message.content
    } catch (error) {
      console.error('Gagal meringkas:', error)
      return 'Gagal meringkas.'
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📝 SmartNote AI</h1>

      {/* Form Input */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Judul catatan"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded h-32"
          placeholder="Isi catatan..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {editId ? '💾 Simpan Perubahan' : '📝 Simpan Catatan'}
          </button>

          <button
            onClick={handleSummarize}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Merangkum...' : '🧠 Ringkas AI'}
          </button>
        </div>

        {loading && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-white border-t-blue-500 rounded-full animate-spin" />
            <span>Memproses ringkasan...</span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <input
        className="w-full mb-4 border p-2 rounded"
        placeholder="🔍 Cari catatan berdasarkan judul..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Notes List */}
      <div className="grid gap-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
            <div>
              <h2 className="font-semibold text-xl">{note.title}</h2>
              <p className="text-gray-700 whitespace-pre-line">{note.content}</p>
              <p className="text-sm text-gray-400 mt-1">🕒 {new Date(note.created_at).toLocaleString()}</p>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => handleEdit(note)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                🗑 Hapus
              </button>
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-center text-gray-500">Belum ada catatan ditemukan.</p>
        )}
      </div>
    </div>
  )
}
