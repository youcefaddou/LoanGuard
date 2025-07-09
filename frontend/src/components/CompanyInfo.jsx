const CompanyInfo = ({ company }) => {
  // Fonction pour obtenir la description du secteur NAF
  const getSectorDescription = (nafCode) => {
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
  const formatAddress = (company) => {
    if (!company) return "Non spécifiée";
    
    const parts = [];
    if (company.address) parts.push(company.address);
    if (company.postalCode) parts.push(company.postalCode);
    if (company.city) parts.push(company.city);
    if (company.region) parts.push(company.region);
    
    return parts.length > 0 ? parts.join(", ") : "Non spécifiée";
  };

  // Fonction pour formater le SIRET/SIREN
  const formatSiret = (siret) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">
        Informations entreprise
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Nom</span>
          <span className="font-medium">
            {company?.name || "Non spécifié"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Secteur</span>
          <span className="font-medium">
            {company?.sector ? getSectorDescription(company.sector) : "Non spécifié"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Localisation</span>
          <span className="font-medium text-xs text-right">
            {formatAddress(company)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">SIRET</span>
          <span className="font-medium font-mono text-xs">
            {formatSiret(company?.siret)}
          </span>
        </div>
        {/* Informations supplémentaires si disponibles */}
        {company?.activityCode && (
          <div className="flex justify-between">
            <span className="text-gray-600">Code NAF</span>
            <span className="font-medium font-mono text-xs">
              {company.activityCode}
            </span>
          </div>
        )}
        {company?.legalForm && (
          <div className="flex justify-between">
            <span className="text-gray-600">Forme juridique</span>
            <span className="font-medium">
              {company.legalForm}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInfo;
