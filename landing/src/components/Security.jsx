"use client"

import useSlideInOnView from "../hooks/useSlideInOnView";

function Security() {
  // Accentuer l'effet : translation plus grande et durée plus longue
  const [ref, anim] = useSlideInOnView({ direction: "left", delay: 0, distance: 120, duration: 900 });
  return (
    <section ref={ref} className={`bg-gray-50 py-20 ${anim}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sécurité bancaire de niveau entreprise
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vos données sont protégées par les plus hauts standards de sécurité du secteur financier
          </p>
        </div>

        {/* Fonctionnalités de sécurité */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Chiffrement AES-256
            </h3>
            <p className="text-gray-600">
              Toutes vos données sont protégées par un chiffrement de niveau militaire AES-256.
            </p>
          </div>

          <div className="text-center hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.586a1 1 0 01.707.293l5.414 5.414a2 2 0 01.586 1.414z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Conformité RGPD
            </h3>
            <p className="text-gray-600">
              Respect total du RGPD avec gestion des consentements et droit à l'oubli.
            </p>
          </div>

          <div className="text-center hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Audit Trail Complet
            </h3>
            <p className="text-gray-600">
              Traçabilité complète de toutes les actions avec logs immutables.
            </p>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Certifications et Conformité
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              "ISO 27001",
              "SOC 2 Type II", 
              "RGPD",
              "Bâle III",
              "PCI DSS",
              "ACPR"
            ].map((cert) => (
              <div key={cert} className="text-center hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">{cert}</p>
                <p className="text-xs text-green-600">Certifié</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Security;