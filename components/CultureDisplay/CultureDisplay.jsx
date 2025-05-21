import React from "react";
import "./CultureDisplay.css";
import CultureItem from "../../components/CultureItem/CultureItem";
import { cultureDisplay_list } from "../../public/assets/assets.js";

const CultureDisplay = ({ category }) => {
  const filteredList =
    category === "All"
      ? cultureDisplay_list
      : cultureDisplay_list.filter((item) => item.type === category);

  return (
    <div className="culture-display">
      <h1 className="culture-heading">Top cultures près de chez vous</h1>
      <div className="culture-grid">
        {filteredList.map((item) => (
          <CultureItem
            key={item.culture_id}
            image={item.image}
            culture_id={item.culture_id}
            nom_culture={item.nom_culture}
            region={item.region}
            saison={item.saison}
            besoin_eau={item.besoin_eau}
            conseil={item.conseil}
            production={item.production}
            Description={item.Description}
            type={item.type}
          />
        ))}
      </div>
    </div>
  );
};

export default CultureDisplay;
