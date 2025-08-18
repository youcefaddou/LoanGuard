const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function createTestALerts() {
  try {
    //récuperer quelques prets existants
    const loans = await prisma.loan.findMany({
      take: 3,
      include: {
        company: true,
      },
    });

    if (loans.length === 0) {
      console.log("Aucun pret trouvé");
      return;
    }
    //créer alertes de test
    const alertsToCreate = [
      {
        loanId: loans[0].id,
        type: "retard",
        message: "Retard de paiement détecté",
      },
      {
        loanId: loans[0].id,
        type: "info",
        message: "Score de risque mis à jour",
      },
      {
        loanId: loans.length > 1 ? loans[1].id : loans[0].id,
        type: "success",
        message: "Paiement reçu avec succès",
      },
    ];

    if (loans.length > 2) {
      alertsToCreate.push({
        loanId: loans[2].id,
        type: "warning",
        message: "Surveillance accrue recommandée",
      });
    }

    // Insérer les alertes
    for (const alertData of alertsToCreate) {
      const alert = await prisma.alert.create({
        data: {
          ...alertData,
          date: new Date(),
        },
      });
      console.log(
        `Alerte créée: ${alert.message} pour le prêt ${alert.loanId}`
      );
    }

    console.log("Alertes de test créées avec succès !");
  } catch (error) {
    console.error("Erreur lors de la création des alertes de test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestALerts();
