const express = require('express');
const router = express.Router();
//const modelUtilisateurs = require('../models/utilisateursEnLigne');
const utilisateursEnLigne = require('../controllers/utilisateursEnLigneController');
// GET /api/utilisateurs-en-ligne (avec possibilité de filtrer par oeuvre)
/*router.get('/', (req, res) => {
  const idOeuvre = req.query.idOeuvre; // ?idOeuvre=123
  res.json(modelUtilisateurs.obtenirUtilisateursEnLigne(idOeuvre));
});*/

router.get('/contributeurs/:id_projet', utilisateursEnLigne.contributeursProjet);
  

module.exports = router;
