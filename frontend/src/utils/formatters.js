// Fonctions utilitaires de formatage pour LoanGuard

// Formatage des montants
export const formatAmount = (amount) => {
  if (!amount) return "0€";

  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(0)}K`;
  } else {
    return `€${amount.toLocaleString()}`;
  }
};

// Formatage des montants compacts pour responsive (utilisé dans LoanItem)
export const formatAmountCompact = (amount) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M €`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K €`;
  }
  return `${amount} €`;
};

// Formatage des montants exacts (sans centimes)
export const formatExactAmount = (amount) => {
  if (!amount) return "€0";
  return `€${Math.round(amount).toLocaleString()}`;
};

// Formatage des dates au format français
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Formatage des pourcentages
export const formatPercentage = (percentage) => {
  if (!percentage) return "0%";
  return `${percentage}%`;
};

// Formatage du SIRET/SIREN avec espaces
export const formatSiret = (siret) => {
  if (!siret) return "Non spécifié";
  
  // Formatage avec espaces pour la lisibilité (XXX XXX XXX XXXXX)
  const cleaned = siret.toString().replace(/\s/g, '');
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
  } else if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  return cleaned;
};

// Fonction pour obtenir la description du secteur NAF
export const getSectorDescription = (nafCode) => {
  const sectorsMap = {
    '01.11Z': 'Culture de céréales',
    '01.21Z': 'Culture de la vigne',
    '41.20A': 'Construction maisons individuelles',
    '56.10A': 'Restauration traditionnelle',
    '47.11A': 'Commerce alimentaire'
  };
  
  return sectorsMap[nafCode] || nafCode;
};

// Fonction pour formater l'adresse complète
export const formatAddress = (company) => {
  if (!company) return "Non spécifiée";
  
  const parts = [];
  if (company.address) parts.push(company.address);
  if (company.postalCode) parts.push(company.postalCode);
  if (company.city) parts.push(company.city);
  if (company.region) parts.push(company.region);
  
  return parts.length > 0 ? parts.join(", ") : "Non spécifiée";
};
