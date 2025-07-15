const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

const generatePaymentHistory = async (loan) => {
  try {
    const payments = [];
    let currentDate = new Date(loan.startDate);
    const today = new Date();

    const loanEndDate = new Date(loan.dueDate);
    //générer les paiements jusqu'à la date la plus proche entre aujourd'hui et la fin du prêt
    const endDate = today < loanEndDate ? today : loanEndDate;

    let paymentCount = 0;

    while (currentDate <= endDate && paymentCount < loan.duration) {
      // Calcul du risque intelligent basé sur plusieurs facteurs
      const baseRisk = getSectorRisk(loan.company.sector);
      const seasonalRisk = getSeasonalRisk(currentDate, loan.company.sector);
      const progressiveRisk = getProgressiveRisk(paymentCount, loan.duration);

      // Risque total combiné
      const totalRisk = Math.min(
        baseRisk + seasonalRisk + progressiveRisk,
        0.8
      ); // Max 80%

      // Décision de retard basée sur le risque calculé
      const isLate = Math.random() < totalRisk;
      const daysDelay = isLate ? Math.floor(Math.random() * 15) + 1 : 0; // jusqu'à 15 jours
      const paymentDate = new Date(currentDate);
      paymentDate.setDate(paymentDate.getDate() + daysDelay);

      payments.push({
        loanId: loan.id,
        amount: loan.monthlyPayment,
        date: paymentDate,
        status: isLate ? "LATE" : "ON_TIME",
      });

      //avancer d'un mois
      currentDate.setMonth(currentDate.getMonth() + 1);
      paymentCount++;
    }
    if (payments.length > 0) {
      await prisma.payment.createMany({
        data: payments,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la génération paiements:", error);
  }
};

// fonctions pour calcul de risque intelligent
function getSectorRisk(sector) {
  const sectorRisks = {
    "Culture de céréales": 0.35, //+ risqué
    "Culture de la vigne": 0.4, //très sensible météo
    "Construction maisons individuelles": 0.25, //moyennement risqué
    "Restauration traditionnelle": 0.3, //risque moyen-élevé
    "Commerce alimentaire": 0.15, //moins risqué
  };

  return sectorRisks[sector] || 0.2; //Défaut 20%
}

// risque saisonnier selon le secteur et la période
function getSeasonalRisk(currentDate, sector) {
  const month = currentDate.getMonth() + 1;

  // secteurs agricoles : difficultés en hiver et été extrême
  if (sector === "Culture de céréales" || sector === "Culture de la vigne") {
    if (month >= 12 || month <= 2) return 0.15;
    if (month >= 7 && month <= 8) return 0.1;
    return 0.05; // Autres mois
  }

  // BTP : difficultés en hiver
  if (sector === "Construction maisons individuelles") {
    if (month >= 12 || month <= 2) return 0.1;
    return 0.02;
  }

  // restauration : difficultés en été (vacances) et janvier (après fêtes)
  if (sector === "Restauration traditionnelle") {
    if (month === 1 || month === 8) return 0.08;
    return 0.02;
  }

  return 0.02; // risque saisonnier minimal pour autres secteurs
}

// risque progressif : dégradation dans le temps pour certains prêts
function getProgressiveRisk(paymentCount, totalDuration) {
  const progressRatio = paymentCount / totalDuration;

  // 20% des prêts se dégradent progressivement
  if (Math.random() < 0.2) {
    return progressRatio * 0.15; // Augmentation progressive jusqu'à 15%
  }

  // 10% des prêts s'améliorent avec le temps
  if (Math.random() < 0.1) {
    return Math.max(0.05 - progressRatio * 0.05, 0); // diminution progressive
  }

  return 0; // pas de changement pour la majorité
}

module.exports = { generatePaymentHistory };
