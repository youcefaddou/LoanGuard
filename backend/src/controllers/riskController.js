const riskCalculationService = require("../services/riskCalculationService");
const { PrismaClient } = require("../../generated/prisma");
const aiTrainingService = require("../services/aiTrainingService");
const riskPredictionModel = require("../services/riskPredictionModel");

const prisma = new PrismaClient();

exports.calculateRiskScore = riskCalculationService.calculateForApi;

exports.getRiskHistory = async (req, res) => {
  try {
    const { loanId } = req.params;

    const riskScores = await prisma.riskScore.findMany({
      where: { loanId: parseInt(loanId) },
      orderBy: { date: "desc" },
      take: 10, // Limiter aux 10 derniers scores
    });

    res.json({
      message: "Historique récupéré avec succès",
      scores: riskScores,
    });
  } catch (error) {
    console.error("Erreur récupération historique:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de l'historique",
    });
  }
};

exports.updateAllRiskScores = async (req, res) => {
  try {
    const result = await riskCalculationService.updateAllRiskScores();
    res.json({
      message: "Scores de risque mis à jour",
      success: result.success,
      updated: result.updated,
    });
  } catch (error) {
    console.error("Erreur mise à jour scores risque: ", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

exports.getRiskEvolution = async (req, res) => {
  try {
    // Récupérer l'ID de la banque depuis le header
    const bankId = req.headers["x-bank-id"];

    if (!bankId) {
      return res.status(400).json({
        message: "ID de banque manquant",
      });
    }

    //recuperer les scores de risque des 7 derniers mois pour cette banque
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

    const riskScores = await prisma.riskScore.findMany({
      where: {
        date: {
          gte: sevenMonthsAgo,
        },
        loan: {
          bankId: parseInt(bankId), // filtrer par banque
        },
      },
      include: {
        loan: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });
    //grouper les scores par mois
    const monthlyData = {};
    const sectorData = {};

    riskScores.forEach((score) => {
      const month = new Date(score.date).toLocaleDateString("fr-FR", {
        month: "short",
        year: "2-digit",
      });
      if (!monthlyData[month]) {
        monthlyData[month] = { scores: [], count: 0 };
      }
      monthlyData[month].scores.push(score.score);
      monthlyData[month].count++;
      //données sectorielles
      const sector = score.loan.company.sector || "Autres";
      if (!sectorData[month]) {
        sectorData[month] = {};
      }
      if (!sectorData[month][sector]) {
        sectorData[month][sector] = { scores: [], count: 0 };
      }
      sectorData[month][sector].scores.push(score.score);
      sectorData[month][sector].count++;
    });
    //calculer les moyennes mensuelles
    const months = [];
    const averageScores = [];
    const sectorTrend = [];
    for (const month in monthlyData) {
      months.push(month);
      //moyenne générale
      const monthScores = monthlyData[month].scores;
      const average =
        monthScores.reduce((a, b) => a + b, 0) / monthScores.length;
      averageScores.push(Number(average.toFixed(1)));

      //moyenne sectorielle (secteur Agriculture)
      let sectorAverage = average; // Par défaut, même que la moyenne générale
      if (sectorData[month]["Agriculture"]) {
        const sectorScores = sectorData[month]["Agriculture"].scores;
        sectorAverage =
          sectorScores.reduce((a, b) => a + b, 0) / sectorScores.length;
      }
      sectorTrend.push(Number(sectorAverage.toFixed(1)));
    }

    res.json({
      message: "Évolution récupérée avec succès",
      data: {
        months,
        averageScores,
        sectorTrend,
        totalLoans: riskScores.length,
      },
    });
  } catch (error) {
    console.error("Erreur récupération évolution:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de l'évolution",
    });
  }
};
exports.trainModel = async (req, res) => {
  try {
    console.log(" Début de l'entraînement du modèle IA");
    
    // Générer les données d'entraînement depuis vos prêts
    console.log(" Génération des données d'entraînement...");
    const trainingData = await aiTrainingService.generateTrainingData();
    console.log(` ${trainingData.length} échantillons générés`);

    if (trainingData.length < 5) {
      console.log(" Pas assez de données pour l'entraînement");
      return res.status(400).json({
        message:
          "Pas assez de données pour entraîner le modèle (minimum 5 prêts)",
      });
    }

    // Entraîner le modèle
    console.log("🤖 Entraînement du modèle en cours...");
    const model = await riskPredictionModel.trainModel();
    console.log("✅ Modèle entraîné avec succès");

    // Sauvegarder le modèle
    // await riskPredictionModel.saveModel(model);

    res.json({
      message:
        "Modèle entraîné avec succès (sauvegarde temporairement désactivée)",
      dataPoints: trainingData.length,
    });
  } catch (error) {
    console.error("❌ Erreur entraînement modèle:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      message: "Erreur lors de l'entraînement du modèle",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
