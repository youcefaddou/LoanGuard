const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/midAuth');

const router = express.Router();

// Toutes les routes utilisateurs nécessitent une authentification
router.use(authMiddleware);
// Récupérer tous les utilisateurs
router.get('/', userController.getUsers);
// Créer un nouvel utilisateur
router.post('/', userController.createUser);
// Modifier un utilisateur
router.put('/:id', userController.updateUser);
// Supprimer un utilisateur
router.delete('/:id', userController.deleteUser);

module.exports = router;