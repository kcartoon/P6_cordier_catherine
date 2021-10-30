# P6_cordier_catherine
Projet 6
# HOT TAKES Projet 6

#Création d'une API sécurisée pour une application d'évaluation

=> Status : en cours de réalisation

## General

Développement d'une application web nommée "Piiquante" dans laquelle les utilisateurs pourront ajouter leurs sauces préférées et liker ou disliker les sauces proposées par les autres utilisateurs.

## Scénario

Création du backend,le frontend étant déjà codé et fourni.

## Technologies & frameworks utilisés

- Javascript
- Express
- Mongoose

## Préparation et vérification version du dossier de travail P6_cordier_catherine

- node -v Vérification version NodeJS 14.0.0 (utilisation de nvm)
- ng --version (Angular CLI 7.0.2.+) (Attention error @angular-devkit/core et @angular-devkit/schematics) # voir si installation
- node-sass -v(node-sass 4.14+)

**1. Cloner le dépôt** le frontend étant fourni

- Création du répertoire front-end importer le dossier"Web-Developer-P6"
- run `npm install` et `npm install --save-dev run-script-os`
- Attention modifier le fichier .json (port 8080) script start puis `npm start`
  => Vérification http://127.0.0.1:8080

**2. Création du répertoire Backend et Installation dépendances**

1. Fichiers racine

- .env
- server.js
- app.js
- config.js
- npm init -y (vérification point d'entrée (main) soit server.js).

2. Installation dépendances\*\*

- npm install --save nodemon (surveille les modifs et le redémarre lorsqu'il aura besoin)
- npm install --save express (framework reposant sur node qui facilite la création et la gestion des serveurs Node)
- npm install --save express-rate-limit

- npm install --save body-parser(Permet extraire l'objet .json de la demande)
- npm install --save path

#### Librairie Sécuritée

- npm install --save express-validator (Préparation de la base de données pour les informations d'authentification (stockage de passe sécurisé))
- npm install --save bcrypt (un algorithme unidirectionnel pour chiffrer et créer un hash des mots de passe utilisateur)
- npm install --save helmet (Sécurisation des application Express)
- npm install --save node-validator
- npm install --save password-validator
- npm install --save jsonwebtoken (Encodage d'un TOCKEN (Création dossier middleware et fichier auth.js)
- npm install --save dotenv(Permet la gestion du fichier .env)

#### Base de donnée /Stockage

- npm install --save cors (partage des ressources entre origines multiples)
- npm install --save fs-extra (ajoute la prise en charge des promesses )
- npm install --save mongoose (outil de modélisation d'objets MongoDB )
- npm install --save mongoose-unique-validator (plugin qui ajoute une validation de pré-enregistrement pour les champs uniques dans un schéma Mongoose.)
- npm install --save multer (gestion des images importer dans le stockage)

3. Arborescence backend :

- /controlers :
- /images :
- /middleware :
- /models :
- /routes :

4. Création fichier .env (y renseigner les variables d'environnement)

## Test à effectuer

## Outils local

- Postman
- MongoDBCompass

## Outils hébergers

- MongoDB Altlas
- postman
  => https://www.postman.com/home
  => https://account.mongodb.com/account/login?signedOut=true

## Mesures de sécurité mises en place

- Hashage du mot de passe utilisateur avec **bcrypt**
- Manupulation sécurisée de la base de donnée avec **mongoose**
- Vérification que l'email utilisateur soit unique dans la base de données avec **mongoose-unique-validator**
- Utilisation de variables d'environnement pour les données sensibles avec **dotenv**
- Authentification de l'utilisateur par token avec **jsonwebtoken**
- Protection des headers avec **helmet**

