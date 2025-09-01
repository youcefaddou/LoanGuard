import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", preload: true });

export const metadata = {
  title: "LoanGuard - Anticipation intelligente des risques de crédit",
  description:
    "Solution bancaire de prévention des défauts de prêt. Scoring dynamique, alertes en temps réel et visualisation cartographique pour une gestion proactive des risques.",
  keywords:
    "banque, crédit, risque, scoring, prêt, défaut, prévention, fintech",
  authors: [{ name: "LoanGuard" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "LoanGuard - Anticipation intelligente des risques de crédit",
    description: "Transformez la prévention en stratégie",
    url: "https://loanguard.ri7.tech",
    siteName: "LoanGuard",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/demo/dashboard.webp",
        width: 1200,
        height: 630,
        alt: "Dashboard LoanGuard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LoanGuard - Anticipation intelligente des risques de crédit",
    description: "Transformez la prévention en stratégie",
    images: ["/images/demo/dashboard.webp"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
