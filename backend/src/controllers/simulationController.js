const riskCalculationService = require("../services/riskCalculationService");
const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

exports.runSimulation = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { eventType, parameters } = req.body;

    if (!loanId || !eventType || !parameters) {
      return res.status(400).json({
        message: "ID de prêt, type d'événement et paramètres requis",
      });
    }
    const loan = await prisma.loan.findUnique({
      where: { id: parseInt(loanId) },
      include: {
        company: true,
        payments: true,
        user: true,
      },
    });
    if (!loan) {
      return res.status(404).json({ message: "Prêt non trouvé" });
    }
    //calculer l'impact de l'event
    const impact = calculateEventImpact(
      eventType,
      parameters,
      loan.company.sector
    );

    //sauvegarder la simulation
    const simulation = await prisma.simulation.create({
      data: {
        loanId: loan.id,
        eventType,
        parameters: JSON.stringify(parameters),
        impact,
      },
    });
    //calculer le nouveau score avec impact
    const currentResult = await riskCalculationService.calculateRiskScore(
      loanId
    );
    const newScore = Math.min(currentResult.data.score + impact, 10);

    let newRiskLevel = "Faible";
    if (newScore > 7) newRiskLevel = "Élevé";
    else if (newScore > 4) newRiskLevel = "Moyen";

    res.json({
      message: "Simulation réussie",
      simulation,
      impact: {
        before: currentResult.data.score,
        after: newScore,
        change: impact,
        newRiskLevel,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la simulation:", error);
    res.status(500).json({ message: "Erreur lors de la simulation" });
  }
};

exports.getSimulationHistory = async (req, res) => {
  try {
    const { loanId } = req.params;
    const simulations = await prisma.simulation.findMany({
      where: { loanId: parseInt(loanId) },
      orderBy: { createdAt: "desc" },
    });
    res.json({
      message: "Historique des simulations récupéré",
      simulations,
    });
  } catch (error) {
    console.error(
      "Erreur récupération de l'historique des simulations:",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération de l'historique des simulations",
    });
  }
};

function calculateEventImpact(eventType, parameters, sector) {
  let impact = 0;

  switch (eventType) {
    case "weather":
      if (
        parameters.type === "canicule" &&
        (sector.includes("Culture") || sector.includes("Construction"))
      ) {
        impact = parameters.intensity * 1.5;
      } else if (parameters.type === "inondation") {
        impact = parameters.intensity * 1.2;
      }
      break;

    case "economic":
      if (parameters.type === "recession_sectorielle") {
        impact = parameters.severity * 2.0;
      }
      break;

    case "regulatory":
      impact = parameters.impact * 0.8;
      break;

    default:
      impact = 0.5;
  }
  return Math.min(impact, 3) // Limiter l'impact à 3 points
}
