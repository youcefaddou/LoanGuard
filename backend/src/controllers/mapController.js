const { PrismaClient } = require('../../generated/prisma');
const { getRiskDataByDepartments, getCompaniesWithRiskData } = require('../services/departmentMappingService');

const prisma = new PrismaClient();
// Récupérer les données de risque par département pour la carte
const getRiskMapData = async (req, res) => {
    try {        
         // Récupérer l'ID de la banque de l'utilisateur
        const userBank = await prisma.userBank.findFirst({
            where: { userId: req.user.id }
        });
        
        const bankId = userBank ? userBank.bankId : null;
        const riskData = await getRiskDataByDepartments(bankId);
                
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
        // Récupérer l'ID de la banque de l'utilisateur
        const userBank = await prisma.userBank.findFirst({
            where: { userId: req.user.id }
        });
        
        const bankId = userBank ? userBank.bankId : null;
        const companiesData = await getCompaniesWithRiskData(bankId);
        
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