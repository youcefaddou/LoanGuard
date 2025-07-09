const { PrismaClient } = require('../../generated/prisma');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/
const AUTHORIZED_ROLES = ['RES', 'CHG']

// rate limiting (protection contre les attaques brute force)
const loginAttempts = new Map()
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

// fonction utilitaire pour vérifier le rate limiting
const checkRateLimit = (email) => {
  const attempts = loginAttempts.get(email);
  
  if (attempts && attempts.count >= MAX_ATTEMPTS) {
    const timeLeft = attempts.lastAttempt + LOCKOUT_TIME - Date.now();
    if (timeLeft > 0) {
      return { blocked: true, minutes: Math.ceil(timeLeft / 60000) };
    } else {
      loginAttempts.delete(email);
    }
  }
  
  return { blocked: false };
};

// fonction utilitaire pour enregistrer les tentatives
const recordAttempt = (email, success) => {
  if (success) {
    loginAttempts.delete(email);
  } else {
    const current = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    current.count++;
    current.lastAttempt = Date.now();
    loginAttempts.set(email, current);
  }
};

// Connexion utilisateur 
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    // Validation stricte des données d'entrée
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, mot de passe et rôle sont obligatoires'});
    }

    // Validation format email avec regex
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Format email invalide'});
    }

    // validation role autorisé
    if (!AUTHORIZED_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Rôle non autorisé'});
    }

    // sanitisation des données
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedRole = role.toUpperCase().trim();

    // Vérification rate limiting (protection brute force)
    const rateLimitCheck = checkRateLimit(sanitizedEmail);
    if (rateLimitCheck.blocked) {
      return res.status(429).json({ 
        message: `Trop de tentatives. Réessayez dans ${rateLimitCheck.minutes} minutes.`
      });
    }

    // Recherche user avec prisma
    const user = await prisma.user.findFirst({
      where: { 
        email: sanitizedEmail,
        role: sanitizedRole 
      }
    });
    
    if (!user) {
      recordAttempt(sanitizedEmail, false);
      return res.status(401).json({ 
        message: 'Identifiants incorrects'});
    }
    
    // verif mot de passe avec argon2 
    const isPasswordValid = await argon2.verify(
      user.password, 
      password
    );
    
    if (!isPasswordValid) {
      recordAttempt(sanitizedEmail, false);
      return res.status(401).json({ message: 'Identifiants incorrects'});
    }

    // Succès - Reset rate limiting
    recordAttempt(sanitizedEmail, true);

    // Génération token JWT sécurisé (8h au lieu de 24h pour sécurité)
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Cookie httpOnly sécurisé (Protection XSS)
    res.cookie('authToken', token, {
      httpOnly: true,                          // Pas accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS en production
      sameSite: 'strict',                      // Protection CSRF
      maxAge: 8 * 60 * 60 * 1000              // 8 heures
    });

    // Logique de redirection selon le rôle
    if (user.role === 'CHG') {
      // CHG : doit avoir exactement une banque
      const userBanks = await prisma.userBank.findMany({
        where: { userId: user.id },
        include: { bank: true }
      });

      if (userBanks.length === 0) {
        return res.status(403).json({ 
          message: 'Aucune agence assignée à ce chargé de risques. Contactez l\'administrateur'
        });
      }

      if (userBanks.length > 1) {
        return res.status(403).json({ 
          message: 'Erreur configuration : un chargé de risques ne peut être assigné qu\'à une seule agence'
        });
      }

      // CHG avec une banque -> accès direct
      res.json({
        message: 'Connexion réussie',
        user: {
          id: user.id,
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email,
          role: user.role
        },
        requiresBankSelection: false,
        selectedBank: {
          id: userBanks[0].bank.id,
          name: userBanks[0].bank.name,
          address: userBanks[0].bank.address,
          city: userBanks[0].bank.city
        }
      });

    } else if (user.role === 'RES') {
      // RES : peut avoir une ou plusieurs banques
      const userBanks = await prisma.userBank.findMany({
        where: { userId: user.id },
        include: { bank: true }
      });

      if (userBanks.length === 0) {
        return res.status(403).json({ 
          message: 'Aucune agence assignée à ce responsable. Contactez l\'administrateur'
        });
      }

      if (userBanks.length === 1) {
        // RES avec une seule banque -> accès direct
        res.json({
          message: 'Connexion réussie',
          user: {
            id: user.id,
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            role: user.role
          },
          requiresBankSelection: false,
          selectedBank: {
            id: userBanks[0].bank.id,
            name: userBanks[0].bank.name,
            address: userBanks[0].bank.address,
            city: userBanks[0].bank.city
          }
        });
      } else {
        // RES avec plusieurs banques -> sélection obligatoire
        const banksForResponse = userBanks.map(ub => ({
          id: ub.bank.id,
          name: ub.bank.name,
          address: ub.bank.address,
          city: ub.bank.city
        }));

        res.json({
          message: 'Connexion réussie',
          user: {
            id: user.id,
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            role: user.role
          },
          requiresBankSelection: true,
          banks: banksForResponse
        });
      }

    } else {
      // ADM ou autres rôles -> accès direct dashboard
      res.json({
        message: 'Connexion réussie',
        user: {
          id: user.id,
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email,
          role: user.role
        },
        requiresBankSelection: false
      });
    }
    
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion'});
  }
};

// Sélection de banque après connexion (pour RES avec plusieurs agences)
exports.selectBank = async (req, res) => {
  const { bankId } = req.body;
  const userId = req.user.id; // Vient du middleware d'authentification
  const userRole = req.user.role; // Vient du middleware d'authentification
  
  try {
    // Validation des données d'entrée
    if (!bankId) {
      return res.status(400).json({ message: 'ID de banque obligatoire' });
    }

    // Vérification que seul un RES peut sélectionner une banque
    if (userRole !== 'RES') {
      return res.status(403).json({ 
        message: 'Seul un responsable peut sélectionner une agence' 
      });
    }

    // Vérification que l'utilisateur a bien accès à cette banque
    const userBank = await prisma.userBank.findFirst({
      where: { 
        userId: userId,
        bankId: parseInt(bankId)
      },
      include: { 
        bank: true
      }
    });

    if (!userBank) {
      return res.status(403).json({ 
        message: 'Accès non autorisé à cette agence'
      });
    }

    // Retour des informations de la banque sélectionnée
    res.json({
      message: 'Banque sélectionnée avec succès',
      selectedBank: {
        id: userBank.bank.id,
        name: userBank.bank.name,
        address: userBank.bank.address,
        city: userBank.bank.city
      }
    });
    
  } catch (error) {
    console.error('Erreur sélection banque:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la sélection de banque' });
  }
};

//Déconnexion utilisateur
exports.logout = async (req, res) => {
  try {
    // Suppression du cookie httpOnly sécurisé
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({ message: 'Déconnexion réussie'});
    
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    res.status(500).json({ message: 'Erreur lors de la déconnexion'});
  }
};
