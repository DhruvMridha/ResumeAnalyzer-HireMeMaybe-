import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hire Me Maybe — AI Resume Analyzer',
  description:
    'Premium AI resume analyzer with ATS scoring, keyword analysis, compare mode and roast mode.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  )
}
