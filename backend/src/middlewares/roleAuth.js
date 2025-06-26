//middleware de contrôle des permissions par role 
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      //verifier que l'utilisateur est authentifié
      if (!req.user || !req.user.role) {
        return res.status(401).json({ 
          message: 'Authentification requise' 
        })
      }
      
      //verification du role autorisé
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'Accès refusé. Permissions insuffisantes' 
        })
      }
      
      next()
      
    } catch (error) {
      console.error('Erreur vérification rôle:', error)
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la vérification des permissions' 
      })
    }
  }
}

// Middleware spécifiques pour LoanGuard
const requireResponsable = checkRole('RES')
const requireChargeRisques = checkRole('CHG', 'RES')
const requireAnyUser = checkRole('CHG', 'RES')

module.exports = {
  checkRole,
  requireResponsable,
  requireChargeRisques,
  requireAnyUser
}
