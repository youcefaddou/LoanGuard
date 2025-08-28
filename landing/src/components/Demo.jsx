
import DemoAnimated from "./DemoAnimated";

const demoScreens = [
  {
    image: "/images/demo/dashboard.webp",
    title: "Dashboard de Risque",
    desc: "Vue d'ensemble en temps réel des risques de crédit et alertes importantes.",
  },
  {
    image: "/images/demo/loans.webp",
    title: "Gestion des Prêts",
    desc: "Suivi complet du portefeuille de prêts avec analyse prédictive.",
  },
  {
    image: "/images/demo/risk.webp",
    title: "Analyse de Risque",
    desc: "Algorithmes IA pour évaluer et prédire les risques de défaillance.",
  },
  {
    image: "/images/demo/simulation.webp",
    title: "Simulations",
    desc: "Modélisation de scénarios pour anticiper les impacts financiers.",
  },
];

export default function Demo() {
  return <DemoAnimated demoScreens={demoScreens} />;
}


