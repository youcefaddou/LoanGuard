const express = require("express")
const router = express.Router()
const loanController = require("../controllers/loanController")
const authMiddleware = require("../middlewares/midAuth")


router.post("/loans", authMiddleware, loanController.createLoan)
router.get("/loans/:id", authMiddleware, loanController.getLoanById)
router.put("/loans/:id", authMiddleware, loanController.updateLoan)
router.delete("/loans/:id", authMiddleware, loanController.deleteLoan)
router.get("/companies", authMiddleware, loanController.getCompanies)


module.exports = router