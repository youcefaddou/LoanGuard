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
    //Récupérer le score de risque de référence (premier score ou score par défaut)
    const baseRiskScore = await prisma.riskScore.findFirst({
      where: { loanId: loan.id },
      orderBy: { date: "asc" }, // Premier score créé
    });

    // Utiliser le premier score comme référence, ou 5.0 par défaut
    const baseScore = baseRiskScore ? baseRiskScore.score : 5.0;

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

    // Créer un RiskScore avec le résultat de la simulation
    const scoreAfter = Math.min(10, Math.max(0, baseScore + impact));
    const newRiskLevel = scoreAfter >= 8 ? "Élevé" : scoreAfter >= 6 ? "Moyen" : "Faible";
    
    await prisma.riskScore.create({
      data: {
        loanId: loan.id,
        score: scoreAfter,
        riskLevel: newRiskLevel,
        date: new Date(),
        weatherFactor: 0.5,
        sectorFactor: 0.3,
        externalFactors: JSON.stringify({ simulationImpact: impact }),
      },
    });

    res.json({
      message: "Simulation réussie",
      simulation,
      impact: {
        before: baseScore,
        after: scoreAfter,
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
      if (parameters.type === "canicule") {
        if (sector.includes("Culture") || sector.includes("Construction")) {
          impact = parameters.intensity * 1.5;
        } else {
          impact = parameters.intensity * 0.8;
        }
      } else if (parameters.type === "inondation") {
        impact = parameters.intensity * 1.2;
      } else if (parameters.type === "gel") {
        if (sector.includes("Commerce alimentaire") || sector.includes("Culture")) {
          // Le gel affecte particulièrement l'alimentaire et l'agriculture
          impact = parameters.intensity * 1.8;
        } else {
          impact = parameters.intensity * 0.6;
        }
      }
      
      // Permettre des impacts négatifs pour conditions favorables (intensité très faible)
      if (parameters.intensity < 0.5) {
        impact = -0.5; // Conditions favorables réduisent le risque
      }
      break;

    case "economic":
      if (parameters.type === "recession_sectorielle") {
        impact = parameters.severity * 2.0;
      } else if (parameters.type === "hausse_taux") {
        impact = parameters.severity * 1.5;
      }
      
      // Permettre des impacts négatifs pour conditions économiques favorables
      if (parameters.severity < 0.7) {
        impact = -0.3; // Conditions économiques favorables
      }
      break;

    case "regulatory":
      if (parameters.type === "nouvelle_reglementation") {
        impact = parameters.severity * 1.5; 
      } else if (parameters.type === "changement_fiscal") {
        impact = parameters.severity * 2.0; 
      } else if (parameters.type === "reforme_bancaire") {
        impact = parameters.severity * 2.5; 
      }
      
      // Permettre des impacts négatifs pour réglementations favorables
      if (parameters.severity < 0.7) {
        impact = -0.2; // Réglementation favorable
      }
      break;

    default:
      impact = 0.5;
  }
  
  // Permettre des impacts négatifs mais limiter la plage
  return Math.max(-2, Math.min(impact, 3));
}
