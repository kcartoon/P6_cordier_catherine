const express = require('express');
// import de mongoose
const mongoose = require('mongoose');
require('dotenv').config();
// import path, donne accès au chemin de notre système de fichier
const path = require('path');
// import fichier config
const config = require('./config.js');
//Permet d'extraire l'objet JSON de la demande
const bodyParser = require('body-parser');
// mise en place de plusieurs HTTP headers qui vont sécuriser l'appli
const helmet = require('helmet');
//import des routers dans l'application
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');
const likeRoutes = require('./routes/like');

// création de l'application express
const app = express();

//connecter base de donnée à mongoose pour faciliter interaction
mongoose
    .connect(process.env.MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS (Communication localhost 3000 et 4200)permettre l'accès à l'API depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});
//middleware global, transforme le corps de la requete en objet javascript utilisable
app.use(bodyParser.json());

app.use(express.json());
app.use(helmet());

// indique à Express qu'il faut gerer la ressource images de manière statique à chaque requête reçue vers la route /images
app.use('/images', express.static(path.join(__dirname, 'images')));

// enregistrement du routeur avec racine attendue par front-end
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/api/sauces', likeRoutes);

//export de l'application
module.exports = app;