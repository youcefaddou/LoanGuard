const { PrismaClient } = require("../generated/prisma");
const { generatePaymentHistory } = require("../src/utils/generatePayments");

const prisma = new PrismaClient();

// CONFIGURATION POUR ENVIRONNEMENT LOCAL (génération massive)
const LOCAL_CONFIG = {
  MAX_LOANS_TOTAL: 2000, // 2000 prêts en local !
  BATCH_SIZE: 100, // Lots de 100 (pas de limite locale)
  DELAY_BETWEEN_BATCHES: 0, // Pas de pause nécessaire
  MAX_PAYMENTS_PER_LOAN: 120, // Historique complet
};

// Fonction utilitaire pour générer un nombre aléatoire
const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Fonction utilitaire pour générer une date aléatoire dans le passé
const randomPastDate = (monthsAgo) => {
  const now = new Date();
  const pastDate = new Date(
    now.getTime() - monthsAgo * 30 * 24 * 60 * 60 * 1000
  );
  return pastDate;
};

// Pause pour éviter surcharge VPS
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Générer des paramètres de prêt réalistes mais RÉDUITS
const generateLoanParams = (companySector) => {
  // Montants RÉDUITS pour VPS limité
  let minAmount = 5000;
  let maxAmount = 100000; // Réduit de 500K à 100K
  let minDuration = 6;
  let maxDuration = 36; // Réduit de 84 à 36 mois
  let baseRate = 3.5;

  // Ajustements selon le secteur d'activité (réduits)
  switch (companySector) {
    case "01.11Z": // Culture de céréales
    case "01.21Z": // Culture de la vigne
      minAmount = 20000;
      maxAmount = 150000; // Réduit
      maxDuration = 48;
      baseRate = 3.8;
      break;
    case "41.20A": // Construction maisons individuelles
      minAmount = 30000;
      maxAmount = 200000; // Très réduit
      maxDuration = 60;
      baseRate = 4.2;
      break;
    case "56.10A": // Restauration traditionnelle
      minAmount = 10000;
      maxAmount = 80000; // Réduit
      maxDuration = 24;
      baseRate = 4.5;
      break;
    default:
      // Valeurs par défaut conservatrices
      break;
  }

  return {
    amount: randomBetween(minAmount, maxAmount),
    duration: randomBetween(minDuration, maxDuration),
    interestRate: baseRate + (Math.random() * 2 - 1), // +/- 1%
  };
};

// Calculer la mensualité (EXACTEMENT comme dans loanController)
const calculateMonthlyPayment = (amount, annualRate, durationMonths) => {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
    (Math.pow(1 + monthlyRate, durationMonths) - 1);
  return Math.round(monthlyPayment * 100) / 100;
};

// Calculer la date d'échéance (EXACTEMENT comme dans loanController)
const calculateDueDate = (startDate, durationMonths) => {
  const dueDate = new Date(startDate);
  dueDate.setMonth(dueDate.getMonth() + durationMonths);
  return dueDate;
};

