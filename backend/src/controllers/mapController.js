const { PrismaClient } = require('../../generated/prisma');
const { getRiskDataByDepartments, getCompaniesWithRiskData } = require('../services/departmentMappingService');

const prisma = new PrismaClient();
// Récupérer les données de risque par département pour la carte
const getRiskMapData = async (req, res) => {
    try {        
         // Récupérer l'ID de la banque depuis le header (banque sélectionnée)
        const bankId = req.headers['x-bank-id'];
        
        if (!bankId) {
            return res.status(400).json({
                success: false,
                message: 'ID de banque manquant dans les headers'
            });
        }
        
        const riskData = await getRiskDataByDepartments(parseInt(bankId));
                
        res.status(200).json({
            success: true,
            data: riskData,
            message: 'Données de risque par département récupérées avec succès'
        });
        
    } catch (error) {
        console.error('Erreur lors de la récupération des données de carte:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des données de carte',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getCompaniesMapData = async (req, res) => {
    try {
        // Récupérer l'ID de la banque depuis le header (banque sélectionnée)
        const bankId = req.headers['x-bank-id'];
        
        if (!bankId) {
            return res.status(400).json({
                success: false,
                message: 'ID de banque manquant dans les headers'
            });
        }
        
        const companiesData = await getCompaniesWithRiskData(parseInt(bankId));
        
        res.status(200).json({
            success: true,
            data: companiesData,
            message: 'Données des entreprises récupérées avec succès'
        });
        
    } catch (error) {
        console.error('Erreur lors de la récupération des entreprises:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des entreprises',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {
    getRiskMapData,
    getCompaniesMapData
};