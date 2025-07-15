const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const midAuth = require('../middlewares/midAuth');

router.post('/run/:loanId', midAuth, simulationController.runSimulation);
router.get('/history/:loanId', midAuth, simulationController.getSimulationHistory);

module.exports = router