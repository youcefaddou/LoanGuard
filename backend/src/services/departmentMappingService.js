const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

function getDepartmentFromZipCode(zipCode) {
  if (!zipCode || zipCode.length < 2) return null;

  //cas spéciaux pour la corse
  if (zipCode.startsWith("200") || zipCode.startsWith("201")) return "2A";
  if (zipCode.startsWith("202") || zipCode.startsWith("206")) return "2B";

  // cas spéciaux pour les DOM-TOM
  if (zipCode.startsWith("971")) return "971"; // Guadeloupe
  if (zipCode.startsWith("972")) return "972"; // Martinique
  if (zipCode.startsWith("973")) return "973"; // Guyane
  if (zipCode.startsWith("974")) return "974"; // La Réunion
  if (zipCode.startsWith("976")) return "976"; // Mayotte
  if (zipCode.startsWith("975")) return "975"; // Saint-Pierre-et-Miquelon
  if (zipCode.startsWith("986")) return "986"; // Wallis-et-Futuna
  if (zipCode.startsWith("987")) return "987"; // Polynésie française
  if (zipCode.startsWith("988")) return "988"; // Nouvelle-Calédonie

  // cas général pour la métropole
  const departmentCode = zipCode.substring(0, 2);
  return departmentCode;
}

function loadDepartmentsCoordinates() {
  const filePath = path.join(__dirname,"../../data/departmentsCoordinates.json");
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

async function getRiskDataByDepartments() {
  try {
    // Récupérer toutes les entreprises avec leurs prêts et scores de risque
    const companies = await prisma.company.findMany({
      include: {
        loans: {
          include: {
            riskScores: {
              orderBy: {
                date: "desc",
              },
              take: 1, // Prendre le score de risque le plus récent
            },
          },
        },
      },
    });

    const departmentsCoordinates = loadDepartmentsCoordinates();
    const departmentRisks = {};

    // Traiter chaque entreprise
    companies.forEach((company) => {
      if (!company.zipCode) return;

      const departmentCode = getDepartmentFromZipCode(company.zipCode);
      if (!departmentCode || !departmentsCoordinates[departmentCode]) return;

      // Initialiser le département s'il n'existe pas
      if (!departmentRisks[departmentCode]) {
        departmentRisks[departmentCode] = {
          code: departmentCode,
          name: departmentsCoordinates[departmentCode].name,
          latitude: departmentsCoordinates[departmentCode].lat,
          longitude: departmentsCoordinates[departmentCode].lng,
          totalRiskScore: 0,
          companiesCount: 0,
          loansCount: 0,
          averageRiskScore: 0,
        };
      }

      departmentRisks[departmentCode].companiesCount++;

      // Calculer le risque moyen des prêts de cette entreprise
      company.loans.forEach((loan) => {
        departmentRisks[departmentCode].loansCount++;

        if (loan.riskScores && loan.riskScores.length > 0) {
          departmentRisks[departmentCode].totalRiskScore +=
            loan.riskScores[0].score;
        }
      });
    });

    for (const deptCode in departmentRisks) {
      const dept = departmentRisks[deptCode];
      if (dept.loansCount > 0) {
        dept.averageRiskScore = dept.totalRiskScore / dept.loansCount;
      }
    }

    // Convertir l'objet en tableau pour le retour
    const resultArray = [];
    for (const deptCode in departmentRisks) {
      resultArray.push(departmentRisks[deptCode]);
    }

    return resultArray;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de risque par département:",
      error
    );
    throw error;
  }
}

async function getCompaniesWithRiskData() {
    try {
        const companies = await prisma.company.findMany({
            include: {
                loans: {
                    include: {
                        riskScores: {
                            orderBy: {
                                date: "desc"
                            },
                            take: 1
                        }
                    }
                }
            }
        });

        const result = [];
        
        companies.forEach(company => {
            if (!company.zipCode) return;
            
            const departmentCode = getDepartmentFromZipCode(company.zipCode);
            if (!departmentCode) return;

            // Calculer le score moyen de l'entreprise
            let totalRiskScore = 0;
            let riskCount = 0;
            
            company.loans.forEach(loan => {
                if (loan.riskScores && loan.riskScores.length > 0) {
                    totalRiskScore += loan.riskScores[0].score;
                    riskCount++;
                }
            });

            const averageRiskScore = riskCount > 0 ? totalRiskScore / riskCount : 0;

            result.push({
                id: company.id,
                name: company.name,
                address: company.address,
                zipCode: company.zipCode,
                city: company.city,
                departmentCode: departmentCode,
                averageRiskScore: averageRiskScore,
                loansCount: company.loans.length,
                loans: company.loans.map(loan => ({
                    id: loan.id,
                    amount: loan.amount,
                    riskScore: loan.riskScores.length > 0 ? loan.riskScores[0].score : 0
                }))
            });
        });

        return result;
    } catch (error) {
        console.error('Erreur lors de la récupération des entreprises:', error);
        throw error;
    }  
}

module.exports = {
  getDepartmentFromZipCode,
  loadDepartmentsCoordinates,
  getRiskDataByDepartments,
  getCompaniesWithRiskData
};
