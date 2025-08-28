import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LoanGuard - Anticipation intelligente des risques de crédit',
  description: 'Solution bancaire de prévention des défauts de prêt. Scoring dynamique, alertes en temps réel et visualisation cartographique pour une gestion proactive des risques.',
  keywords: 'banque, crédit, risque, scoring, prêt, défaut, prévention, fintech',
  authors: [{ name: 'LoanGuard' }],
  openGraph: {
    title: 'LoanGuard - Anticipation intelligente des risques de crédit',
    description: 'Transformez la prévention en stratégie',
    url: 'https://loanguard.com',
    siteName: 'LoanGuard',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}