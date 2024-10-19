import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wordle',
  description: 'A Wordle game for sandbox technical assignment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}