// Script pour créer des entreprises réelles uniquement pour la banque Aubagne (ID: 4)
const { PrismaClient } = require('../generated/prisma');
const axios = require('axios');

const prisma = new PrismaClient();

const secteurs = [
  { code: '01.11Z', nom: 'Culture de céréales' },
  { code: '01.21Z', nom: 'Culture de la vigne' },
  { code: '41.20A', nom: 'Construction maisons individuelles' },
  { code: '56.10A', nom: 'Restauration traditionnelle' },
  { code: '47.11A', nom: 'Commerce alimentaire' }
];

/**
 * Recherche d'entreprises par secteur NAF via API Sirene
 */
const searchCompaniesBySector = async (sectorCode, maxResults = 10) => {
  try { 
    const response = await axios.get('https://api.insee.fr/api-sirene/3.11/siret', {
      headers: {
        'X-INSEE-Api-Key-Integration': process.env.SIRENE_API_KEY,
        'Accept': 'application/json'
      },
      params: {
        q: `activitePrincipaleUniteLegale:${sectorCode}`,
        nombre: maxResults,
        debut: 1
      }
    });

    const etablissements = response.data.etablissements || [];
    
    return etablissements.map(etablissement => ({
      siret: etablissement.siret,
      name: etablissement.uniteLegale.denominationUniteLegale || 
            `${etablissement.uniteLegale.prenom1UniteLegale || ''} ${etablissement.uniteLegale.nomUniteLegale || ''}`.trim(),
      sector: etablissement.uniteLegale.activitePrincipaleUniteLegale,
      address: `${etablissement.adresseEtablissement.numeroVoieEtablissement || ''} ${etablissement.adresseEtablissement.typeVoieEtablissement || ''} ${etablissement.adresseEtablissement.libelleVoieEtablissement || ''}`.trim(),
      zipCode: etablissement.adresseEtablissement.codePostalEtablissement,
      city: etablissement.adresseEtablissement.libelleCommuneEtablissement,
      isActive: etablissement.etatAdministratifEtablissement === 'A'
    }));

  } catch (error) {
    console.error(`Erreur recherche secteur ${sectorCode}:`, error.response?.data || error.message);
    return [];
  }
};

const collectCompaniesAubagne = async () => {
  console.log('Collecte d\'entreprises pour BNP Paribas - Aubagne');
  console.log('Objectif: 50 entreprises réelles assignées à la banque Aubagne');
  
  let totalCreees = 0;
  
  try {
    // Vérifier que la banque Aubagne existe
    const aubagneBank = await prisma.bank.findFirst({
      where: { name: 'BNP Paribas - Aubagne' }
    });

    if (!aubagneBank) {
      console.error('Banque Aubagne non trouvée. Exécutez d\'abord createTestBanks.js');
      return;
    }

    console.log(`Banque Aubagne trouvée (ID: ${aubagneBank.id})`);

    for (const secteur of secteurs) {
      console.log(`\n Secteur: ${secteur.nom} (${secteur.code})`);
      
      // Rechercher des entreprises dans ce secteur
      const companies = await searchCompaniesBySector(secteur.code, 10);
      
      if (companies.length === 0) {
        console.log(`  Aucune entreprise trouvée pour ce secteur`);
        continue;
      }
      
      console.log(` ${companies.length} entreprises trouvées`);
      
      // Créer chaque entreprise en base (max 10 par secteur)
      for (const company of companies) {
        try {
          // Vérifier si elle existe déjà
          const exists = await prisma.company.findUnique({
            where: { siret: company.siret }
          });
          
          if (exists) {
            console.log(`  ${company.name} existe déjà`);
            continue;
          }
          
          // Créer en base UNIQUEMENT pour la banque Aubagne
          const newCompany = await prisma.company.create({
            data: {
              name: company.name || 'Nom non spécifié',
              siret: company.siret,
              sector: company.sector || secteur.code,
              address: company.address || 'Adresse non spécifiée',
              zipCode: company.zipCode || '00000',
              city: company.city || 'Ville non spécifiée',
              bankId: aubagneBank.id // UNIQUEMENT banque Aubagne
            }
          });
          
          totalCreees++;
          console.log(` ${newCompany.name} créée (ID: ${newCompany.id})`);
          
          // Pause de 300ms entre créations pour respecter l'API
          await new Promise(resolve => setTimeout(resolve, 300));
          
        } catch (error) {
          console.log(` Erreur création ${company.name}: ${error.message}`);
        }
      }
      
      // Pause entre secteurs pour respecter l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n Collecte terminée !`);
    console.log(` Total entreprises créées pour Aubagne: ${totalCreees}`);
    console.log(` Banque Aubagne prête avec des données réelles !`);
    
  } catch (error) {
    console.error(' Erreur générale:', error.message);
  } finally {
    await prisma.$disconnect();
  }
};

collectCompaniesAubagne();
