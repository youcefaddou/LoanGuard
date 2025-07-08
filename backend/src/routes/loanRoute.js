const express = require("express")
const router = express.Router()
const loanController = require("../controllers/loanController")
const authMiddleware = require("../middlewares/midAuth")


router.post("/", authMiddleware, loanController.createLoan)
router.get("/", authMiddleware, loanController.getAllLoans)
// router.get("/loans/:id", authMiddleware, loanController.getLoanById)
// router.put("/loans/:id", authMiddleware, loanController.updateLoan)
// router.delete("/loans/:id", authMiddleware, loanController.deleteLoan)
router.get("/companies", authMiddleware, loanController.getCompanies)
router.get('/:id', authMiddleware, loanController.getLoanById);

module.exports = router