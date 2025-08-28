"use client";

import React, { useState } from 'react';
import './Demo.css';

const Demo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const demoFeatures = [
    {
      id: 'dashboard',
      title: 'Dashboard de Risque',
      description: 'Vue d\'ensemble en temps réel des risques de crédit et alertes importantes',
      image: '/images/demo/dashboard.png',
      highlights: ['Tableau de bord intuitif', 'Alertes en temps réel', 'Métriques clés']
    },
    {
      id: 'loans',
      title: 'Gestion des Prêts',
      description: 'Suivi complet du portefeuille de prêts avec analyse prédictive',
      image: '/images/demo/loans.png',
      highlights: ['Portfolio complet', 'Analyse prédictive', 'Historique détaillé']
    },
    {
      id: 'risk',
      title: 'Analyse de Risque',
      description: 'Algorithmes IA pour évaluer et prédire les risques de défaillance',
      image: '/images/demo/risk.png',
      highlights: ['IA prédictive', 'Scoring automatique', 'Recommandations']
    },
    {
      id: 'simulation',
      title: 'Simulations',
      description: 'Modélisation de scénarios pour anticiper les impacts financiers',
      image: '/images/demo/simulation.png',
      highlights: ['Stress testing', 'Scénarios multiples', 'Impact financier']
    }
  ];

  return (
    <section className="demo-section" id="demo">
      <div className="container">
        <div className="demo-header">
          <h2>Découvrez LoanGuard en Action</h2>
          <p>Une plateforme complète pour la gestion intelligente des risques bancaires</p>
        </div>

        <div className="demo-tabs">
          {demoFeatures.map((feature) => (
            <button
              key={feature.id}
              className={`demo-tab ${activeTab === feature.id ? 'active' : ''}`}
              onClick={() => setActiveTab(feature.id)}
            >
              {feature.title}
            </button>
          ))}
        </div>

        <div className="demo-content">
          {demoFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`demo-panel ${activeTab === feature.id ? 'active' : ''}`}
            >
              <div className="demo-info">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <ul className="demo-highlights">
                  {feature.highlights.map((highlight, index) => (
                    <li key={index}>
                      <span className="check-icon">✓</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
                <button className="demo-cta">
                  Essayer maintenant
                </button>
              </div>
              <div className="demo-visual">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="demo-image"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="demo-stats">
          <div className="stat">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Précision IA</div>
          </div>
          <div className="stat">
            <div className="stat-number">-45%</div>
            <div className="stat-label">Risques détectés</div>
          </div>
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Monitoring</div>
          </div>
          <div className="stat">
            <div className="stat-number">15min</div>
            <div className="stat-label">Setup rapide</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
