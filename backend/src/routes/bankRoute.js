const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const authMiddleware = require('../middlewares/midAuth');

// route pour récupérer les agences d'un utilisateur RES
router.get('/user-banks', authMiddleware, bankController.getUserBanks);

// route pour valider l'accès à une agence spécifique
router.get('/validate-access/:bankId', authMiddleware, bankController.validateBankAccess);

module.exports = router;
