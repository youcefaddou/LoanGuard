"use client";

import useSlideInOnView from "../hooks/useSlideInOnView";

export default function FeaturesAnimated({ cards }) {
  const [refTitle, animTitle] = useSlideInOnView({ direction: "up", delay: 0 });
  const [refText, animText] = useSlideInOnView({ direction: "up", delay: 120 });
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={refTitle} className={`text-center mb-8 ${animTitle}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités avancées
          </h2>
        </div>
        <div ref={refText} className={`text-center mb-16 max-w-2xl mx-auto text-lg text-gray-600 ${animText}`}>
          Plateforme tout-en-un pour la gestion proactive des risques de crédit.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => {
            const [refCard, animCard] = useSlideInOnView({ direction: "up", delay: 200 + i * 120 });
            return (
              <div
                key={card.title}
                ref={refCard}
                className={`bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 text-center transition-all duration-300 hover:scale-105 ${animCard}`}
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
