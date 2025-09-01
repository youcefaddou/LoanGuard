const tf = require("@tensorflow/tfjs");
const { PrismaClient } = require("../../generated/prisma");
const externalDataService = require("./externalDataService");

const prisma = new PrismaClient();

const aiTrainingService = {
  //générer 1000+ exemples d'entraînement
  generateTrainingData: async () => {
    try {
      console.log("🔍 Récupération des prêts depuis la base de données...");
      const loans = await prisma.loan.findMany({
        include: {
          payments: true,
          company: true,
          user: true,
        },
      });
      console.log(`📋 ${loans.length} prêts trouvés`);
      
      const trainingData = [];
      for (let i = 0; i < loans.length; i++) {
        const loan = loans[i];
        console.log(`🔄 Traitement du prêt ${i + 1}/${loans.length} - ID: ${loan.id}`);
        try {
          const features = await createFeatures(loan);
          const label = labelData(loan.payments);
          trainingData.push({ features, label });
          console.log(`✅ Prêt ${loan.id} traité avec succès`);
        } catch (error) {
          console.error(`❌ Erreur lors du traitement du prêt ${loan.id}:`, error.message);
          // Continue avec le prêt suivant
        }
      }
      console.log(`🎯 ${trainingData.length} échantillons d'entraînement générés`);
      return trainingData;
    } catch (error) {
      console.error("❌ Erreur dans generateTrainingData:", error);
      throw error;
    }
  },
  //normaliser les données pour l'IA
  normalizeFeatures: (rawData) => {
    const features = rawData.map((item) => item.features);
    const labels = rawData.map((item) => item.label);
    return { features, labels };
  },
  //créer les features pour l'entraînement
  createFeatures: async (loan) => {
    //a implémenter - extraction des caractéristiques
  },
  //labeliser (défaut=1, success=0)
  labelData: (paymentHistory) => {
    //a implémenter - déterminer si c'est un défaut
  },
};

//fonctions helper a implémenter
async function createFeatures(loan) {
  try {
    console.log(`    🔧 Création des features pour le prêt ${loan.id}`);
    
    //features de base
    const loanAmount = loan.amount / 1000000
    const duration = loan.duration / 60
    const interestRate = loan.interestRate / 10
    const monthlyPayment = loan.monthlyPayment / 10000
    console.log(`    📊 Features de base calculées`);
    
    //features de l'historique de paiement
    const payments = loan.payments || []
    const totalPayments = payments.length;
    const latePayments = payments.filter(p => p.status === "LATE").length
    const lateRatio = totalPayments > 0 ? latePayments / totalPayments : 0
    console.log(`    💳 Features de paiement calculées (${totalPayments} paiements)`);
    
    //features sectorielles (data externe)
    console.log(`    🏭 Récupération données sectorielles pour: ${loan.company.sector}`);
    const sectorData = await externalDataService.getInseeData(loan.company.sector)
    const sectorRisk = sectorData.success ? sectorData.data.riskFactor : 0.5 
    console.log(`    ✅ Données sectorielles récupérées (risk: ${sectorRisk})`);
    
    //features météorologiques basées sur le code postal
    const department = loan.company.zipCode ? loan.company.zipCode.substring(0,2) : '75'
    console.log(`    🌤️  Récupération données météo pour département: ${department}`);
    const weatherData = await externalDataService.getWeatherData(department)
    const weatherRisk = weatherData.success ? weatherData.data.riskFactor : 0
    console.log(`    ✅ Données météo récupérées (risk: ${weatherRisk})`);
    
    //features temporelles
    const loanAge = Math.min((new Date() - new Date(loan.startDate)) / (1000 * 60 * 60 * 24 * 30), 60)
    const timeRatio = loanAge / duration 
    //features de tendance récente
    const recentPayments = payments.slice(-6)
    const recentLateRatio = recentPayments.length > 0 ? recentPayments.filter(p => p.status === "LATE").length / recentPayments.length : 0
    console.log(`    ⏰ Features temporelles calculées`);

    const features = [
      loanAmount,
      duration,
      interestRate,
      monthlyPayment,
      lateRatio,
      recentLateRatio,
      sectorRisk,
      weatherRisk,
      timeRatio,
      totalPayments / 60
    ];
    
    console.log(`    ✅ Features complètes créées pour le prêt ${loan.id}`);
    return features;
  } catch (error) {
    console.error(`    ❌ Erreur création features pour prêt ${loan.id}:`, error.message);
    throw error;
  }
}
function labelData(payments) {
  if (!payments || payments.length === 0) {
    return 0; // Pas de paiements, pas de défaut
  }
  const totalPayments = payments.length;
  const latePayments = payments.filter((p) => p.status === "LATE").length;
  const lateRatio = latePayments / totalPayments;

  //critère de défaut
  if (lateRatio > 0.5) return 1; // + de 50% de retards = défaut
  if (lateRatio > 0.3 && totalPayments > 6) return 1; // + de 30% de retards sur 6 mois = défaut

  //vérifier les 3 derniers paiements
  const recentPayments = payments.slice(-3);
  const recentLateRatio =
    recentPayments.filter((p) => p.status === "LATE").length /
    recentPayments.length;
  if (recentLateRatio >= 0.67) return 1; // 2/3 derniers paiements en retard = défaut
  return 0; // Sinon, pas de défaut
}

module.exports = aiTrainingService;
