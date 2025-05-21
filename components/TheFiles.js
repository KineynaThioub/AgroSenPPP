// components/TheFiles.js

import { saveAs } from "file-saver";

export const generateCultureFicheTxt = (culture) => {
  const content = `
Fiche Culture : ${culture.nom_culture}

🌍 Région : ${culture.region} , ${culture.type}
🌞 Saison idéale : ${culture.saison}
💧 Besoin en eau : ${culture.besoin_eau}
📌 Conseil : ${culture.conseil}
📊 Production annuelle : ${culture.production} M/Ans

📍 Contexte au Sénégal : 
${culture.description}
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `Fiche_${culture.nom_culture}.txt`);
};