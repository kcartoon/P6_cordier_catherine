const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res.status(400).json({
            error: 'Le mot de passe doit contenir entre 8 et 20 caractères, comprenant au moins 1 majuscule, une minuscule, un chiffre et un symbole, sans espaces',
        });
    }
    next();
};