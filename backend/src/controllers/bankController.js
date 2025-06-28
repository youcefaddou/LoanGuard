const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

// Récupérer les agences d'un utilisateur RES
exports.getUserBanks = async (req, res) => {
  try {
    const userId = req.user.id; // Récupéré depuis le middleware auth

    // verifier que l'utilisateur est bien un RES
    if (req.user.role !== "RES") {
      return res.status(403).json({
        message: "Accès réservé aux responsables d'agence",
      });
    }

    // recupérer les agences de l'utilisateur
    const userBanks = await prisma.userBank.findMany({
      where: { userId },
      include: {
        bank: true,
      },
    });

    if (userBanks.length === 0) {
      return res.status(404).json({
        message: "Aucune agence associée à cet utilisateur",
      });
    }

    // créer le tableau des agences pour la réponse
    const banksResponse = [];
    for (let i = 0; i < userBanks.length; i++) {
      banksResponse.push({
        id: userBanks[i].bank.id,
        name: userBanks[i].bank.name,
        address: userBanks[i].bank.address,
        city: userBanks[i].bank.city,
      });
    }

    res.json({
      message: "Agences récupérées avec succès",
      banks: banksResponse,
    });
  } catch (error) {
    console.error("Erreur récupération agences:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Vérifier l'accès d'un utilisateur à une agence spécifique
exports.validateBankAccess = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bankId } = req.params;

    // Validation du paramètre bankId
    if (!bankId || isNaN(parseInt(bankId))) {
      return res.status(400).json({
        message: "ID d'agence invalide",
      });
    }

    // Vérifier l'accès selon le rôle
    let hasAccess = false;

    if (req.user.role === "RES") {
      // RES : vérifier dans UserBank
      const userBank = await prisma.userBank.findFirst({
        where: {
          userId,
          bankId: parseInt(bankId),
        },
        include: { bank: true },
      });

      if (userBank) {
        hasAccess = true;
        return res.json({
          message: "Accès autorisé",
          hasAccess: true,
          bank: {
            id: userBank.bank.id,
            name: userBank.bank.name,
          },
        });
      }
    } else if (req.user.role === "CHG") {
      const bank = await prisma.bank.findUnique({
        where: { id: parseInt(bankId) },
      });

      if (bank) {
        hasAccess = true;
        return res.json({
          message: "Accès autorisé",
          hasAccess: true,
          bank: {
            id: bank.id,
            name: bank.name,
          },
        });
      }
    }

    // Accès refusé
    res.status(403).json({
      message: "Accès non autorisé à cette agence",
      hasAccess: false,
    });
  } catch (error) {
    console.error("Erreur validation accès agence:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Middleware pour vérifier l'accès à une agence sur les routes protégées
exports.checkBankAccess = async (req, res, next) => {
  try {
    const userId = req.user.id
    const bankId = req.headers["x-bank-id"] || req.body.bankId

    // Si aucune agence spécifiée et que c'est un RES, erreur
    if (req.user.role === "RES" && !bankId) {
      return res.status(400).json({
        message: "ID d'agence requis pour cette opération",
      });
    }

    // Si agence spécifiée, vérifier l'accès
    if (bankId) {
      if (req.user.role === "RES") {
        const userBank = await prisma.userBank.findFirst({
          where: {
            userId,
            bankId: parseInt(bankId),
          },
        });

        if (!userBank) {
          return res.status(403).json({
            message: "Accès non autorisé à cette agence",
          });
        }
      }

      // Ajouter l'ID de l'agence au request pour les controllers suivants
      req.bankId = parseInt(bankId)
    }

    next()
  } catch (error) {
    console.error("Erreur middleware bank access:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
};

exports.getAllBanks = async (req, res) => {
  try {
    if (req.user.role === "RES") {
      const userBanks = await prisma.userBank.findMany({
        where: { userId: req.user.id },
        include: { bank: true },
      });
      const banks = userBanks.map(userBank => ({
        id: userBank.bank.id,
        name: userBank.bank.name,
        address: userBank.bank.address,
        city: userBank.bank.city,
      }))
      return res.json(banks)
    }
    //si c'est un CHG, récupérer toutes les banques
    const banks = await prisma.bank.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
      },
    })
    
    res.json(banks)
  } catch (error) {
    console.error("Erreur récupération banques:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}
