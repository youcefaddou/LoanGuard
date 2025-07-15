const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');
const midAuth = require('../middlewares/midAuth');

// Route pour calculer le score de risque d'un prêt
router.get('/calculate/:loanId', midAuth, riskController.calculateRiskScore)

// Route pour récupérer l'historique des scores de risque
router.get('/history/:loanId', midAuth, riskController.getRiskHistory)

//route pour mettre a jour tous les scores
router.post('/update-all', midAuth, riskController.updateAllRiskScores)

module.exports = router