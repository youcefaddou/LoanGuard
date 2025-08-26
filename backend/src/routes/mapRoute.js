const express = require("express")
const router = express.Router()
const mapController = require('../controllers/mapController');
const { getRiskMapData, getCompaniesMapData } = mapController;
const authenticateToken = require('../middlewares/midAuth');

//récuperer les données de risque par département
router.get('/risk-departements', authenticateToken, getRiskMapData);
//récupérer les données des entreprises pour la carte
router.get('/companies', authenticateToken, getCompaniesMapData);

module.exports = router
