'use client'

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités clés
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme complète pour gérer intelligemment vos risques de crédit
          </p>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Fonctionnalité 1 */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Analyse de Risque IA
            </h3>
            <p className="text-gray-600">
              Algorithmes d'apprentissage automatique pour évaluer automatiquement les risques de crédit avec une précision de 95%.
            </p>
          </div>

          {/* Fonctionnalité 2 */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Détection de Fraude
            </h3>
            <p className="text-gray-600">
              Détection en temps réel des transactions suspectes et des tentatives de fraude grâce à l'analyse comportementale.
            </p>
          </div>

          {/* Fonctionnalité 3 */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Prédictions Avancées
            </h3>
            <p className="text-gray-600">
              Modèles prédictifs pour anticiper les défauts de paiement et optimiser votre portefeuille de prêts.
            </p>
          </div>

          {/* Fonctionnalité 4 */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Conformité Automatique
            </h3>
            <p className="text-gray-600">
              Respect automatique des réglementations bancaires (Bâle III, IFRS 9) avec rapports de conformité intégrés.
            </p>
          </div>

          {/* Fonctionnalité 5 */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Dashboard Collaboratif
            </h3>
            <p className="text-gray-600">
              Interface intuitive pour les équipes avec tableaux de bord personnalisés et notifications intelligentes.
            </p>
          </div>

          {/* Fonctionnalité 6 */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Support 24/7
            </h3>
            <p className="text-gray-600">
              Assistance technique et accompagnement personnalisé pour maximiser vos résultats et votre retour sur investissement.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}