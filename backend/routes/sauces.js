// Import d'Express
const express = require("express");
// Création d'un routeur avec la méthode "Router" d'Express
const router = express.Router();

// Import du controlleur sauces afin de l'appliquer à nos routes
const sauceCtrl = require("../controllers/sauce");

// Import du middleware auth.js afin de l'appliquer à nos routes
const auth = require("../middleware/auth");

// Import du middleware multer-config.js afin de l'appliquer à notre route POST
const multer = require("../middleware/multer-config");

// Enregistrement des différentes routes dans le routeur
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

// Export du routeur de ce fichier

module.exports = router;
