import { getSectorDescription, formatAddress, formatSiret } from "../utils/formatters";

const CompanyInfo = ({ company }) => {

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full">
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
