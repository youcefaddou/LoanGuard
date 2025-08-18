const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");
const authMiddleware = require("../middlewares/midAuth");

router.post("/", authMiddleware, loanController.createLoan);
router.get("/", authMiddleware, loanController.getAllLoans);
// router.get("/loans/:id", authMiddleware, loanController.getLoanById)
router.put("/:id", authMiddleware, loanController.updateLoan);
router.delete("/:id", authMiddleware, loanController.deleteLoan);
router.get("/companies", authMiddleware, loanController.getCompanies);
// Route pour récupérer la liste de surveillance (watchlist)
router.get("/watchlist", authMiddleware, loanController.getWatchlist);
router.get("/:id", authMiddleware, loanController.getLoanById);

module.exports = router;
