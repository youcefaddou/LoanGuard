const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const { generatePaymentHistory } = require("../utils/generatePayments");

exports.createLoan = async (req, res) => {
  try {
    const {
      companyId,
      bankId,
      amount,
      interestRate,
      duration,
      startDate,
      status = "Actif",
    } = req.body;

    if (
      !companyId ||
      !bankId ||
      !amount ||
      !interestRate ||
      !duration ||
      !startDate
    ) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    //calcul date d'échéance - date du dernier paiement mensuel
    const startDateObj = new Date(startDate);
    const dueDate = new Date(startDateObj);

    // Ajouter (duration - 1) mois car le dernier paiement se fait au mois (duration - 1)
    // Par exemple: prêt de 12 mois = paiements aux mois 0, 1, 2, ..., 11
    const monthsToAdd = duration - 1;
    const years = Math.floor(monthsToAdd / 12);
    const months = monthsToAdd % 12;

    dueDate.setFullYear(startDateObj.getFullYear() + years);
    dueDate.setMonth(startDateObj.getMonth() + months);
    //calcul mensualité
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
      (Math.pow(1 + monthlyRate, duration) - 1);

    // Sécurité: Empêcher les paiements mensuels de moins de 0.06$
    const roundedMonthlyPayment = Math.round(monthlyPayment * 100) / 100;
    if (roundedMonthlyPayment < 0.06) {
      return res.status(400).json({
        message: "Le montant du paiement mensuel doit être d'au moins 0,06$",
        monthlyPayment: roundedMonthlyPayment
      });
    }

    const newLoan = await prisma.loan.create({
      data: {
        userId: req.user.id,
        bankId: parseInt(bankId),
        companyId: parseInt(companyId),
        amount: parseFloat(amount),
        interestRate: parseFloat(interestRate),
        duration: parseInt(duration),
        startDate: new Date(startDate),
        dueDate,
        status,
        monthlyPayment: roundedMonthlyPayment,
      },
      include: {
        company: true,
        user: true,
        bank: true,
      },
    });
    //générer automatiquement l'historique des paiements
    await generatePaymentHistory(newLoan);
    // Créer une alerte pour le nouveau prêt
    await prisma.alert.create({
      data: {
        loanId: newLoan.id,
        type: "info",
        message: `Nouveau prêt créé pour ${
          newLoan.company.name
        } - Montant: ${newLoan.amount.toLocaleString("fr-FR")}€`,
        date: new Date(),
      },
    });
    res.status(201).json({
      message: "Prêt créé avec succès",
      loan: newLoan,
    });
  } catch (error) {
    console.error("Erreur lors de la création du prêt:", error);
    res.status(500).json({ message: "Erreur lors de la création du prêt" });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const bankId = req.headers["x-bank-id"];

    const companies = await prisma.company.findMany({
      where: bankId ? { bankId: parseInt(bankId) } : {},
      select: {
        id: true,
        name: true,
        siret: true,
        sector: true,
      },
    });
    res.json(companies);
  } catch (error) {
    console.error("Erreur récupération des entreprises:", error);
    res.status(500).json({ message: "Erreur récupération des entreprises" });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const bankId = req.headers["x-bank-id"];

    // Correction : pour CHG, on filtre uniquement sur bankId
    let whereClause = {};
    if (bankId) {
      whereClause.bankId = parseInt(bankId);
    }
    // Si RES, on peut filtrer sur bankId ou sur userId si besoin
    const loans = await prisma.loan.findMany({
      where: whereClause,
      include: {
        company: {
          select: {
            name: true,
          },
        },
        riskScores: {
          orderBy: {
            date: "desc",
          },
          take: 1,
          select: {
            riskLevel: true,
          },
        },
      },
    });

    // Formatage des données pour l'interface
    const formattedLoans = loans.map((loan) => ({
      id: loan.id,
      companyName: loan.company.name,
      amount: loan.amount,
      dueDate: loan.dueDate,
      riskLevel:
        loan.riskScores.length > 0
          ? loan.riskScores[0].riskLevel
          : "Non évalué",
      status: loan.status,
      interestRate: loan.interestRate,
      monthlyPayment: loan.monthlyPayment,
      startDate: loan.startDate,
      duration: loan.duration,
    }));

    res.json({
      message: "Prêts récupérés avec succès",
      loans: formattedLoans,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des prêts:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des prêts" });
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await prisma.loan.findUnique({
      where: { id: parseInt(id) },
      include: {
        company: true,
        bank: true,
        payments: {
          orderBy: { date: "desc" },
        },
      },
    });
    if (!loan) {
      return res.status(404).json({ message: "Prêt non trouvé" });
    }
    res.json(loan);
  } catch (error) {
    console.error("Erreur lors de la récupération du prêt:", error);
    res.status(500).json({ message: "Erreur lors de la récupération du prêt" });
  }
};

exports.updateLoan = async (req, res) => {
  const { id } = req.params;
  const { amount, interestRate, duration, startDate, status } = req.body;
  try {
    //verifier que le prêt existe
    const existingLoan = await prisma.loan.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingLoan) {
      return res.status(404).json({ message: "Prêt non trouvé" });
    }
    const updateLoan = await prisma.loan.update({
      where: { id: parseInt(id) },
      data: {
        amount: parseFloat(amount),
        interestRate: parseFloat(interestRate),
        duration: parseInt(duration),
        startDate: new Date(startDate),
        status,
      },
      include: {
        company: true,
        payments: true,
      },
    });
    res.json({ message: "Prêt mis à jour avec succès", loan: updateLoan });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du prêt:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du prêt" });
  }
};
exports.deleteLoan = async (req, res) => {
  const { id } = req.params;
  try {
    const existingLoan = await prisma.loan.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingLoan) {
      return res.status(404).json({ message: "Prêt non trouvé" });
    }
    // Supprimer toutes les données liées au prêt
    await prisma.payment.deleteMany({
      where: { loanId: parseInt(id) },
    });
    await prisma.alert.deleteMany({
      where: { loanId: parseInt(id) },
    });
    await prisma.riskScore.deleteMany({
      where: { loanId: parseInt(id) },
    });
    await prisma.simulation.deleteMany({
      where: { loanId: parseInt(id) },
    });
    await prisma.loan.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Prêt supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du prêt:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du prêt" });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    //recuperer l'ID de la banque depuis le header
    const bankId = req.headers["x-bank-id"];
    if (!bankId) {
      return res.status(400).json({
        message: "ID de banque manquant",
      });
    }
    //récuperer les prets a surveiller avec leurs derniers scores
    const loans = await prisma.loan.findMany({
      where: {
        bankId: parseInt(bankId),
        //exclure les prets terminés
        status: { not: "COMPLETED" },
      },
      include: {
        company: true,
        riskScores: {
          orderBy: { date: "desc" },
          take: 1, //score le plus récent
        },
      },
    });
    //filtrer les prets qui ont un score de risque > 6.5
    const watchlistLoans = loans
      .filter((loan) => {
        const latestScore = loan.riskScores[0];
        return latestScore && latestScore.score > 6.5;
      })
      .sort((a, b) => {
        // Trier par score décroissant (plus risqué en premier)
        const scoreA = a.riskScores[0]?.score || 0;
        const scoreB = b.riskScores[0]?.score || 0;
        return scoreB - scoreA;
      })
      .slice(0, 6);

    //formater les données pour le front
    const formattedLoans = watchlistLoans.map((loan) => ({
      id: loan.id,
      companyName: loan.company.name,
      amount: loan.amount,
      endDate: loan.dueDate ? loan.dueDate.toISOString() : null,
      riskScore: loan.riskScores[0]?.score || 0,
      riskLevel: loan.riskScores[0]?.riskLevel || "Inconnu",
    }));
    res.json({
      message: "Liste de surveillance récupérée avec succès",
      data: formattedLoans,
    });
  } catch (error) {
    console.error("Erreur récupération watchlist:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de la liste de surveillance",
    });
  }
};
