"use client";

import { useState } from "react";
import useSlideInOnView from "../hooks/useSlideInOnView";

export default function DemoAnimated({ demoScreens }) {
  const [active, setActive] = useState(0);

  // Animations
  const [refTitle, animTitle] = useSlideInOnView({ direction: "up", delay: 0 });
  const [refTabs, animTabs] = useSlideInOnView({ direction: "up", delay: 120 });
  const [refSlide, animSlide] = useSlideInOnView({
    direction: "up",
    delay: 240,
  });
  const [refStats, animStats] = useSlideInOnView({
    direction: "up",
    delay: 400,
  });

  return (
    <section id="demo" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div ref={refTitle} className={`text-center mb-12 ${animTitle}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Découvrez LoanGuard en Action
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
            Une plateforme complète pour la gestion intelligente des risques
            bancaires
          </p>
        </div>

        {/* Onglets dynamiques */}
        <div
          ref={refTabs}
          className={`flex justify-center gap-2 mb-8 flex-wrap ${animTabs}`}
        >
          {demoScreens.map((screen, idx) => (
            <button
              key={screen.title}
              className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 border ${
                active === idx
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:cursor-pointer"
              }`}
              onClick={() => setActive(idx)}
              aria-current={active === idx ? "page" : undefined}
            >
              {screen.title}
            </button>
          ))}
        </div>

        {/* Slide principale */}
        <div
          ref={refSlide}
          className={`flex flex-col items-center mb-12 transition-all duration-300 ${animSlide}`}
        >
          <div className="w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow-sm hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ">
            <img
              src={demoScreens[active].image}
              alt={demoScreens[active].title}
              className="w-full max-w-lg rounded-md border border-gray-200 mb-4 bg-white object-contain"
            />
            <div className="text-blue-600 font-semibold text-lg mb-1 text-center">
              {demoScreens[active].title}
            </div>
            <div className="text-gray-500 text-base text-center">
              {demoScreens[active].desc}
            </div>
          </div>
          {/* Navigation mobile (flèches) */}
          <div className="flex gap-4 mt-6 md:hidden">
            <button
              className="px-3 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 disabled:opacity-40"
              onClick={() =>
                setActive((a) => (a === 0 ? demoScreens.length - 1 : a - 1))
              }
              aria-label="Précédent"
            >
              &#8592;
            </button>
            <button
              className="px-3 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 disabled:opacity-40"
              onClick={() =>
                setActive((a) => (a === demoScreens.length - 1 ? 0 : a + 1))
              }
              aria-label="Suivant"
            >
              &#8594;
            </button>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={refStats}
          className={`flex flex-wrap justify-center gap-6 ${animStats}`}
        >
          <div className="bg-gray-100 border border-gray-200 rounded-md px-8 py-6 text-center min-w-[120px]">
            <div className="text-2xl font-bold text-blue-500 mb-1">99.9%</div>
            <div className="text-gray-500 font-medium text-xs uppercase tracking-wide">
              Précision IA
            </div>
          </div>
          <div className="bg-gray-100 border border-gray-200 rounded-md px-8 py-6 text-center min-w-[120px]">
            <div className="text-2xl font-bold text-blue-500 mb-1">-45%</div>
            <div className="text-gray-500 font-medium text-xs uppercase tracking-wide">
              Risques détectés
            </div>
          </div>
          <div className="bg-gray-100 border border-gray-200 rounded-md px-8 py-6 text-center min-w-[120px]">
            <div className="text-2xl font-bold text-blue-500 mb-1">24/7</div>
            <div className="text-gray-500 font-medium text-xs uppercase tracking-wide">
              Monitoring
            </div>
          </div>
          <div className="bg-gray-100 border border-gray-200 rounded-md px-8 py-6 text-center min-w-[120px]">
            <div className="text-2xl font-bold text-blue-500 mb-1">15min</div>
            <div className="text-gray-500 font-medium text-xs uppercase tracking-wide">
              Setup rapide
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
