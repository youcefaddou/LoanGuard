"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function HeaderAnimated() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
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
          {/* Menu burger mobile */}
          <div className="lg:hidden">
            <button
              className="text-blue-800 focus:outline-none"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Ouvrir le menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Menu desktop + Connexion */}
          <div className="hidden lg:flex items-center space-x-6">
            <nav className="flex space-x-8">
              <Link href="#features" className="text-blue-800 font-semibold hover:underline">Fonctionnalités</Link>
              <Link href="#security" className="text-blue-800 font-semibold hover:underline">Sécurité</Link>
              <Link href="#demo" className="text-blue-800 font-semibold hover:underline">Démo</Link>
            </nav>
            <Link
              href="http://localhost:5173/login"
              className="bg-blue-800 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-blue-600 font-semibold"
            >
              Connexion
            </Link>
          </div>
        </div>
      </div>
      {/* Menu mobile déroulant */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <Link href="#features" className="block py-2 text-blue-800 font-semibold hover:underline">Fonctionnalités</Link>
          <Link href="#security" className="block py-2 text-blue-800 font-semibold hover:underline">Sécurité</Link>
          <Link href="#demo" className="block py-2 text-blue-800 font-semibold hover:underline">Démo</Link>
          <Link
            href="http://localhost:5173/login"
            className="block mt-3 bg-blue-800 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-blue-600 text-center font-semibold"
          >
            Connexion
          </Link>
        </nav>
      )}
    </header>
  );
}
