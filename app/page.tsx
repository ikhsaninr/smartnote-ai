// app/page.tsx
// 'use client'
// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// export default function RedirectHome() {
//   const router = useRouter()
//   useEffect(() => {
//     router.push('/login')
//   }, [router])
//   return null
// }
export default function Home() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">📒 Selamat datang di SmartNote AI</h1>
      <p className="mt-4">Klik <a href="/login" className="text-blue-600 underline">di sini untuk login</a></p>
    </div>
  )
}