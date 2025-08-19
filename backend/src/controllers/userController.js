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

    // Créer l'utilisateur et la relation UserBank en une seule transaction
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        role: role,
        userBanks: {
          create: {
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
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const role = req.body.role;
    const password = req.body.password;

    if (!bankId) {
      return res.status(400).json({
        message: "ID de banque manquant"
      });
    }

    // Vérifier les permissions
    const isRES = req.user.role === 'RES';
    const isOwnProfile = req.user.id === userId;
    
    if (!isRES && !isOwnProfile) {
      return res.status(403).json({
        message: "Accès refusé : vous ne pouvez modifier que votre propre profil"
      });
    }

    // Si CHG modifie son propre profil, vérifier qu'il ne change que email/password
    if (!isRES && isOwnProfile) {
      const currentUser = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (firstName !== currentUser.firstName || 
          lastName !== currentUser.lastName || 
          role !== currentUser.role) {
        return res.status(403).json({
          message: "Vous ne pouvez modifier que votre email et mot de passe"
        });
      }
    }

    // Vérifier que l'utilisateur existe et appartient à la banque
    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        userBanks: {
          some: {
            bankId: parseInt(bankId)
          }
        }
      }
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "Utilisateur non trouvé"
      });
    }

    // Préparer les données à mettre à jour
    const updateData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role
    };

    // Ajouter le mot de passe seulement s'il est fourni
    if (password) {
      const hashedPassword = await argon2.hash(password);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
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
        userBanks: {
          some: {
            bankId: parseInt(bankId)
          }
        }
      }
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "Utilisateur non trouvé"
      });
    }

    // Supprimer d'abord les relations UserBank
    await prisma.userBank.deleteMany({
      where: {
        userId: userId
      }
    });

    // Puis supprimer l'utilisateur
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