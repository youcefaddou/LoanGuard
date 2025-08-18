const app = require('./app');
const { updateAllPayments } = require('./utils/updateAllPayments');
const PORT = process.env.PORT;

// Fonction pour initialiser l'application
const startServer = async () => {
  try {
    // Mettre à jour les paiements au démarrage
    console.log('Mise à jour des paiements en cours...');
    const result = await updateAllPayments();
    
    if (result.success) {
      console.log(`${result.totalUpdated} nouveaux paiements ajoutés pour ${result.loansProcessed} prêts`);
    } else {
      console.log('Erreur lors de la mise à jour des paiements:', result.error);
    }
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`Backend LoanGuard actif sur http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Lancer le serveur
startServer();

