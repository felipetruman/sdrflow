import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ToastProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
