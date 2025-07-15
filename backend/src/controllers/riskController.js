const riskCalculationService = require('../services/riskCalculationService');

exports.calculateRiskScore = riskCalculationService.calculateForApi

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