const generateLoans = async () => {
  console.log("GENERATION LOCALE MASSIVE POUR ENTRAINEMENT IA");
  console.log(
    `Configuration: ${LOCAL_CONFIG.MAX_LOANS_TOTAL} prêts max, lots de ${LOCAL_CONFIG.BATCH_SIZE}`
  );

  try {
    // Vérification préalable de sécurité
    const existingLoans = await prisma.loan.count();
    console.log(`Prêts existants: ${existingLoans}`);

    // Pas de limite en local - on peut générer massivement

    // Récupérer les entreprises
    const companies = await prisma.company.findMany({
      include: { bank: true },
      // Pas de TAKE - on prend toutes les entreprises
    });

    console.log(`${companies.length} entreprises sélectionnées`);

    let totalLoansCreated = 0;
    let batchCount = 0;

    // Traitement par BATCH rapide
    for (
      let i = 0;
      i < companies.length && totalLoansCreated < LOCAL_CONFIG.MAX_LOANS_TOTAL;
      i += LOCAL_CONFIG.BATCH_SIZE
    ) {
      batchCount++;
      const batch = companies.slice(i, i + LOCAL_CONFIG.BATCH_SIZE);

      console.log(`\nLot ${batchCount} - ${batch.length} entreprises`);

      // Pas de pause en local - performance maximale

      for (const company of batch) {
        if (totalLoansCreated >= LOCAL_CONFIG.MAX_LOANS_TOTAL) {
          console.log(`Limite atteinte: ${LOCAL_CONFIG.MAX_LOANS_TOTAL} prêts`);
          break;
        }

        try {
          // Chaque entreprise peut avoir 2-4 prêts en local
          const numberOfLoans = randomBetween(2, 4);

          for (let loanIndex = 0; loanIndex < numberOfLoans; loanIndex++) {
            if (totalLoansCreated >= LOCAL_CONFIG.MAX_LOANS_TOTAL) break;

            const params = generateLoanParams(company.sector);

            // Date de début récente (1-24 mois dans le passé pour plus de variété)
            const startDate = randomPastDate(randomBetween(1, 24));

            // Calculs
            const monthlyPayment = calculateMonthlyPayment(
              params.amount,
              params.interestRate,
              params.duration
            );
            const dueDate = calculateDueDate(startDate, params.duration);

            // Statut varié (90% Actif, 5% En attente, 5% Suspendu)
            const statusRandom = Math.random();
            let status = "Actif";
            if (statusRandom > 0.95) status = "Suspendu";
            else if (statusRandom > 0.9) status = "En attente";

            // Utilisateur de la banque
            const bankUsers = await prisma.userBank.findMany({
              where: { bankId: company.bankId },
              include: { user: true },
            });

            if (bankUsers.length === 0) {
              console.log(`Pas d'utilisateur pour ${company.bank.name}`);
              continue;
            }

            const randomUser =
              bankUsers[randomBetween(0, bankUsers.length - 1)];

            // Créer le prêt
            const loan = await prisma.loan.create({
              data: {
                userId: randomUser.userId,
                bankId: company.bankId,
                companyId: company.id,
                amount: parseFloat(params.amount),
                status: status,
                startDate: startDate,
                dueDate: dueDate,
                duration: parseInt(params.duration),
                interestRate: parseFloat(params.interestRate),
                monthlyPayment: monthlyPayment,
              },
              include: {
                company: true,
                user: true,
                bank: true,
              },
            });

            // GENERATION COMPLETE des paiements en local
            if (params.duration <= LOCAL_CONFIG.MAX_PAYMENTS_PER_LOAN) {
              await generatePaymentHistory(loan);
            }

            // Alerte simple
            await prisma.alert.create({
              data: {
                loanId: loan.id,
                type: "info",
                message: `Nouveau prêt: ${
                  loan.company.name
                } - ${loan.amount.toLocaleString("fr-FR")}€`,
                date: new Date(),
              },
            });

            totalLoansCreated++;

            if (totalLoansCreated % 50 === 0) {
              console.log(`${totalLoansCreated} prêts créés...`);
            }
          }
        } catch (error) {
          console.error(`Erreur pour ${company.name}:`, error.message);
        }
      }
    }

    console.log(
      `\nTERMINE! ${totalLoansCreated} prêts créés en local pour entraînement IA`
    );

    // Stats détaillées pour l'entraînement
    const finalStats = await prisma.loan.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    console.log(`\nRépartition par statut (pour entraînement):`);
    for (const stat of finalStats) {
      console.log(`  ${stat.status}: ${stat._count.id} prêts`);
    }

    // Recommandation pour l'entraînement
    console.log(`\n=== NEXT STEPS POUR ENTRAINEMENT LOCAL ===`);
    console.log(
      `1. Lancez l'entraînement: node -e "const model = require('./src/services/riskPredictionModel'); model.trainModel().then(() => console.log('Terminé!'))"`
    );
    console.log(`2. Le modèle sera sauvé dans: ai_models/`);
    console.log(`3. Copiez le modèle vers la production`);
    console.log(`4. Redémarrez l'API en production`);
  } catch (error) {
    console.error("Erreur lors de la génération locale:", error.message);
  } finally {
    await prisma.$disconnect();
  }
};

console.log("SCRIPT DE GENERATION LOCALE MASSIVE POUR ENTRAINEMENT IA");
console.log("Paramètres optimisés pour machine locale:");
console.log(`   - Maximum: ${LOCAL_CONFIG.MAX_LOANS_TOTAL} prêts`);
console.log(`   - Lots de: ${LOCAL_CONFIG.BATCH_SIZE} entreprises`);
console.log(`   - Pas de pause (performance max)`);
console.log(
  `   - Historique complet: ${LOCAL_CONFIG.MAX_PAYMENTS_PER_LOAN} mois max`
);
console.log(`   - 2-4 prêts par entreprise`);
console.log("");

generateLoans();
