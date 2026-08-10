// data.js — chargement et utilitaires pour l'arbre généalogique

let PERSONNES = {}; // dictionnaire id -> personne, rempli après chargement

async function chargerDonnees() {
  const reponse = await fetch("data/personnes.json");
  const liste = await reponse.json();
  PERSONNES = {};
  liste.forEach(p => (PERSONNES[p.id] = p));
  return PERSONNES;
}

// Retourne les générations d'ANCÊTRES d'une personne.
// generations[0] = [la personne elle-même]
// generations[1] = ses parents
// generations[2] = ses grands-parents
// etc. On itère génération par génération jusqu'à ce qu'il n'y en ait plus.
function getAncetresParGeneration(id) {
  const generations = [];
  let generationCourante = [id];

  while (generationCourante.length > 0) {
    generations.push(generationCourante);

    const generationSuivante = [];
    generationCourante.forEach(pid => {
      const personne = PERSONNES[pid];
      if (!personne) return;
      personne.parents.forEach(parentId => {
        if (!generationSuivante.includes(parentId)) {
          generationSuivante.push(parentId);
        }
      });
    });

    generationCourante = generationSuivante;
  }

  return generations; // tableau de tableaux d'ids
}

// Retourne les générations de DESCENDANTS d'une personne, même logique.
function getDescendantsParGeneration(id) {
  const generations = [];
  let generationCourante = [id];

  while (generationCourante.length > 0) {
    generations.push(generationCourante);

    const generationSuivante = [];
    generationCourante.forEach(pid => {
      const personne = PERSONNES[pid];
      if (!personne) return;
      personne.enfants.forEach(enfantId => {
        if (!generationSuivante.includes(enfantId)) {
          generationSuivante.push(enfantId);
        }
      });
    });

    generationCourante = generationSuivante;
  }

  return generations;
}