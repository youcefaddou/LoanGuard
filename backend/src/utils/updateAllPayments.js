const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

const updateAllPayments = async () => {
  try {
    //récuperer tous les prets actifs
    const loans = await prisma.loan.findMany({
      where: {
        status: "Actif",
      },
      include: {
        company: true,
        payments: {
          orderBy: { date: "desc" },
          take: 1, //récuperer le dernier paiement
        },
      },
    });

    let totalUpdated = 0;
    for (const loan of loans) {
      const paymentsAdded = await generateMissingPayments(loan);
      totalUpdated += paymentsAdded;
    }
    console.log(
      `MAJ terminée: ${totalUpdated} paiements ajoutés pour ${loans.length} prets`
    );
    return { success: true, totalUpdated, loansProcessed: loans.length };
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paiements:", error);
    return { success: false, error: error.message };
  }
};

const generateMissingPayments = async (loan) => {
  try {
    const payments = [];
    const today = new Date();
    const loanEndDate = new Date(loan.dueDate);

    //determiner la date de départ
    let startDate;
    if (loan.payments.length > 0) {
      //si déja des paiements, partir du mois suivant le dernier paiement
      startDate = new Date(loan.payments[0].date);
      startDate.setMonth(startDate.getMonth() + 1);
    } else {
      //si aucun paiement, partir de la date de début du pret
      startDate = new Date(loan.startDate);
    }
    //générer les paiement jusqu'a aujourd'hui ou la fin du pret
    const endDate = today < loanEndDate ? today : loanEndDate;
    let currentDate = new Date(startDate);
    let paymentCount = loan.payments.length;

    if (startDate > today) {
      console.log(`Dernier paiement dans le futur, rien à ajouter`);
      return 0;
    }

    while (currentDate <= endDate && paymentCount < loan.duration) {
      //on utilise la meme logique de risque que dans generatePayments.js
      const baseRisk = getSectorRisk(loan.company.sector);
      const seasonalRisk = getSeasonalRisk(currentDate, loan.company.sector);
      const progressiveRisk = getProgressiveRisk(paymentCount, loan.duration);

      const totalRisk = Math.min(
        baseRisk + seasonalRisk + progressiveRisk,
        0.8
      );
      const isLate = Math.random() < totalRisk;
      const daysDelay = isLate ? Math.floor(Math.random() * 15) + 1 : 0;

      const paymentDate = new Date(currentDate);
      paymentDate.setDate(paymentDate.getDate() + daysDelay);
      payments.push({
        loanId: loan.id,
        amount: loan.monthlyPayment,
        date: paymentDate,
        status: isLate ? "LATE" : "ON_TIME",
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
      paymentCount++;
    }
    if (payments.length > 0) {
      await prisma.payment.createMany({
        data: payments,
      });
    }
    console.log(
      `Ajout de ${payments.length} paiements pour le pret ${loan.id}`
    );
    return payments.length;
  } catch (error) {
    console.error(`Erreur pour le pret ${loan.id}:`, error);
    return 0;
  }
};

// Copier les fonctions de risque depuis generatePayments.js
function getSectorRisk(sector) {
  const sectorRisks = {
    "Culture de céréales": 0.35,
    "Culture de la vigne": 0.4,
    "Construction maisons individuelles": 0.25,
    "Restauration traditionnelle": 0.3,
    "Commerce alimentaire": 0.15,
  };
  return sectorRisks[sector] || 0.2;
}

function getSeasonalRisk(currentDate, sector) {
  const month = currentDate.getMonth() + 1;

  if (sector === "Culture de céréales" || sector === "Culture de la vigne") {
    if (month >= 12 || month <= 2) return 0.15;
    if (month >= 7 && month <= 8) return 0.1;
    return 0.05;
  }

  if (sector === "Construction maisons individuelles") {
    if (month >= 12 || month <= 2) return 0.1;
    return 0.02;
  }

  if (sector === "Restauration traditionnelle") {
    if (month === 1 || month === 8) return 0.08;
    return 0.02;
  }

  return 0.02;
}

function getProgressiveRisk(paymentCount, totalDuration) {
  const progressRatio = paymentCount / totalDuration;

  if (Math.random() < 0.2) {
    return progressRatio * 0.15;
  }

  if (Math.random() < 0.1) {
    return Math.max(0.05 - progressRatio * 0.05, 0);
  }

  return 0;
}

module.exports = { updateAllPayments };
