const express = require('express');
const companyController = require('../controllers/companyController');
const midAuth = require('../middlewares/midAuth');

const router = express.Router();

router.get('/search/:siret', midAuth, companyController.searchCompanyBySiret);
router.post('/create-company', midAuth, companyController.createCompany);
router.get('/bank/:bankId', midAuth, companyController.getCompaniesByBank);
router.get('/', midAuth, companyController.getCompaniesByUser)

module.exports = router;