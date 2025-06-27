const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/midAuth');

// Routes d'authentification

// Connexion/déconnexion utilisateur
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;