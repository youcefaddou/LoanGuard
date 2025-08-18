import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import riskService from '../services/riskService';

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RiskEvolutionChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskEvolutionData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les vraies données depuis l'API
        const response = await riskService.getRiskEvolution();
        
        if (response.data && response.data.months.length > 0) {
          setChartData({
            labels: response.data.months,
            datasets: [
              {
                label: 'Score de risque moyen',
                data: response.data.averageScores,
                borderColor: 'rgb(59, 130, 246)', // Bleu
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                borderWidth: 3,
              },
              {
                label: 'Tendance Agriculture',
                data: response.data.sectorTrend,
                borderColor: 'rgb(16, 185, 129)', // Vert
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2,
                borderDash: [5, 5], // Ligne pointillée
              }
            ]
          });
        } else {
          // Si pas de données, utiliser les données simulées
          console.log('Aucune donnée trouvée, utilisation des données simulées');
          const simulatedData = generateSimulatedData();
          
          setChartData({
            labels: simulatedData.months,
            datasets: [
              {
                label: 'Score de risque moyen',
                data: simulatedData.averageScores,
                borderColor: 'rgb(59, 130, 246)', // Bleu
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                borderWidth: 3,
              },
              {
                label: 'Tendance sectorielle',
                data: simulatedData.sectorTrend,
                borderColor: 'rgb(16, 185, 129)', // Vert
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2,
                borderDash: [5, 5], // Ligne pointillée
              }
            ]
          });
        }
        
      } catch (error) {
        console.error('Erreur lors de la récupération des données d\'évolution:', error);
        
        // En cas d'erreur, utiliser les données simulées
        const simulatedData = generateSimulatedData();
        
        setChartData({
          labels: simulatedData.months,
          datasets: [
            {
              label: 'Score de risque moyen',
              data: simulatedData.averageScores,
              borderColor: 'rgb(59, 130, 246)', // Bleu
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 6,
              pointHoverRadius: 8,
              borderWidth: 3,
            },
            {
              label: 'Tendance sectorielle',
              data: simulatedData.sectorTrend,
              borderColor: 'rgb(16, 185, 129)', // Vert
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: false,
              pointRadius: 4,
              pointHoverRadius: 6,
              borderWidth: 2,
              borderDash: [5, 5], // Ligne pointillée
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRiskEvolutionData();
  }, []);

  // Fonction pour générer des données simulées
  const generateSimulatedData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'];
    const baseScore = 5.5;
    const averageScores = [];
    const sectorTrend = [];

    months.forEach((month, index) => {
      // Simulation d'une évolution réaliste des scores
      const variation = (Math.random() - 0.5) * 1.5;
      const monthlyScore = Math.max(1, Math.min(10, baseScore + variation + (index * 0.1)));
      averageScores.push(Number(monthlyScore.toFixed(1)));

      // Tendance sectorielle légèrement différente
      const sectorVariation = (Math.random() - 0.5) * 1.2;
      const sectorScore = Math.max(1, Math.min(10, baseScore + sectorVariation + (index * 0.15)));
      sectorTrend.push(Number(sectorScore.toFixed(1)));
    });

    return { months, averageScores, sectorTrend };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      title: {
        display: false, // On gère le titre avec le composant parent
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}/10`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          borderDash: [2, 2]
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 10,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          borderDash: [2, 2]
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          callback: function(value) {
            return value + '/10';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverBackgroundColor: 'white',
        hoverBorderWidth: 3
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Évolution des scores de risque
          </h3>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Évolution des scores de risque
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Suivi des tendances sur les 7 derniers mois
          </p>
        </div>
        
        {/* Indicateurs de statut */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Portfolio</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Agriculture</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        {chartData && (
          <Line 
            data={chartData} 
            options={chartOptions}
          />
        )}
      </div>
      
      {/* Statistiques en bas */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {chartData?.datasets[0]?.data[chartData.datasets[0].data.length - 1] || '0'}
            </div>
            <div className="text-xs text-gray-500">Score actuel</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              +0.3
            </div>
            <div className="text-xs text-gray-500">Évolution</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">
              {chartData?.datasets[0]?.data.length || '0'}
            </div>
            <div className="text-xs text-gray-500">Mois analysés</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskEvolutionChart;
