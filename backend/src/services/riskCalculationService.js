const riskPredictionModel = require("./riskPredictionModel");
const aiTrainingService = require("./aiTrainingService");
const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

const riskCalculationService = {
  //calculer le score de risque d'un prêt
  calculateRiskScore: async (loanId) => {
    // Récupérer le prêt avec toutes ses données
    try {
      const loan = await prisma.loan.findUnique({
        where: { id: parseInt(loanId) },
        include: {
          payments: true,
          company: true,
          user: true,
        },
      });
      if (!loan) {
        throw new Error("Prêt non trouvé");
      }
      const features = await aiTrainingService.createFeatures(loan);
      const prediction = await riskPredictionModel.predict(features);
      const riskScoreData = {
        loanId: loan.id,
        score: prediction.score,
        riskLevel: prediction.riskLevel,
        date: new Date(),
        weatherFactor: features[7],
        sectorFactor: features[6],
        externalFactors: JSON.stringify({
          lateRatio: features[4],
          recentLateRatio: features[5],
          timeRatio: features[8],
        }),
      };
      
      const savedRiskScore = await prisma.riskScore.create({
        data: riskScoreData
      });
      
      return {
        success: true,
        data: savedRiskScore,
        prediction,
      };
    } catch (error) {
      console.error("Erreur calcul risque: ", error);
      return { success: false, error: error.message };
    }
  },
  // Mettre à jour tous les scores de risque
  updateAllRiskScores: async () => {
    try {
      const loans = await prisma.loan.findMany({
        where: { status: "Actif" },
        include: { payments: true, company: true, user: true },
      });
      for (const loan of loans) {
        await this.calculateRiskScore(loan.id);
      }
      return { success: true, updated: loans.length };
    } catch (error) {
      console.error("Erreur mise à jour scores risque: ", error);
      return { success: false, error: error.message };
    }
  },

  // Endpoint API pour calcul de score
  calculateForApi: async (req, res) => {
    try {
      const { loanId } = req.params;
      if (!loanId) {
        return res.status(400).json({
          message: "ID de prêt manquant",
        });
      }
      const result = await this.calculateRiskScore(loanId);

      if (!result.success) {
        return res.status(404).json({
          message: result.error,
        });
      }
      res.json({
        message: "Score de risque calculé avec succès",
        riskScore: result.data,
        prediction: result.prediction,
      });
    } catch (error) {
      console.error("Erreur calcul risque API: ", error);
      res.status(500).json({
        message: "Erreur interne du serveur",
      });
    }
  },
};

module.exports = riskCalculationService;
