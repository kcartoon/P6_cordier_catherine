//Configuration pour gerer fichiers entrants dans les requêtes http
const multer = require('multer');

// dictionnaire (objet) pour l'extension du fichier utilisée dans le nom de fichier
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
};

// creer un objet de configuration indiquant à multer où et comment enregistrer les fichiers images
// on enregistre sur le disque de stockage la destination et le nom du fichier
const storage = multer.diskStorage({
    // fonction qui explique dans quel dossier on enregistre les fichiers
    destination: (req, file, callback) => {
        // null = il n'y a pas eu d'erreur, en 2e= nom du dossier
        callback(null, 'images');
    },
    // fonction qui indique quel nom de fichier utiliser
    filename: (req, file, callback) => {
        // on génere le nouveau nom pour le fichier
        // on élmine les espaces en les remplacant par des underscore pour éviter erreurs avec split et join
        const name = file.originalname.split(' ').join('_');
        // on ajoute une extension au fichier : élement de notre dictionnaire qui correspond au format du fichier envoyé par le frontend
        const extension = MIME_TYPES[file.mimetype];
        // on appelle la callback, on ajoute nom + un timestamp(=format date sous forme d'entier comptant les milisecondes, nom de fichier unique) + un '.' + l'extension
        callback(null, name + Date.now() + '.' + extension);
    },
});

// exports du multer configuré, 'single' pour dire qu'il s'agit d'un fichier unique + fichier image uniquement
module.exports = multer({ storage }).single('image');