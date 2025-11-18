// PLUS BESOIN D'OPENAI ICI : tri 100% local / gratuit
// const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

/**
 * criteria attendu :
 * {
 *   diplome: string,              // ex: "Master, Bac+5"
 *   experienceMin: number,        // ex: 3 (années)
 *   fonctions: string[],          // ex: ["Développeur Angular", "Ingénieur backend"]
 *   customPrompt?: string         // texte libre client (non utilisé ici mais gardé pour compat)
 * }
 *
 * cvs : tableau d’objets, ex :
 * [
 *   {
 *     id: 123,
 *     nom: "Nom Prénom",
 *     diplome: "Master Informatique",
 *     experience: 5,              // nombre ou string numérique
 *     fonction: "Développeur Angular",
 *     cvUrl: "https://.../cv/xxx.pdf"
 *   },
 *   ...
 * ]
 */

// Limite "IA gratuite" : on analyse au maximum 100 CV
const MAX_CVS_ANALYSED = 100;

async function filterCvsWithGPT(criteria, cvs) {
  try {
    const {
      diplome,
      experienceMin,
      fonctions,
      // on garde customPrompt pour compat, au cas où tu veuilles l'utiliser plus tard
      customPrompt
    } = criteria || {};

    const lowerDiplome = diplome ? String(diplome).toLowerCase() : null;
    const requiredExperience = typeof experienceMin === 'number'
      ? experienceMin
      : (experienceMin ? parseFloat(String(experienceMin)) : 0);

    const lowerFonctions = Array.isArray(fonctions)
      ? fonctions.map(f => String(f).toLowerCase())
      : [];

    // On ne garde que les 0–100 premiers CV
    const cvsToAnalyse = Array.isArray(cvs) ? cvs.slice(0, MAX_CVS_ANALYSED) : [];

    const retenus = [];
    const rejetes = [];

    for (const cv of cvsToAnalyse) {
      // on sécurise les champs
      const cvId = cv.id;
      const cvDiplome = cv.diplome ? String(cv.diplome).toLowerCase() : '';
      const cvExpNumber = cv.experience != null
        ? parseFloat(String(cv.experience))
        : 0;
      const cvFonction = cv.fonction ? String(cv.fonction).toLowerCase() : '';

      let estRetenu = true;
      const raisonsRejet = [];
      const raisonsSucces = [];

      // 1) Diplôme / certificats
      if (lowerDiplome) {
        // stratégie simple : le diplôme du CV doit contenir le texte attendu
        if (!cvDiplome || !cvDiplome.includes(lowerDiplome)) {
          estRetenu = false;
          raisonsRejet.push(`Diplôme requis "${diplome}" non trouvé dans "${cv.diplome || 'non renseigné'}"`);
        } else {
          raisonsSucces.push(`Diplôme correspondant ("${cv.diplome}")`);
        }
      }

      // 2) Années d'expérience min
      if (requiredExperience && !Number.isNaN(requiredExperience)) {
        if (Number.isNaN(cvExpNumber) || cvExpNumber < requiredExperience) {
          estRetenu = false;
          raisonsRejet.push(`Expérience ${cv.experience || 0} an(s) < minimum requis ${requiredExperience} an(s)`);
        } else {
          raisonsSucces.push(`Expérience suffisante (${cv.experience} an(s))`);
        }
      }

      // 3) Fonctions / intitulés requis
      if (lowerFonctions.length > 0) {
        const matchFonction = lowerFonctions.some(f => cvFonction.includes(f));
        if (!matchFonction) {
          estRetenu = false;
          raisonsRejet.push(
            `Fonction "${cv.fonction || 'non renseignée'}" ne correspond pas à [${lowerFonctions.join(', ')}]`
          );
        } else {
          raisonsSucces.push(`Fonction "${cv.fonction}" correspond à au moins un des intitulés requis`);
        }
      }

      if (estRetenu) {
        retenus.push({
          id: cvId,
          raison: raisonsSucces.join(' | ') || 'Correspond aux critères'
        });
      } else {
        rejetes.push({
          id: cvId,
          raison: raisonsRejet.join(' | ') || 'Ne correspond pas aux critères'
        });
      }
    }

    return {
      retenus,
      rejetes,
      meta: {
        totalCvsRecus: Array.isArray(cvs) ? cvs.length : 0,
        totalAnalyses: cvsToAnalyse.length,
        ignoresAuDelàDe: Array.isArray(cvs) && cvs.length > MAX_CVS_ANALYSED
          ? cvs.length - MAX_CVS_ANALYSED
          : 0
      }
    };
  } catch (error) {
    console.error('Erreur tri local CV:', error);
    throw new Error('Erreur lors du filtrage local des CVs');
  }
}

module.exports = { filterCvsWithGPT };
