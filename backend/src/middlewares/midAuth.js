const jwt = require('jsonwebtoken');

// middleware d'authentification JWT avec cookies httpOnly
const authMiddleware = function (req, res, next) {
  try {
    // recupération du token depuis les cookies
    const token = req.cookies.authToken;
    
    if (!token) {
      return res.status(401).json({ 
        message: "Token d'authentification manquant"
      });
    }
    
    // Vérification et décodage du token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // validation des données du token
    if (!decoded.id || !decoded.role || !decoded.email) {
      return res.status(401).json({ 
        message: 'Token invalide - données manquantes' 
      });
    }
    
    // Ajout des infos utilisateur à la requête
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };
    
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expiré. Veuillez vous reconnecter' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token invalide' 
      });
    }
    
    console.error('Erreur middleware auth:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de l\'authentification' 
    });
  }
};

module.exports = authMiddleware;
