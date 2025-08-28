'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo - exactement comme votre maquette */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LG</span>
              </div>
              <h1 className="text-2xl font-bold text-blue-800">
                LoanGuard
              </h1>
            </div>
          </div>

          {/* Navigation Desktop - style minimaliste */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#home" className="text-blue-600 font-medium">
              Accueil
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#security" className="text-gray-600 hover:text-blue-600 transition-colors">
              Sécurité
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
              À propos
            </Link>
          </nav>

          {/* Bouton Connexion */}
          <div className="hidden md:flex items-center">
            <Link
              href="/app"
              className="bg-blue-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Connexion
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="#home" className="text-blue-600 font-medium">
                Accueil
              </Link>
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Fonctionnalités
              </Link>
              <Link href="#security" className="text-gray-600 hover:text-blue-600 transition-colors">
                Sécurité
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                À propos
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/app"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors block text-center"
                >
                  Connexion
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}