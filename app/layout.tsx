// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SmartNote AI',
  description: 'Aplikasi catatan pintar dengan ringkasan & pencarian AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
