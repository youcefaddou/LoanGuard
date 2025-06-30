const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const authMiddleware = require('../middlewares/midAuth');

router.get('/', authMiddleware, bankController.getAllBanks)
router.get('/user-banks', authMiddleware, bankController.getUserBanks)
router.get('/validate-access/:bankId', authMiddleware, bankController.validateBankAccess)

module.exports = router;
