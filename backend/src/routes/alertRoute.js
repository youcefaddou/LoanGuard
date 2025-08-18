const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController");
const authMiddleware = require("../middlewares/midAuth");

router.get("/", authMiddleware, alertController.getAllAlerts);
router.get("/loan/:loanId", authMiddleware, alertController.getAlertsByLoan);
router.post("/", authMiddleware, alertController.createAlert);

module.exports = router;