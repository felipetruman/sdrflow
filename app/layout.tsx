import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SDRFlow AI',
  description: 'Mini CRM para equipes de pré-vendas com geração de mensagens por IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
