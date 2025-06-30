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
    
    //Verification que le compte n'est pas désactivé
    if (user.isActive === false) {
      return res.status(403).json({ message: 'Compte désactivé. Contactez l\'administrateur'});
    }

    // Succès - Reset rate limiting
    recordAttempt(sanitizedEmail, true);

    // recupération des agences associées à l'utilisateur (si RES)
    let userBanks = [];
    if (user.role === 'RES') {
      userBanks = await prisma.userBank.findMany({
        where: { userId: user.id },
        include: { 
          bank: true
        }
      });
    }

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

    // Logique de redirection selon le nombre d'agences
    if (user.role === 'RES' && userBanks.length > 1) {
      // Conversion des agences pour la réponse
      const banksForResponse = [];
      for (let i = 0; i < userBanks.length; i++) {
        banksForResponse.push({
          id: userBanks[i].bank.id,
          name: userBanks[i].bank.name,
          address: userBanks[i].bank.address,
          city: userBanks[i].bank.city
        });
      }
      
      // RES avec plusieurs agences -> sélection obligatoire
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
    } else if (user.role === 'RES' && userBanks.length === 1) {
      // RES avec une seule agence -> accès direct
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
      // CHG ou RES sans agence -> accès direct dashboard
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
