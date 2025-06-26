const { PrismaClient } = require('../../generated/prisma');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Regex pour validation sécurisée
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const AUTHORIZED_ROLES = ['RES', 'CHG'];

// Connexion utilisateur 
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    // Validation stricte des données d'entrée
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, mot de passe et rôle sont obligatoires'})
    }

    // Validation format email avec regex
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Format email invalide'})
    }

    // validation role autorisé
    if (!AUTHORIZED_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Rôle non autorisé'})
    }

    // sanitisation des données
    const sanitizedEmail = email.toLowerCase().trim()
    const sanitizedRole = role.toUpperCase().trim()

    // Recherche utilisateur avec Prisma
    const user = await prisma.user.findFirst({
      where: { 
        email: sanitizedEmail,
        role: sanitizedRole 
      }
    })
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Identifiants incorrects'})
    }
    
    // Vérification mot de passe avec Argon2 
    const isPasswordValid = await argon2.verify(
      user.password, 
      password
    )
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants incorrects'})
    }
    
    // Vérification que le compte n'est pas désactivé
    if (user.isActive === false) {
      return res.status(403).json({ message: 'Compte désactivé. Contactez l\'administrateur'})
    }

    // Génération token JWT sécurisé
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Réponse JSON avec token et informations utilisateur
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('Erreur connexion:', error)
    res.status(500).json({ message: 'Erreur serveur lors de la connexion'})
  }
}

//Déconnexion utilisateur
exports.logout = async (req, res) => {
  try {
    // Pour JWT, la déconnexion se fait côté client en supprimant le token
    res.json({ message: 'Déconnexion réussie'})
    
  } catch (error) {
    console.error('Erreur déconnexion:', error)
    res.status(500).json({ message: 'Erreur lors de la déconnexion'})
  }
}