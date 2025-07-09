const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/midAuth');

// Routes d'authentification sécurisées

// Connexion utilisateur
router.post('/login', authController.login);

// Sélection de banque après connexion (nécessite authentification)
router.post('/select-bank', authMiddleware, authController.selectBank);

// Déconnexion sécurisée (nécessite authentification)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;