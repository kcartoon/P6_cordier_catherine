// Import du modele sauce
const Sauce = require('../models/Sauce');
// Accès aux differentes opérations liées au systeme de fichier (ex: supprimer un fichier)
const fs = require('fs-extra');
// Vérification tokens
const jwt = require('jsonwebtoken');
//import fichier de config
const config = require('../config.js');
//Création CRUD
// création d'une sauce
exports.createSauce = (req, res, next) => {
    // transformation des informations de la requête (chaine JSON) en objet JS car on va traiter des fichiers
    const sauceObject = JSON.parse(req.body.sauce);
    // suppresion du champ id de la requete qui n'est pas le bon car l'id est généré automatiquement par mongoose
    delete sauceObject._id;
    // nouvelle instance de l'objet Sauce en lui passant un objet JS contenant les infos requise du corps de requete analysé
    const sauce = new Sauce({
        // on utlise l'opérateur spread ... pour faire une copie de tous les élements req.body
        // va copier les champs qu'il y a dans le corps de la requete et détailler le titre, le description etc
        ...sauceObject,
        // configuration de l'url de l'image
        // par : "protocole, http/https"://"racineduserveur(localhost:3000)"/images/nomfichier(configuré par multer)
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    });

    // empêcher utilisateur de creer une sauce avec l'userId de quelqu'un d'autre
    // recuperer le token dans le header authorization pour obtenir l'userId actuel
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${config.JWT_TOKEN_SECRET}`);
    const userId = decodedToken.userId;
    // si le userId de la sauce est le même que celui du token de connexion
    if (sauce.userId === userId) {
        // Enregistrement de la sauce dans la base de données
        // retourne une promise
        sauce
            .save()
            // on renvoi un code 201 pour une bonne création de ressource
            .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
            // on récupère l'erreur avec un code 400
            .catch((error) => {
                res.status(400).json({ message: error });
            });
    } else {
        res.status(401).json({ error: 'userId non valable' });
    }
};

// modification d'une sauce existante par son id
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        // cette sauce est retournée dans une promise et envoyée au front-end
        .then((sauce) => {
            // on récupère les informations modifiées de la sauce dans la constante sauceObject
            // on utilise operateur ternaire "?" pour savoir si un fichier image a été ajouté à la requête
            const sauceObject = req.file // Si le fichier image existe, on traite les strings et la nouvelle image
                ?
                {
                    // on récupère les chaines de caractères qui sont dans la requête et on parse en objet
                    ...JSON.parse(req.body.sauce),
                    // on modifie l'url de l'image
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${
              req.file.filename
            }`,
                    // si le fichier image n'existe pas, on traite les autres élements du corps de la requête
                } :
                {...req.body };

            // si l'userId contenu dans la sauce modifiée est le même que la sauce avant modification : autorisation
            if (sauceObject.userId === sauce.userId) {
                // mettre à jour la sauce dans la base de donnée, on compare
                // 1er argument : la sauce choisie, celle avec l'id envoyée dans la requête
                // 2ème argument : nouvelle version de la sauce : celle modifiée renvoyée dans la requête, en modifiant l'id pour qu'il correspondant à celui des paramètres de requêtes
                Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch((error) => res.status(400).json({ error }));
            }
            // si les userId ne correspondent pas, on envoi une erreur 401 unauthorized
            else {
                res
                    .status(401)
                    .json({ error: "vous n'êtes pas autorisé à modifier cette sauce" });
            }
        })
        // si aucune sauce trouvée, on envoi erreur
        .catch((error) => res.status(500).json({ error }));
};

// suppression d'une sauce par son id
exports.deleteSauce = (req, res, next) => {
    // on va chercher la sauce qui a l'id correspondent à celui dans les parametres de la requete
    Sauce.findOne({ _id: req.params.id })
        // quand on trouve la sauce
        .then((sauce) => {
            // empêcher utilisateur de supprimer une sauce qui ne lui appartient pas
            // recuperer le token dans le header authorization pour obtenir l'userId actuel
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, `${config.JWT_TOKEN_SECRET}`);
            const userId = decodedToken.userId;
            // si le userId de la sauce est le même que celui du token de connexion
            if (sauce.userId === userId) {
                // on extrait le nom du fichier à supprimer
                // split retourne un tableau de 2 elements : tout ce qui vient avant '/images/' et tout ce qui vient apres '/images/'=nom du fichier, on recupère le 2ème élement
                const filename = sauce.imageUrl.split('/images/')[1];
                // la methode fs.unlink va supprimer l'image du chemin local et dans la base de donnée
                // 1er arg: chemin du fichier, 2e arg: la callback=ce qu'il faut faire une fois le fichier supprimé
                fs.unlink(`images/${filename}`, () => {
                    // on supprime la sauce de la base de donnée en indiquant son id
                    // pas besoin de 2e arg car suppression
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                        .catch((error) => res.status(400).json({ error }));
                });
            } else {
                res
                    .status(401)
                    .json({ error: "vous n'êtes pas autorisé à supprimer cette sauce" });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

// récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    // methode find pour obtenir la liste complète
    // retrourne une promise
    Sauce.find()
        // Récupération de toutes les sauces dans un tableau retournées dans la base données
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(404).json({ error }));
};

// récupération d'une sauce par son id
exports.getOneSauce = (req, res, next) => {
    // findOne = trouve un seul
    // on veut que l'id de la sauce soit le même que le paramètre de requete
    Sauce.findOne({ _id: req.params.id })
        // cette sauce est retournée dans une promise et envoyée au front-end
        .then((sauce) => res.status(200).json(sauce))
        // si aucune sauce trouvée, on envoi erreur 404
        .catch((error) => res.status(404).json({ error }));
};