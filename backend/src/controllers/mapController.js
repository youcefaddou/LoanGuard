const { getRiskDataByDepartments, getCompaniesWithRiskData } = require('../services/departmentMappingService');

// Récupérer les données de risque par département pour la carte
const getRiskMapData = async (req, res) => {
    try {        
        const riskData = await getRiskDataByDepartments();
                
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
        const companiesData = await getCompaniesWithRiskData();
        
        console.log(`Données récupérées pour ${companiesData.length} entreprises`);
        
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