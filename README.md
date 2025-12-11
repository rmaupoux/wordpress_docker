# **Readme**
## **Prérequis**
- GIT
- Docker (facultatif)
- Node, NPX
- HTML / SCSS / REACT / WordPress
- Création de Plugin WordPress
## **Installation sous Docker**
- Après avoir cloner le repo, faites un :

  docker-compose up

- Cela installera l’environnement Wordpress, finalisez l’installation en vous rendant sur l’url suivante :

  localhost:8000

Vous pouvez commencer à développer.

**Si Docker n’est pas disponible, tout autre moyen de déployer un WordPress est valide a partir du moment où le rendu est un plugin WordPress.**
## **Rendu**
Le Rendu se fera par email avec le plugin en .zip

- Un Plugin Gutenberg - *Wordpress* - contenant les différents bloc / composants demandé
- Un code propre, sans log et commenté
- Utilisations de VARIABLE SCSS
- Utilisation de GRID et/ou FLEX
## **Interdiction**
- l’usage des Frameworks :
  - Bootstrap, Foundation, Materialize ou tout autre frameworks css
  - JQuery
## **À Faire**
Le test demande un plugin WordPress développé sous REACT pour l'éditeur Gutenberg :

- Un premier bloc “Section” dans lequel on peut retrouver :
  - **Un composant** **texte** - *modifiable, couleur, taille, gras / Italique / barré* - réutilisable plusieurs fois dans la section pour :
    - Un titre
    - Une description
  - **2 boutons** ( ils peuvent être caché si besoin d’en afficher qu’un seul ou aucun) : possibilité de modifier le label, son lien, possibilité d’afficher ou non une icone ( **>** ou **<** ) à gauche ou à droite du label
  - **Un composant** **image** - *modifiable, liens* - situé a droite des 3 champs décrit ci-dessus
    - Le contributeur pourra resize l’image à la main dans l'éditeur
- Un second bloc “Section” dans lequel on peut retrouver :
  - Un Slider d’images contribuable
- Le tout devra être **responsive**
## **Bonus**
- Création de sa propre grille SCSS - *Grid system* -
- Cacher les blocs inutilisé
- Connaissance de CONCENTRIC CSS
# wordpress_docker
# wordpress_docker
