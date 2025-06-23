import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Life HP',
  description: 'Created with Tony',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
