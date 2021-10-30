//----------------------- fichier présentant les routes like disponibles, à quel endpoint et leur fonction -----------------------// 

// import express
const express = require('express');
// creation du routeur
const router = express.Router();
// import middleware d'authentification à utiliser sur toutes les routes
const auth = require('../middleware/auth');
// import du controller user
const likeCtrl = require('../controllers/like');

// traitement de l'option like/dislike
router.post('/:id/like', auth, likeCtrl.likeStatus);

// export des routes
module.exports = router;