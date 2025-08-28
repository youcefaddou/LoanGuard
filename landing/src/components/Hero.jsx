'use client'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu texte - côté gauche */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Anticipez les défauts de prêt avant qu'ils ne surviennent
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Transformez la prévention en stratégie
            </p>

            <div className="pt-4">
              <Link
                href="#contact"
                className="inline-block bg-gradient-to-r from-emerald-700 to-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg hover:opacity-90 transition-opacity"
              >
                Contactez-nous
              </Link>
            </div>
          </div>

          {/* Graphique - côté droit */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              {/* Graphique simple */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800 font-medium">Prédictions IA</span>
                    <span className="text-emerald-700 font-medium">Données réelles</span>
                  </div>
                  
                  {/* Simulation du graphique */}
                  <div className="h-48 relative">
                    <svg className="w-full h-full" viewBox="0 0 300 180">
                      {/* Ligne bleue (Prédictions IA) */}
                      <polyline
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="3"
                        points="20,160 60,140 100,120 140,110 180,85 220,75 260,60"
                      />
                      {/* Ligne verte (Données réelles) */}
                      <polyline
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        points="20,150 60,145 100,135 140,130 180,115 220,105 260,90"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
