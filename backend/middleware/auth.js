//Configuration protégeant les routes en vérifiant l'authentification avant envoi requêtes

// (verification tokens)
const jwt = require('jsonwebtoken');
//import fichier de config
const config = require('../config.js');
require('dotenv').config();
// middleware a appliquer à nos routes sauces à proteger
module.exports = (req, res, next) => {
    // try/catch car plusieurs élements peuvent poser problème, donc gerer chaque erreur
    try {
        // recuperer le token dans le header authorization
        // avec split : retourne un tableau avec 'Bearer' en 1e element et le token en 2e element
        // on recupere seulement le 2è element de ce tableau : le token
        const token = req.headers.authorization.split(' ')[1];
        // on decode le token avec fonction verify de jwt et le token et sa clé secrète en argument
        const decodedToken = jwt.verify(token, `${config.JWT_TOKEN_SECRET}`);
        // on recupere le userId contenu dans le token décodé
        const userId = decodedToken.userId;
        // s'il y a un userId dans le corps de la requete et qu'il est différent du userId du token
        if (req.body.userId && req.body.userId !== userId) {
            // on n'authentifie pas la requête, retourne erreur dans le catch
            throw 'User ID non valable !';
        } else {
            req.token = token;
            req.user = userId;
            next();
        }
    } catch {
        // exceptions : on renvoi erreur 401 pour probleme d'authentificiation
        res.status(401).json({ error: 'Requête non authentifiée !' });
    }
};