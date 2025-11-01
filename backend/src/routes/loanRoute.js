const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");
const authMiddleware = require("../middlewares/midAuth");
const { requireResponsable, requireAnyUser } = require("../middlewares/roleAuth");

// Créer un prêt (SEULEMENT RES)
router.post("/", authMiddleware, requireResponsable, loanController.createLoan);

// Récupérer tous les prêts (tous les users authentifiés)
router.get("/", authMiddleware, requireAnyUser, loanController.getAllLoans);

// Modifier un prêt (SEULEMENT RES)
router.put("/:id", authMiddleware, requireResponsable, loanController.updateLoan);

// Supprimer un prêt (SEULEMENT RES)
router.delete("/:id", authMiddleware, requireResponsable, loanController.deleteLoan);

// Récupérer les entreprises (tous les users authentifiés)
router.get("/companies", authMiddleware, requireAnyUser, loanController.getCompanies);

// Route pour récupérer la liste de surveillance (tous les users authentifiés)
router.get("/watchlist", authMiddleware, requireAnyUser, loanController.getWatchlist);

// Récupérer un prêt par ID (tous les users authentifiés)
router.get("/:id", authMiddleware, requireAnyUser, loanController.getLoanById);

module.exports = router;