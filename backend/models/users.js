// Import de Mongoose

const mongoose = require("mongoose");
// Import du package "mongoose-unique-validateur" (package de validation pour prévalider les informations avant de les enregister)
const uniqueValidator = require("mongoose-unique-validator");

//Schéma pour utiliser une adresse email unique
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
// Ajout du validateur "mongoose-unique-validator" comme plugin au schéma afin de s'assurer que deux utilisateurs ne puissent pas partager le même email

userSchema.plugin(uniqueValidator);
// Export du schéma sous forme de modèle (nom du modèle, schéma)

module.exports = mongoose.model("User", userSchema);
