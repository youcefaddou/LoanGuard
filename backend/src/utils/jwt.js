const jwt = require('jsonwebtoken');

// Utilitaires JWT pour LoanGuard
const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
    email: user.email
  };
  
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: '24h',
      issuer: 'loanguard-api',
      audience: 'loanguard-app'
    }
  );
};

// Vérification d'un token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'loanguard-api',
      audience: 'loanguard-app'
    });
  } catch (error) {
    throw error;
  }
};

// Décodage d'un token sans vérification (pour debug)
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};