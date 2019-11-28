# Documentation administrateur (v0.2.0)

## Installation et lancement de ScrumIt

### Avec npm 
Vous devez avoir `npm` et `nodejs` d'installé. Sous Windows, vous pouvez installer npm en cliquant [ici](https://www.npmjs.com/get-npm) et nodejs [ici](https://nodejs.org/en/download/).<br>
Sous Linux, vous pouvez installer les deux en tapant `apt install nodejs`.

* Pour installer le projet, placez-vous dans le répertoire *src/* puis tapez `npm install`
* Une fois les installations des dépendances terminées, vous pourrez taper `npm start` pour lancer ScrumIt
* Vous pouvez ensuite ouvrir un navigateur Web et aller à l'adresse `localhost:3000` qui vous affichera la page de connexion.

### Avec Docker

Vous devez avoir `docker` d'installé.  Vous pouvez l'installer en cliquant [ici](https://hub.docker.com/?overlay=onboarding) sous Windows ou en tapant `apt install docker-ce` sous Linux.

* Placez-vous dans le répertoire contenant le fichier *docker-compose.yml* et taper `docker-compose up`
* Vous pouvez ensuite ouvrir un navigateur Web et entrer l'IP de votre machine docker, ce qui vous affichera la page de connexion.