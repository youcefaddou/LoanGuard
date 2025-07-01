const axios = require('axios');
const SIRENE_API_BASE_URL = 'https://api.insee.fr/api-sirene/3.11'

const getCompanyBySiret = async (siret) => {
    try {
        // Validation du SIRET (14 chiffres)
    if (!siret || siret.length !== 14 || !/^\d{14}$/.test(siret)) {
      throw new Error('SIRET invalide - doit contenir exactement 14 chiffres')
    }
    const response = await axios.get(`${SIRENE_API_BASE_URL}/siret/${siret}`, {
        headers: {
            'X-INSEE-Api-Key-Integration': process.env.SIRENE_API_KEY,
            'Accept': 'application/json'
        }
    })

    const etablissement = response.data.etablissement

    //formatage des données
    return {
      siret: etablissement.siret,
      name: etablissement.uniteLegale.denominationUniteLegale,
      sector: etablissement.uniteLegale.activitePrincipaleUniteLegale,
      address: etablissement.adresseEtablissement.libelleVoieEtablissement,
      zipCode: etablissement.adresseEtablissement.codePostalEtablissement,
      city: etablissement.adresseEtablissement.libelleCommuneEtablissement,
      isActive: etablissement.etatAdministratifEtablissement === 'A'
    };

  } catch (error) {
    console.error('Erreur API Sirene:', error.message);
    
    if (error.response?.status === 404) {
      throw new Error('Entreprise non trouvée avec ce SIRET');
    }
    
    throw new Error('Erreur lors de la récupération des données entreprise');
  }
}

const searchCompaniesByName = async (name) => {
  try {
    if (!name || name.length < 3) {
      throw new Error('Le nom doit contenir au moins 3 caractères');
    }

    const response = await axios.get(`${SIRENE_API_BASE_URL}/siret`, {
      headers: {
        'X-INSEE-Api-Key-Integration': process.env.SIRENE_API_KEY,
        'Accept': 'application/json'
      },
      params: {
        q: `denominationUniteLegale:"${name}"`,
        nombre: 10 // Limite à 10 résultats
      }
    });

    const etablissements = response.data.etablissements || [];
    
    return etablissements.map(etablissement => ({
      siret: etablissement.siret,
      name: etablissement.uniteLegale.denominationUniteLegale,
      sector: etablissement.uniteLegale.activitePrincipaleUniteLegale,
      address: `${etablissement.adresseEtablissement.numeroVoieEtablissement || ''} ${etablissement.adresseEtablissement.typeVoieEtablissement || ''} ${etablissement.adresseEtablissement.libelleVoieEtablissement || ''}`.trim(),
      zipCode: etablissement.adresseEtablissement.codePostalEtablissement,
      city: etablissement.adresseEtablissement.libelleCommuneEtablissement,
      isActive: etablissement.etatAdministratifEtablissement === 'A'
    }))

  } catch (error) {
    console.error('Erreur recherche entreprises:', error.response?.data || error.message);
    throw new Error("Erreur lors de la recherche d'entreprises")
  }
}

module.exports = {
  getCompanyBySiret,
  searchCompaniesByName
}