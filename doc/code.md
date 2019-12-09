# Documentation du code (v0.3.0)

## Architecture de l'application

Scrum It contient un front-end et un back-end.
La partie front-end se trouve dans le dossier *src/views/*. Il contient les fichiers EJS et CSS.

La partie back-end est divisée en plusieurs dossiers. Les routes sont dans le dossier *src/routes* et leurs controllers dans le dossier *src/controller*.
Les schémas Mongoose pour la base de données MongoDB sont dans le dossier *src/models*.

Les tests unitaires sont dans le dossier *src/tests* et les tests de validations dans le dossier *validation-tests*

Nous avons utilisé les technologies suivantes pour développer l'application :
* Frontend :
    * HTML/CSS
    * EJS
    * Bootstrap
* Backend :
    * Express / Node.js
* SGBD :
    * MongoDB / Mongoose

## Swagger

La documentation Swagger est accessible à l'adresse `localhost:3000/api-docs`.

