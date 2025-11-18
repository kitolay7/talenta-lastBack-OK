require('dotenv').config();
const { OpenAI } = require("openai");
const axios = require("axios");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Télécharge un PDF depuis une URL (ex : http://localhost:8181/cv/x.pdf)
async function downloadPdf(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
}

// 1) Extraction texte brute depuis un PDF via GPT (vision)
async function extractTextFromPdf(pdfBuffer) {
  const base64Pdf = pdfBuffer.toString("base64");
  const dataUrl = `data:application/pdf;base64,${base64Pdf}`;

  const response = await openai.responses.create({
    // modèle vision pas cher, adapté pour lire des PDF
    model: "gpt-5",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_file",
            filename: "cv.pdf",
            file_data: dataUrl,
          },
          {
            type: "input_text",
            text: "Extrait le texte complet de ce CV PDF. Réponds uniquement avec le texte brut, sans résumé, sans commentaire.",
          },
        ],
      },
    ],
  });

  const fullText = response.output_text || "";

  // On limite la taille pour éviter que le tri derrière devienne instable
  const MAX_CHARS = 12000;
  return fullText.length > MAX_CHARS
    ? fullText.slice(0, MAX_CHARS)
    : fullText;
}

// 2) Tri de CV basé sur analyse réelle du PDF
async function filterCvsWithGPT(criteria, cvs) {
  try {
    const { diplome, experienceMin, fonctions, customPrompt } = criteria;

    const cvTexts = {}; // { [idCandidat]: "texte du CV" }
    const cvDetails = {}; // { [idCandidat]: { nom, prenom, cvUrl, score } }

    // === Étape 1 : lire tous les PDF et extraire le texte ===
    for (const cv of cvs) {
      if (!cv.cvUrl) {
        console.log(`Aucun CV URL pour le candidat ${cv.id}`);
        continue;
      }

      // Récupération des informations supplémentaires du candidat (nom, prénom, cvUrl)
      const cvUrl = process.env.BASE_URL_BACK + cv.cvUrl;
      const nomPrenom = `${cv.user?.profile?.firstName} ${cv.user?.profile?.lastName}`;

      // Ajouter les détails du candidat
      cvDetails[cv.id] = {
        nom: cv.user?.profile?.firstName,
        prenom: cv.user?.profile?.lastName,
        cvUrl
      };

      const urlPdf = process.env.BASE_URL_BACK + cv.cvUrl;
      console.log("Téléchargement PDF :", urlPdf);

      const pdfBuffer = await downloadPdf(urlPdf);
      console.log(`Taille PDF (octets) pour candidat ${cv.id} :`, pdfBuffer.length);

      if (!pdfBuffer.length) {
        console.warn(`PDF vide pour le candidat ${cv.id}, on ignore.`);
        continue;
      }

      console.log("Analyse du PDF via GPT (extraction texte)...");

      const text = await extractTextFromPdf(pdfBuffer);

      if (!text || !text.trim()) {
        console.warn(`Aucun texte extrait pour le candidat ${cv.id}, on ignore.`);
        continue;
      }

      // Log pour déboguer le texte extrait
      // console.log(`Texte extrait pour ${cv.id} :`, text.slice(0, 500));

      cvTexts[cv.id] = text;
    }

    // Si aucun CV exploitable
    if (Object.keys(cvTexts).length === 0) {
      console.warn("Aucun texte de CV exploitable, retour vide.");
      return { retenus: [], rejetes: [], info: "Aucun CV analysable" };
    }

    // Structuration des données pour GPT
    const cvList = Object.entries(cvTexts).map(([id, texte]) => ({
      id,
      texte_cv: texte,
      ...cvDetails[id]  // Ajout des détails du candidat (nom, prénom, cvUrl)
    }));

    // === Étape 2 : tri avec critères ===
    const systemPrompt = customPrompt || `
      Tu es un assistant de tri de CV pour un cabinet de recrutement.
      Tu reçois une liste de CV : chaque entrée contient un "id" (id du candidat)
      et "texte_cv" (texte brut extrait du CV).

      Tu dois appliquer un PREMIER TRI par CRITÈRES D'ÉLIMINATION, de manière stricte.

      Critères du client :
      - Diplômes ou certificats attendus : ${diplome || 'non précisé'}
      - Expérience minimum (années) : ${experienceMin || 0}
      - Fonctions / intitulés requis : ${(fonctions && fonctions.length) ? fonctions.join(', ') : 'non précisé'}

      RÈGLES IMPORTANTES :
      - Considère comme "Consultant" tout poste ou mission contenant le mot "Consultant".
      - Pour l'expérience, estime les années à partir des textes (périodes, durées...) et sois conservateur, mais
        ne dis jamais "aucune expérience" si des expériences sont clairement listées.
      - NE DIS JAMAIS "aucune information" si le mot (ou une variante) apparaît dans le texte du CV.

      Tu dois produire SEULEMENT ce JSON STRICT :

      {
        "retenus": [
          { "id": "<id du candidat>", "raison": "<explication>", "nom": "<nom>", "prenom": "<prénom>", "cvUrl": "<url du cv>", "score": <score> }
        ],
        "rejetes": [
          { "id": "<id du candidat>", "raison": "<explication>", "nom": "<nom>", "prenom": "<prénom>", "cvUrl": "<url du cv>", "score": <score> }
        ]
      }

      Chaque CV doit être soit dans "retenus", soit dans "rejetes" (mais pas les deux).
      N'ajoute AUCUNE autre clé, pas de commentaire, pas de texte hors de ce JSON.
    `;

    const userPrompt = `
    Voici la liste des CV à analyser (id + texte brut) :
    ${JSON.stringify(cvList, null, 2)}
    `;

    const response = await openai.responses.create({
      model: "gpt-4.1", // modèle de tri
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const out = response.output_text;
    // Log pour déboguer la réponse de GPT
    // console.log("Réponse brute GPT (tri) :", out);

    let parsed;
    try {
      parsed = JSON.parse(out);
    } catch (e) {
      console.error("Impossible de parser la réponse GPT en JSON, on renvoie brut.", e);
      parsed = { raw: out };
    }

    // Retourner les résultats triés par score décroissant
    const sortedRetenus = parsed.retenus.sort((a, b) => b.score - a.score);
    const sortedRejetes = parsed.rejetes.sort((a, b) => b.score - a.score);

    return {
      retenus: sortedRetenus,
      rejetes: sortedRejetes
    };

  } catch (err) {
    console.error("Erreur GPT (PDF):", err);
    throw new Error("Erreur analyse PDF CV");
  }
}

module.exports = { filterCvsWithGPT };

