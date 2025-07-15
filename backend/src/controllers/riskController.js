const riskCalculationService = require('../services/riskCalculationService');
const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

exports.calculateRiskScore = riskCalculationService.calculateForApi

exports.getRiskHistory = async (req, res) => {
    try {
        const { loanId } = req.params;
        
        const riskScores = await prisma.riskScore.findMany({
            where: { loanId: parseInt(loanId) },
            orderBy: { date: "desc" },
            take: 10 // Limiter aux 10 derniers scores
        });

        res.json({
            message: "Historique récupéré avec succès",
            scores: riskScores
        });
    } catch (error) {
        console.error("Erreur récupération historique:", error);
        res.status(500).json({
            message: "Erreur lors de la récupération de l'historique"
        });
    }
};

exports.updateAllRiskScores = async (req, res) => {
    try {
        const result = await riskCalculationService.updateAllRiskScores()
        res.json({
            message: "Scores de risque mis à jour",
            success: result.success,
            updated: result.updated
        })
    } catch (error) {
        console.error("Erreur mise à jour scores risque: ", error);
        res.status(500).json({
            message: "Erreur interne du serveur",
        });
    }
}