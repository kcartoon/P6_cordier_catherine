const User = require('../models/User');
// import fichier config
const config = require('../config.js');
require('dotenv').config();

const bcrypt = require('bcrypt'); // chiffrage mot de passe

const jwt = require('jsonwebtoken');

const MaskData = require('maskdata');
const emailMask2Options = {
    maskWith: '*',
    unmaskedStartCharactersBeforeAt: 3,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false,
};

// infrastructure necessaire pour les routes d'authentification
// fonction signup pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    // fonction asynchrone de cryptage du mot de passe
    // avec le mot de passe du corps de la requête passée par le front-end et le nombre d'éxécution en argument
    bcrypt
        .hash(req.body.password, 10)
        // on recupere le hash,
        .then((hash) => {
            // on enregistre le hash dans un nouveau user avec l'email de la requete
            const user = new User({
                email: MaskData.maskEmail2(req.body.email, emailMask2Options),
                password: hash,
            });
            // on enregistre cet user dans la base de donnée
            user
                .save()
                // message de réussite renvoyé en json, code 201 : requête réussie + création de source
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                // ou message en cas d'erreur, code 400 mauvaise requete du client
                .catch((error) => res.status(400).json({ error }));
        })
        // message erreur code 500 : erreur serveur
        .catch((error) => res.status(500).json({ error }));
};

// fonction login pour connecter les users existants
exports.login = (req, res, next) => {
    // trouver (recupérer) l'user dans la base de donnée qui correspond à l'email entré
    User.findOne({
            email: MaskData.maskEmail2(req.body.email, emailMask2Options),
        })
        .then((user) => {
            // si on ne trouve pas l'user, on renvoi un 401 pour dire non autorisé
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // on utilise bcrypt pour comparer les hash, le mdp envoyé avec la requete et le hash enregistré dans database
            bcrypt
                .compare(req.body.password, user.password)
                // dans then on recoit un boolean pour savoir si valable ou non
                .then((valid) => {
                    //si false, invalide : message code 401 Unauthorized
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // si true, renvoi statut 200 = bonne connexion et renvoi son userId et 1 token au front-end
                    res.status(200).json({
                        userId: user._id,
                        // on appelle la fonction sign de jsonwebtoken pour encoder un nouveau token
                        token: jwt.sign(
                            // ID de l'user en tant que données à encoder dans le token, pour être sur que la requete correspond bien à l'userId
                            { userId: user._id },
                            // clé secrete pour l'encodage
                            `${config.JWT_TOKEN_SECRET}`, // expiration du token, au bout de 24h l'user doit se reconnecter
                            { expiresIn: '24h' }
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};