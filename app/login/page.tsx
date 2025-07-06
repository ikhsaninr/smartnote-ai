// app/login/page.tsx
'use client'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) router.push('/notes')
  }

  return (
    <div className="p-6">
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

<button onClick={async () => {
  await supabase.auth.signOut()
  router.push('/login')
}}>Logout</button>
