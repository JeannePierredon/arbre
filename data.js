document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const personnes = data.personnes;
      const treeContainer = document.getElementById("tree-container");

      // 1. Calculer la génération de chaque personne par itération
      const generationsMap = calculateGenerations(personnes);

      // 2. Grouper les personnes par niveau de génération
      const generations = {};
      personnes.forEach(p => {
        const gen = generationsMap[p.id] || 0;
        if (!generations[gen]) generations[gen] = [];
        generations[gen].push(p);
      });

      // 3. Afficher les générations de haut en bas
      Object.keys(generations)
        .sort((a, b) => a - b)
        .forEach(genLevel => {
          const genDiv = document.createElement("div");
          genDiv.className = "generation";

          generations[genLevel].forEach(personne => {
            const card = document.createElement("div");
            card.className = "card";
            
            // Image par défaut si url_photo n'est pas valide
            const photoSrc = (personne.photo && personne.photo !== "url_photo") 
              ? personne.photo 
              : "https://via.placeholder.com/70?text=Photo";

            card.innerHTML = `
              <img src="${photoSrc}" alt="${personne.nom}">
              <h3>${personne.nom}</h3>
            `;

            card.addEventListener("click", () => openModal(personne));
            genDiv.appendChild(card);
          });

          treeContainer.appendChild(genDiv);
        });
    })
    .catch(err => console.error("Erreur de chargement du JSON :", err));

  // Gestion de la boîte modale (bio)
  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".close-btn");

  function openModal(personne) {
    document.getElementById("modal-nom").textContent = personne.nom;
    document.getElementById("modal-bio").textContent = personne.bio || "Aucune biographie disponible.";
    document.getElementById("modal-photo").src = (personne.photo && personne.photo !== "url_photo") 
      ? personne.photo 
      : "https://via.placeholder.com/100?text=Photo";
    modal.style.display = "flex";
  }

  closeBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});

/**
 * Calcule dynamiquement la génération relative de chaque individu par itération
 */
function calculateGenerations(personnes) {
  const map = {};
  personnes.forEach(p => map[p.id] = p);
  
  const levels = {};

  // Définir les personnes sans parents connus dans le jeu de données au niveau 0
  personnes.forEach(p => {
    const hasPere = p.pere_id && map[p.pere_id];
    const hasMere = p.mere_id && map[p.mere_id];
    if (!hasPere && !hasMere) {
      levels[p.id] = 0;
    }
  });

  // Résolution itérative des niveaux parents -> enfants
  let updated = true;
  let maxIterations = 20; // Sécurité anti-boucle infinie

  while (updated && maxIterations > 0) {
    updated = false;
    maxIterations--;

    personnes.forEach(p => {
      const pereGen = p.pere_id && levels[p.pere_id] !== undefined ? levels[p.pere_id] : null;
      const mereGen = p.mere_id && levels[p.mere_id] !== undefined ? levels[p.mere_id] : null;

      let targetGen = null;
      if (pereGen !== null && mereGen !== null) {
        targetGen = Math.max(pereGen, mereGen) + 1;
      } else if (pereGen !== null) {
        targetGen = pereGen + 1;
      } else if (mereGen !== null) {
        targetGen = mereGen + 1;
      }

      if (targetGen !== null && levels[p.id] !== targetGen) {
        levels[p.id] = targetGen;
        updated = true;
      }

      // Aligner la génération du conjoint
      if (levels[p.id] !== undefined && p.conjoint && map[p.conjoint]) {
        if (levels[p.conjoint] === undefined) {
          levels[p.conjoint] = levels[p.id];
          updated = true;
        }
      }
    });
  }

  // S'assurer que chaque personne a au moins un niveau par défaut
  personnes.forEach(p => {
    if (levels[p.id] === undefined) levels[p.id] = 0;
  });

  return levels;
}