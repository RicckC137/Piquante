const bcrypt = require("bcrypt"); // Import de bcrypt qui sert afin de crypter les mots de passe
const jwt = require("jsonwebtoken"); // Import du token d'identification
const User = require("../models/users"); // Import des modèles utilisateurs
const passwordValidator = require("password-validator"); // Import du module de validation du mot de passe
const passwordVerify = new passwordValidator();

passwordVerify // Définition d'une expression régulière pour les mots de passe
  .is()
  .min(8)
  .is()
  .max(50)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .symbols();

exports.signup = (req, res, next) => {
  // Fonction d'enregistrement d'un nouvel utilisateur
  bcrypt
    .hash(req.body.password, 10) // Hash du mot de passe utilisateur avec une exécution en 10 tours
    .then((hash) => {
      const user = new User({
        // Création d'un nouvel utilisateur par référence au model utilisateur
        email: req.body.email, // Récupération de l'adresse mail inséré dans le champ mail
        password: hash, // Enregistrement du hash récupére ligne 25
      });
      user
        .save() // Enregistrement du nouvel utilisateur en base de donnée
        .then(() =>
          res.status(201).json({ message: "Nouvel utilisateur créé !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  // Fonction de connexion d'un utilisateur déjà enregistré
  User.findOne({ email: req.body.email }) //Utilisation de la méthode findone sur User
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: "Paire identifiant / mot de passe incorrecte !" }); // Si utilisateur inconnu ou incorrect on retourne une erreur
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            // Si le mot de passe est invalide on retourne une erreur
            return res
              .status(401)
              .json({ error: "Paire identifiant / mot de passe incorrecte !" });
          }
          res.status(200).json({
            //Si mot de passe correct, on retourne un code 200 et un objet nécessaire à l'authentification
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error })); // Erreur d'exécution dans la base de donnée pas de défaut de champ dans la base de donnée (utilisateur inexistant)
};
