const prisma = require('../../prisma/client'); // adapter selon chemin
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: { email, role }
    });
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });
    // je veux utiliser argon2 pour le hachage des mots de passe
    // const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });
    // Générer un token JWT 
    return res.json({ message: 'Connexion réussie', user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};