# Atlas Muscu

Bibliothèque d'exercices de musculation avec plus de 1500 mouvements. Chaque exercice a sa démonstration animée en 3D, les muscles travaillés sur une carte du corps, le matériel et les étapes d'exécution. On peut filtrer par groupe musculaire ou par matériel, chercher un exercice et enregistrer ses favoris.

Les animations et les données viennent de l'API libre ExerciseDB (oss.exercisedb.dev). Les images restent hébergées chez eux, l'appli ne fait que les afficher.

## Lancer l'appli

Il faut Node 18 ou plus récent.

D'abord récupérer la base d'exercices, une seule fois :

    node scripts/sync.mjs

Ça crée le fichier data/exercises.js. Ensuite il suffit d'ouvrir index.html dans le navigateur. On peut aussi lancer un petit serveur local pour tester sur le téléphone depuis le même réseau :

    npx serve .

Sans le fichier data/exercises.js, l'appli essaie de charger les exercices directement depuis l'API au premier lancement puis les garde en cache dans le navigateur.

## Mettre en ligne

C'est un site statique, donc n'importe quel hébergeur gratuit marche. Le plus simple est de glisser le dossier sur Netlify Drop ou de le pousser sur un dépôt GitHub avec GitHub Pages activé. Pense à lancer le script de synchro avant pour que data/exercises.js soit bien présent.

## Organisation

index.html contient la structure de la page, styles.css la mise en forme et app.js toute la logique : chargement des données, filtres, recherche, fiche d'un exercice, carte musculaire et favoris. Le script scripts/sync.mjs télécharge la base complète.

Les noms et consignes des exercices sont en anglais comme dans la base d'origine. Le reste de l'interface, les muscles, les zones et le matériel sont traduits en français.
