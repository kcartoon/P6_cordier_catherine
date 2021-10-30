//fichier utilisant dotenv library pour charger les fichiers .env
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});

// exports pour retrouver les valeurs contenues dans fichier .env
module.exports = {
    JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
    MONGO_DB_URI: process.env.MONGO_DB_URI,

    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3000,
};