const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/midAuth');
const { requireResponsable, requireAnyUser } = require('../middlewares/roleAuth');

const router = express.Router();

// Toutes les routes utilisateurs nécessitent une authentification
router.use(authMiddleware);

// Récupérer tous les utilisateurs (accessible à tous les users authentifiés)
router.get('/', userController.getUsers);

// Créer un nouvel utilisateur (SEULEMENT RES)
router.post('/', requireResponsable, userController.createUser);

// Modifier un utilisateur (CHG + RES)
router.put('/:id', requireResponsable, requireAnyUser, userController.updateUser);

// Supprimer un utilisateur (SEULEMENT RES)
router.delete('/:id', requireResponsable, userController.deleteUser);

module.exports = router;