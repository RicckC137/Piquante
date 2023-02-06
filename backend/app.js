// Import d'Express pour créer l'application

const express = require("express");
// Import du package cors pour activer CORS avec les diverses options

const cors = require("cors");
//Import du module Helmet est la solution préconisée afin de protéger son application des vulnérabilités les plus courantes
const helmet = require("helmet");
// Import de Mongoose pour opérer la liaison avec la base de données

const mongoose = require("mongoose");
// Import des routes user

const userRoutes = require("./routes/user");
// Import des routes sauce

const sauceRoutes = require("./routes/sauces");
// Import du path du serveur

const path = require("path");
// Création de l'application en faisant appel à la méthode Express

const app = express();
// Import de Dotenv pour masquer le nom d'utilisateur et le mdp lors de la connection à la base de données
//Afin d'utiliser la méthode config
const dotenv = require("dotenv");
dotenv.config();
// Connection de l'API au cluster MongoDB

mongoose
  .connect("mongodb+srv://Abdel:paris@piquante.bls12st.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
// Gestion de la ressource "images" de manière statique à chaque fois qu'Express reçoit une requête vers la route "/images"
app.use("/images", express.static(path.join(__dirname, "images")));
// Activation d'Helmet
app.use(helmet());
// Activation du parse
app.use(express.json());
// Enregistrement de la route user sur l'application

app.use("/api/auth", userRoutes);
// Enregistrement de la route sauce sur l'application

app.use("/api/sauces", sauceRoutes);
// Export de l'application afin d'y accéder depuis les autres fichiers

module.exports = app;
