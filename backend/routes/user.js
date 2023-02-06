// Import d'Express afin de créer un routeur

const express = require("express");
// Création du routeur avec la fonction "Router" d'Express

const router = express.Router();
//Limiteur de débit pour les requêtes API
const rateLimit = require("express-rate-limit");
const userCtrl = require("../controllers/user");

const passLimiter = rateLimit({
  windowMs: 12 * 60 * 60 * 1000, // windowMs est la taille de la fenêtre. Dans notre cas, nous avons utilisé une durée de fenêtre de 24 heures en millisecondes.
  max: 10, //max est le nombre maximal de requêtes qu'un utilisateur peut effectuer dans une fenêtre de temps donnée.
  message: "You exceeded 10 requests in 12 hour limit!", //Le message de réponse qu'un utilisateur reçoit chaque fois qu'il a dépassé la limite.
  headers: true,//headersindique s'il faut ajouter des en-têtes pour afficher le nombre total de requêtes et la durée d'attente avant d'essayer de refaire des requêtes.
});

// Création des routes
router.post("/signup", userCtrl.signup);
router.post("/login", passLimiter, userCtrl.login);
// Export du routeur pour pouvoir l'importer dans app.js

module.exports = router;
