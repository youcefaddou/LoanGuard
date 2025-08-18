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
        data: riskScoreData,
      });
      // Créer une alerte pour la mise à jour du score de risque
      await prisma.alert.create({
        data: {
          loanId: loan.id,
          type: "info",
          message: `Score de risque mis à jour: ${
            prediction.riskLevel
          } (${prediction.score.toFixed(1)}/10)`,
          date: new Date(),
        },
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
        await riskCalculationService.calculateRiskScore(loan.id);
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

      // Vérifier s'il existe déjà un score de risque pour ce prêt
      let existingRiskScore = await prisma.riskScore.findFirst({
        where: { loanId: parseInt(loanId) },
        orderBy: { date: "desc" },
      });

      // Si aucun score n'existe, calculer un nouveau score
      if (!existingRiskScore) {
        console.log(`Aucun score de risque trouvé pour le prêt ${loanId}, calcul en cours...`);
        
        // Calculer un nouveau score de risque
        const newRiskScore = await riskCalculationService.calculateRiskScore(parseInt(loanId));
        
        if (!newRiskScore) {
          return res.status(500).json({
            message: "Erreur lors du calcul du score de risque",
          });
        }
        
        existingRiskScore = newRiskScore;
      }

      // Retourner le score (existant ou nouveau)
      res.json({
        message: "Score de risque récupéré avec succès",
        score: existingRiskScore.score,
        evolution: 0, // Pour le moment, on met 0 en attendant d'implémenter le calcul d'évolution
        riskLevel: existingRiskScore.riskLevel,
        date: existingRiskScore.date,
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
