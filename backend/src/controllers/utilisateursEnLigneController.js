const modelUtilisateurs = require('../models/utilisateursEnLigne');
const UtilisateurProjet = require('../models/utilisateur_projet');
function gererConnexionUtilisateur(socket, utilisateurId) {
  modelUtilisateurs.ajouterUtilisateur(socket.id, utilisateurId);
}

function gererDeconnexionUtilisateur(socket) {
  modelUtilisateurs.retirerUtilisateur(socket.id);
}

function diffuserUtilisateursEnLigne(io) {
  const utilisateurs = modelUtilisateurs.obtenirUtilisateursEnLigne();
  io.emit('utilisateurs_en_ligne', utilisateurs);
}
exports.contributeursProjet=async(req,res)=>{
  const id_projet = req.params.id_projet;
  const contributeur=await UtilisateurProjet.getUtilisateursParProjet(id_projet);
  if (contributeur.length > 0) {
    res.status(200).json(contributeur);
  } else {
    res.status(404).json({ message: 'Aucun contributeur trouvé pour ce projet.' });
  }
}

