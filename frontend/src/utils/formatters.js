// utilitaires pour le formatage des données financières

export const formatAmount = (amount) => {
  if (!amount) return "€0";

  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(0)}K`;
  } else {
    return `€${amount.toLocaleString()}`;
  }
};

// formate un pourcentage
export const formatPercentage = (rate) => {
  if (!rate) return "0%";
  return `${(rate * 100).toFixed(1)}%`;
};

//formate une date au format français
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString('fr-FR');
};

// formate un numéro SIRET
export const formatSiret = (siret) => {
  if (!siret) return "";
  return siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, "$1 $2 $3 $4");
};
