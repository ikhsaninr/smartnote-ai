// ============================
// FILE: app/notes/page.tsx
// ============================
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Notes() {
  const [content, setContent] = useState('')
  const [notes, setNotes] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [editId, setEditId] = useState('')
  const [editContent, setEditContent] = useState('')
  const router = useRouter()

  const fetchNotes = async () => {
    const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
    setNotes(data || [])
  }

  const handleSave = async () => {
    await fetch('/api/summarize', {
      method: 'POST',
      body: JSON.stringify({ content })
    })
    setContent('')
    fetchNotes()
  }

  const handleSearch = async () => {
    const res = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query })
    })
    const json = await res.json()
    setResults(json.results)
  }

  const handleEdit = (note: any) => {
    setEditId(note.id)
    setEditContent(note.content)
  }

  const handleUpdate = async () => {
    await fetch('/api/update', {
      method: 'POST',
      body: JSON.stringify({ id: editId, content: editContent })
    })
    setEditId('')
    fetchNotes()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Yakin hapus?')) {
      await fetch('/api/delete', {
        method: 'POST',
        body: JSON.stringify({ id })
      })
      fetchNotes()
    }
  }

  useEffect(() => { fetchNotes() }, [])

  return (
    <div className="p-4 space-y-4">
      <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full" placeholder="Catatan baru..." />
      <button onClick={handleSave}>Simpan + Ringkas AI</button>

      <input className="w-full mt-4" placeholder="Cari AI..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Cari AI</button>

      {results.map((r: any) => (
        <div key={r.id} className="p-2 border">
          <p>{r.content}</p>
          <p className="text-sm italic">{r.summary}</p>
        </div>
      ))}

      {notes.map((note) => (
        <div key={note.id} className="border p-3 rounded bg-white">
          {editId === note.id ? (
            <>
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full" />
              <button onClick={handleUpdate}>💾 Simpan</button>
              <button onClick={() => setEditId('')}>❌ Batal</button>
            </>
          ) : (
            <>
              <p><strong>📝:</strong> {note.content}</p>
              <p><strong>🧠:</strong> {note.summary}</p>
              <button onClick={() => handleEdit(note)}>✏️ Edit</button>
              <button onClick={() => handleDelete(note.id)}>🗑 Hapus</button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}