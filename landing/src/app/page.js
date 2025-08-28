import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Security from '@/components/Security'
import Demo from '@/components/Demo'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <Security />
      <Demo />
      <Footer />
    </main>
  )
}