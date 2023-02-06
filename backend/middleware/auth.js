

const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; //Récupération du header et le spliter pour récupérer le token en seconde position
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Verify permet de décoder le token et prend deux arguments! le token et la clé secrêté aléatoire
       const userId = decodedToken.userId; //Création de l'userId afin de comparer si l'utilisateur est le même que celui qui a créé la sauce
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};