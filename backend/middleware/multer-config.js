const multer = require("multer"); // Import multer pour la gestion des images

const MIME_TYPES = { // Dictionnaire des différents formats des images possibles
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({ // Objet de configuration pour multer et enregistrement sur le disque
  destination: (req, file, callback) => { 
    callback(null, "images");// destination de l'image dans le dossier 'images'
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Ici on accède au nom original du fichier et on efface les espaces avec split en joignont des underscore à la place des espaces
    const extension = MIME_TYPES[file.mimetype]; // appel du dictionnaire au sein de la variable extension
    callback(null, name + Date.now() + "." + extension); // appel du callbakc avec null pour dire qu'il n'y a pas d'erreur
  },                                                     // ajout du time stamp avec Date.now avec un point plus l'extension
});

module.exports = multer({ storage: storage }).single("image"); // export de l'image avec la méthode single pour indiquer que celle-ci est unique
