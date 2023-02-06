
// Import du package fs 

const fs = require("fs");

// Import du modèle de sauce

const sauce = require("../models/sauce");

// Import du token d'identification
const jwt = require("jsonwebtoken");

//Logique de création de la sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject.id; // On supprime l'id puisque celle-ci est générée automatiquement par MONGODB
  const newSauce = new sauce({
    ...sauceObject, // Récupération des éléments qui ont été parsé dans le corps de la requête
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      //Traitement de l'image
      req.file.filename
    }`,
  });
  newSauce
    .save() //Sauvegarde de la nouvelle sauce
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};
//Fonction de suppression de la sauce

exports.deleteSauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const token = req.headers.authorization.split(" ")[1]; // Récupération du header et le spliter pour récupérer le token en seconde position
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Verify permet de décoder le token et prend deux arguments! le token et la clé secrêté aléatoire
    const userId = decodedToken.userId; //Création de l'userId afin de comparer si l'utilisateur est le même que celui qui a créé la sauce
    if (sauce.userId != userId) { //Si l'ID du créateur de la sauce ne correspond pas à celle de l'utilisateur actuel, on n'autorise pas la possibilité de supprimer la sauce
      res.status(401).json({ message: "Not Authorized" });
    } else {
      const filename = sauce.imageUrl.split("/images/")[1]; // Dans le cas contraire on traite l'image avec split et on la supprimer
      fs.unlink(`images/${filename}`, () => {
        sauce                                         // Puis on supprime l'image
          .deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: "Sauce supprimée !" });
          })
          .catch((error) => res.status(401).json({ error }));
      });
    }
  });
};

// Fonction de suppression de la sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  sauce
    .updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};
// Création et export de la fonction pour gérer la route GET pour récupérer la liste des sauces
//Afin d'afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
  // Utilisation de la méthode find pour trouver les sauces dans la base de données
  sauce
    .find()
    .then((sauces) => res.status(200).json(sauces)) // Une promesse est retournée et récupération des sauces sous format Json
    .catch((error) => res.status(400).json({ error })); 
};
//Logique permettant l'affichage d'une seule sauce
exports.getOneSauce = (req, res, next) => {
  sauce // Utilisation de la méthode find pour trouver la sauce correspondante grâce à l'ID
    .findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
//Logique permettant de liker ou disliker une sauce

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  // Si l'utilisateur clique sur le bouton like
  if (like === 1) {
    sauce // Utilisation de la méthode "updateOne" pour mettre à jour les likes
      .updateOne(
        { _id: req.params.id }, // 1er argument : On détermine par son id la sauce qu'on veut modifier
        {
          // 2e argument: On push l'utilisateur et on incrémente le like de 1
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
          _id: req.params.id,
        }
      ) // Promise retournée
      .then(() => res.status(200).json({ message: "Vous aimez cette sauce" }))
      .catch((error) => res.status(400).json({ error })); // gestion de l'erreur éventuelle
  } else if (like === -1) {
    sauce
      .updateOne(
        // Utilisation de la méthode "updateOne" pour mettre à jour les dislikes
        { _id: req.params.id }, // 1er argument: On récupère l'id de la sauce
        {
          $inc: { dislikes: 1 }, // 2e argument: On push l'utlisateur puis on incrémente le dislike de +1
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id,
        }
      )
      .then(() =>
        // Promise retournée
        res.status(200).json({ message: " Vous n'aimez pas cette sauce" })
      )
      .catch((error) => res.status(400).json({ error }));
  } else {
    // annulation du like ou dislike
    sauce.findOne({ _id: req.params.id }).then((resultat) => {
      if (resultat.usersLiked.includes(req.body.userId)) {
        // Si l'userId correspond à l'utilisateur ayant liké
        sauce
          .findOneAndUpdate(
            //Utilisation de la methode findOneAndUpdate qui permet de retrouver la sauce correspondante et d'actualiser son choix
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
            }
          )
          .then(() =>
            res.status(200).json({ message: "Vous n'aimez plus cette sauce!" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (resultat.usersDisliked.includes(req.body.userId)) {
        sauce
          .findOneAndUpdate(
            //Utilisation de la methode findOneAndUpdate qui permet de retrouver la sauce correspondante et d'actualiser son choix
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            }
          )
          .then(() =>
            res.status(200).json({
              message: "Vous avez cessé de ne plus aimer cette sauce!",
            })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    });
  }
};
