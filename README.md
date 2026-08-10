# Arbre généalogique interactif

Site statique (HTML/JS pur, sans framework) pour afficher un arbre généalogique
interactif, hébergeable gratuitement sur **GitHub Pages**.

## Structure du projet

```
genealogie/
├── index.html          # Page listant toutes les personnes
├── arbre.html           # Page affichant l'arbre (ancêtres + descendants) d'une personne
├── data.js              # Chargement des données + fonctions de calcul des générations
├── data/
│   └── personnes.json   # LA BASE DE DONNÉES : une personne = un objet JSON
└── photos/
    └── ...               # Photos des personnes (fichiers image)
```

## La base de données (`data/personnes.json`)

C'est un simple fichier JSON, facile à éditer à la main ou avec un script.
Chaque personne a cette forme :

```json
{
  "id": "p1",
  "nom": "Jean Dupont",
  "texte": "Petit texte de présentation.",
  "photo": "photos/jean.jpg",
  "parents": ["idPapa", "idMaman"],
  "enfants": ["idEnfant1", "idEnfant2"]
}
```

- `id` : identifiant unique (ex: `p1`, `p2`...)
- `parents` et `enfants` : listes d'`id` d'autres personnes du fichier
- Une personne sans parents connus → `"parents": []`
- Une personne sans enfants → `"enfants": []`

**Important** : les liens sont à double sens. Si `p3` a `p1` comme parent,
il faut aussi que `p1` ait `p3` dans sa liste `enfants` (et inversement).

## Comment fonctionne l'affichage de l'arbre

Dans `data.js`, deux fonctions itèrent génération par génération à partir
d'une personne :

- `getAncetresParGeneration(id)` : génération 0 = la personne, génération 1 =
  ses parents, génération 2 = ses grands-parents, etc. À chaque tour de
  boucle `while`, on remonte d'un cran en suivant `parents`.
- `getDescendantsParGeneration(id)` : même principe mais en suivant `enfants`.

La boucle s'arrête automatiquement dès qu'une génération est vide (plus
personne à remonter/descendre).

## Ajouter une personne

1. Ouvrez `data/personnes.json`.
2. Ajoutez un nouvel objet avec un `id` unique.
3. Mettez à jour les `enfants`/`parents` des personnes liées.
4. Ajoutez sa photo dans `photos/` (ou laissez `photos/placeholder.png`).

## Déployer sur GitHub Pages

1. Créez un dépôt GitHub (ex: `arbre-genealogique`).
2. Poussez tout le contenu de ce dossier à la racine du dépôt :
   ```bash
   git init
   git add .
   git commit -m "Premier arbre généalogique"
   git branch -M main
   git remote add origin https://github.com/VOTRE-PSEUDO/arbre-genealogique.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Source : branche `main`, dossier `/ (root)`**.
4. Votre site sera visible à :
   `https://VOTRE-PSEUDO.github.io/arbre-genealogique/`

## Tester en local

Comme le site charge un fichier JSON via `fetch`, il faut un petit serveur
local (ouvrir directement le fichier `index.html` dans le navigateur ne
fonctionnera pas à cause des restrictions de sécurité) :

```bash
cd genealogie
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

## Personnalisation

- Les couleurs/styles sont dans les balises `<style>` de `index.html` et
  `arbre.html` — modifiables librement.
- Les photos peuvent être hébergées dans `photos/` ou pointer vers une URL
  externe dans le champ `photo`.