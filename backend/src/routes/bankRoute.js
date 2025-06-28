const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const authMiddleware = require('../middlewares/midAuth');

// Route pour récupérer toutes les banques (pour le dropdown)
router.get('/', authMiddleware, bankController.getAllBanks)

// route pour récupérer les agences d'un utilisateur RES
router.get('/user-banks', authMiddleware, bankController.getUserBanks)

// route pour valider l'accès à une agence spécifique
router.get('/validate-access/:bankId', authMiddleware, bankController.validateBankAccess)

module.exports = router;
