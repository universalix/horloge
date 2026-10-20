# Horloge des durées

Horloge visuelle pensée pour les élèves dys et les personnes qui n'ont pas le sens logico-mathématique : voir l'heure et le temps qui reste, sans calcul de tête.

- Disque rouge : les heures. Disque bleu : les minutes (une part = 5 minutes).
- Appui long sur un chiffre : temps restant avant cette heure.
- Appui long sur le disque bleu : temps restant avant l'heure pile.
- Appui long sur l'heure en haut : rendez-vous à une heure précise.
- Roue dentée : ajouter des aides (aiguilles, secondes, « et / moins », date…) ou les retirer.

Page unique `index.html`, sans dépendance ni connexion requise une fois chargée.

## Widget iPhone (Scriptable)

Le dossier `widget/` contient `horloge-widget.js`, un widget d'écran d'accueil pour l'app gratuite [Scriptable](https://apps.apple.com/app/id1405459188) : même cadran que l'horloge (disques rouge et bleu, loupes heure et minutes), en mode clair ou sombre. Toucher le widget ouvre l'horloge complète.

1. Installer Scriptable (gratuit ; les achats intégrés sont des pourboires facultatifs).
2. Ouvrir [horloge-widget.js](widget/horloge-widget.js), copier tout le texte, puis dans Scriptable toucher **+**, coller, nommer le script « Horloge ».
3. Écran d'accueil : appui long → **Modifier** → **Ajouter un widget** → **Scriptable** → petite taille.
4. Appui long sur le widget → **Modifier le widget** → **Script : Horloge**.

Limite : iOS rafraîchit ces widgets quand il le décide (souvent toutes les 5 à 15 minutes). Pour éviter d'afficher des chiffres en retard, mettre `AFFICHER_LOUPES = false` en haut du script.
