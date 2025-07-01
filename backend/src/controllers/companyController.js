const { PrismaClient } = require("../../generated/prisma");
const sireneService = require("../services/sireneService");

const prisma = new PrismaClient();

const searchCompanyBySiret = async (req, res) => {
  const { siret } = req.params;
  try {
    const companyData = await sireneService.getCompanyBySiret(siret);

    res.json({
      message: "Entreprise trouvée",
      company: companyData,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la recherche de l'entreprise:",
      error.message
    );

    if (error.message.includes("invalide")) {
      return res.status(400).json({ message: error.message });
    }

    if (error.message.includes("non trouvée")) {
      return res.status(404).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: "Erreur lors de la recherche de l'entreprise" });
  }
};

const createCompany = async (req, res) => {
  const { siret, name, sector, address, zipCode, city, bankId } = req.body;
  try {
    // Validation des données requises
    if (!name || !siret || !bankId) {
      return res.status(400).json({
        message: "Nom, SIRET et ID de banque obligatoires",
      });
    }

    // Création en base via Prisma
    const newCompany = await prisma.company.create({
      data: {
        name,
        siret,
        sector: sector || "Non spécifié",
        address: address || "",
        zipCode: zipCode || "",
        city: city || "",
        bankId: parseInt(bankId),
      },
    });

    res.status(201).json({
      message: "Entreprise créée avec succès",
      company: newCompany,
    });
  } catch (error) {
    console.error("Erreur création entreprise:", error.message);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Une entreprise avec ce SIRET existe déjà",
      });
    }
    res.status(500).json({ message: "Erreur lors de la création" });
  }
};

// Récupère toutes les entreprises d'une banque
const getCompaniesByBank = async (req, res) => {
  const { bankId } = req.params;

  try {
    const companies = await prisma.company.findMany({
      where: { bankId: parseInt(bankId) },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      message: "Entreprises récupérées",
      companies,
    });
  } catch (error) {
    console.error("Erreur récupération entreprises:", error.message);
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
};

module.exports = {
  searchCompanyBySiret,
  createCompany,
  getCompaniesByBank,
};
