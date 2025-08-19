const { PrismaClient } = require("../../generated/prisma");
const argon2 = require("argon2");

const prisma = new PrismaClient();

// Récupérer tous les utilisateurs
exports.getUsers = async (req, res) => {
  try {
    const bankId = req.headers['x-bank-id'];
    
    if (!bankId) {
      return res.status(400).json({
        message: "ID de banque manquant"
      });
    }

    const users = await prisma.user.findMany({
      where: {
        userBanks: {
          some: {
            bankId: parseInt(bankId)
          }
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    res.json({
      message: "Utilisateurs récupérés avec succès",
      users: users
    });

  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des utilisateurs"
    });
  }
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const bankId = req.headers['x-bank-id'];
    const { firstName, lastName, email, role, password } = req.body;

    if (!bankId) {
      return res.status(400).json({
        message: "ID de banque manquant"
      });
    }

    // Vérifier que l'utilisateur connecté est un RES
    if (req.user.role !== 'RES') {
      return res.status(403).json({
        message: "Accès refusé : seuls les responsables peuvent créer des utilisateurs"
      });
    }

    // Vérifier que l'email n'existe pas déjà
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Un utilisateur avec cet email existe déjà"
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await argon2.hash(password);

    const newUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        role: role,
        bankId: parseInt(bankId),
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: newUser
    });

  } catch (error) {
    console.error("Erreur création utilisateur:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la création de l'utilisateur"
    });
  }
};

// Modifier un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const bankId = req.headers['x-bank-id'];
    const { firstName, lastName, email, role, isActive } = req.body;

    if (!bankId) {
      return res.status(400).json({
        message: "ID de banque manquant"
      });
    }

    // Vérifier que l'utilisateur connecté est un RES
    if (req.user.role !== 'RES') {
      return res.status(403).json({
        message: "Accès refusé : seuls les responsables peuvent modifier des utilisateurs"
      });
    }

    // Vérifier que l'utilisateur existe et appartient à la banque
    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        bankId: parseInt(bankId)
      }
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "Utilisateur non trouvé"
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        isActive: isActive
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    res.json({
      message: "Utilisateur modifié avec succès",
      user: updatedUser
    });

  } catch (error) {
    console.error("Erreur modification utilisateur:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la modification de l'utilisateur"
    });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const bankId = req.headers['x-bank-id'];

    if (!bankId) {
      return res.status(400).json({
        message: "ID de banque manquant"
      });
    }

    // Vérifier que l'utilisateur connecté est un RES
    if (req.user.role !== 'RES') {
      return res.status(403).json({
        message: "Accès refusé : seuls les responsables peuvent supprimer des utilisateurs"
      });
    }

    // Vérifier que l'utilisateur existe et appartient à la banque
    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        bankId: parseInt(bankId)
      }
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "Utilisateur non trouvé"
      });
    }

    await prisma.user.delete({
      where: {
        id: userId
      }
    });

    res.json({
      message: "Utilisateur supprimé avec succès"
    });

  } catch (error) {
    console.error("Erreur suppression utilisateur:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la suppression de l'utilisateur"
    });
  }
};