import React from "react";
import "./CultureItem.css";
import { generateCultureFicheTxt } from "./../TheFiles";

const CultureItem = ({
  image,
  culture_id,
  nom_culture,
  region,
  saison,
  conseil,
  besoin_eau,
  production,
  description,
  type

}) => {
  return (
    <div className="culture-item">
      <div className="culture-image-container">
        <img src={image} alt={`Image de ${nom_culture}`} className="culture-image" />
        <div className="culture-buttons">
        <button
          className="culture-button download"
          title={`Télécharger les infos de ${nom_culture}`}
          onClick={() => generateCultureFicheTxt({
            nom_culture,
            region,
            saison,
            conseil,
            besoin_eau,
            production,
            description,
            type
          })}
        >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="culture-info">
        <h3 className="culture-name">{nom_culture}</h3>
        <p className="culture-description">
          <strong>Besoins en eau : {besoin_eau}</strong><br />
          Cultivée en région {region}, idéale en {saison}.<br />
          {conseil}
        </p>
        <p className="culture-production">Production annuelle : {production} tonnes/ha/Ans</p>
      </div>
    </div>
  );
};

export default CultureItem;
