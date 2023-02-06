// Import de Mongoose

const mongoose = require("mongoose");
// Création du schèma de données pour les sauces en utilisant la fonction "schema()" de Mongoose

const sauceSchema = mongoose.Schema({
  // Objet avec les différents champs nécessaire pour le schéma

  userId: { type: String },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String },
  heat: { type: Number },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});
// Export du schéma sous forme de modèle (nom du modèle, schéma)

module.exports = mongoose.model("Sauce", sauceSchema);
