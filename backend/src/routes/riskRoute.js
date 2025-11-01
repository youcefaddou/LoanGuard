const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');
const midAuth = require('../middlewares/midAuth');
const { requireResponsable, requireAnyUser } = require('../middlewares/roleAuth');

// Route pour calculer le score de risque d'un prêt (tous les users)
router.get('/calculate/:loanId', midAuth, requireAnyUser, riskController.calculateRiskScore)

// Route pour entraîner le modèle IA (SEULEMENT RES)
router.post('/train-model', midAuth, requireResponsable, riskController.trainModel);

// Route pour récupérer l'historique des scores de risque (tous les users)
router.get('/history/:loanId', midAuth, requireAnyUser, riskController.getRiskHistory)

//route pour mettre a jour tous les scores (SEULEMENT RES)
router.post('/update-all', midAuth, requireResponsable, riskController.updateAllRiskScores)

// Route pour récupérer l'évolution des scores de risque dashboard (tous les users)
router.get('/evolution', midAuth, requireAnyUser, riskController.getRiskEvolution)

module.exports = router