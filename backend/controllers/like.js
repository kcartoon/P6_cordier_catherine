const Sauce = require('../models/Sauce');

// Gestion des likes
exports.likeStatus = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;

    // on va chercher la sauce selectionnée
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (req.body.userId) {
                // on vérifie si l'user a déjà aimé pour éviter de liker plusieurs fois
                // (= son id est dans le tableau usersLiked)
                let userLike = sauce.usersLiked.find((id) => id === userId);
                // on vérifie si l'user a déjà disliké
                let userDislike = sauce.usersDisliked.find((id) => id === userId);

                switch (like) {
                    // si like = 1, l'utilisateur aime
                    case 1:
                        // si l'utilisateur n'a pas encore liké
                        // on ajoute un like et l'userId dans le tableau correspondant
                        if (!userLike) {
                            sauce.likes += 1;
                            sauce.usersLiked.push(userId);
                        } else {
                            // si l'utilisateur a déjà liké, on envoi une erreur
                            throw new Error('un seul like possible!');
                        }
                        // si l'utilisateur avait déjà fait un dislike, le supprimer pour pouvoir ajouter le like à la place
                        if (userDislike) {
                            // throw new Error('annuler votre dislike avant de liker!');
                            sauce.dislikes -= 1;
                            sauce.usersDisliked = sauce.usersDisliked.filter(
                                (id) => id !== userId
                            );
                        }
                        break;

                        // si like = 0, l'utilisateur annule son like
                    case 0:
                        // si l'utilisateur a déjà liké,
                        // on retire le like et le userId du tableau (on garde ceux qui ont un id différents)
                        if (userLike) {
                            sauce.likes -= 1;
                            sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
                        }
                        // si l'uitlisateur a déjà disliké,
                        // on retire le dislike et le userId du tableau
                        else {
                            if (userDislike) {
                                sauce.dislikes -= 1;
                                sauce.usersDisliked = sauce.usersDisliked.filter(
                                    (id) => id !== userId
                                );
                            }
                        }
                        break;

                        // si like = -1, l'utilisateur n'aime pas
                    case -1:
                        // si l'user n'a pas encore disliké
                        // on ajoute 1 dislikes et l'userId dans le tableau correspondant
                        if (!userDislike) {
                            sauce.dislikes += 1;
                            sauce.usersDisliked.push(userId);
                        } else {
                            // si l'utilisateur a déjà disliké, on envoi une erreur
                            throw new Error('un seul dislike possible!');
                        }
                        // si l'utilisateur avait déjà fait un like, le supprimer pour pouvoir ajouter le dislike à la place
                        if (userLike) {
                            // throw new Error('annuler votre like avant de disliker!');
                            sauce.likes -= 1;
                            sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
                        }
                }
                // sauvegarde la sauce avec like/dislike modifiés
                sauce
                    .save()
                    .then(() =>
                        res.status(201).json({ message: 'préférence enregistrée !' })
                    )
                    .catch((error) => res.status(400).json({ error }));
            } else {
                throw new Error('ajout de préférence impossible');
            }
        })
        .catch((error) => res.status(500).json({ error: error.message }));
};