// import mongoose, facilite interaction avec base de donnée
const mongoose = require('mongoose');

// création schema de données d'une Sauce, contient champs souhaités pour chaque Sauce
// indique le type et le caractère obligatoire ou non pour chaque attribut de l'objet
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0, required: false },
    dislikes: { type: Number, default: 0, required: false },
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false },
});

// export du schema en tant que modèle Mongoose, appelé "Sauce" et avec le modèle d'une sauce en paramètre
module.exports = mongoose.model('Sauce', sauceSchema);