const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

exports.createLoan = async (req, res) => {
  try {
    const {
      companyId,
      amount,
      interestRate,
      duration,
      startDate,
      status = "Actif",
    } = req.body;

    if (!companyId || !amount || !interestRate || !duration || !startDate) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    //calcul date d'échéance
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + duration);
    //calcul mensualité
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
      (Math.pow(1 + monthlyRate, duration) - 1);

    const newLoan = await prisma.loan.create({
      data: {
        userId: req.user.id,
        bankId: req.user.bankId,
        companyId: parseInt(companyId),
        amount: parseFloat(amount),
        interestRate: parseFloat(interestRate),
        duration: parseInt(duration),
        startDate: new Date(startDate),
        dueDate,
        status,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        riskLevel: null,
      },
      include: {
        company: true,
        user: true,
        bank: true,
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
    const companies = await prisma.company.findMany({
      where: {
        bankId: req.user.bankId,
      },
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
