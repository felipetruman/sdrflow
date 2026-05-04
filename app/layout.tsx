import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sdrflow.ai'),
  title: {
    default: 'SDRFlow AI',
    template: '%s | SDRFlow AI',
  },
  description: 'CRM leve para SDRs com funil, Kanban e automação de mensagens por IA.',
  openGraph: {
    title: 'SDRFlow AI',
    description: 'CRM leve para SDRs com funil, Kanban e automação de mensagens por IA.',
    type: 'website',
    url: 'https://sdrflow.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SDRFlow AI',
    description: 'CRM leve para SDRs com funil, Kanban e automação de mensagens por IA.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-ink-950 text-paper font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
