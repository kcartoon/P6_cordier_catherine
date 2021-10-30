var passwordValidator = require('password-validator');

var passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)            //contient min 8 caractères
.is().max(20)           //contient max 20 caractères
.has().uppercase()      //contient au moins une majuscule
.has().lowercase()      //contient au moins une minuscule
.has().digits()         //contient au moins un chiffre
.has().symbols()        //contient au moins un symbole
.has().not().spaces()   //ne contient pas d'espaces

module.exports = passwordSchema;
