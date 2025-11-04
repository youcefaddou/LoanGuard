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

// Récupérer les informations de l'utilisateur actuel (nécessite authentification)
// Note: Rate limiting n'est pas nécessaire car l'endpoint est protégé par authMiddleware
// qui vérifie le JWT token. Le token lui-même a une durée de validité limitée (8h).
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;