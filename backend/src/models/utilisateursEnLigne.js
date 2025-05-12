const utilisateurs = {};

// Ajouter un utilisateur avec toutes les informations nécessaires
function ajouterUtilisateur(socketId, utilisateurId, nom, idOeuvre) {
  utilisateurs[socketId] = { 
    id: utilisateurId.toString(),
    nom, 
    idOeuvre 
  };
}

// Obtenir un utilisateur par socket ID
function obtenirUtilisateurParSocket(socketId) {
  return utilisateurs[socketId];
}

// Retirer un utilisateur
function retirerUtilisateur(socketId) {
  delete utilisateurs[socketId];
}

// Obtenir tous les utilisateurs (optionnellement par idOeuvre)
function obtenirUtilisateursEnLigne(idOeuvre = null) {
  if (idOeuvre) {
    return Object.values(utilisateurs).filter(u => u.idOeuvre === idOeuvre);
  }
  return Object.values(utilisateurs);
}

module.exports = {
  ajouterUtilisateur,
  obtenirUtilisateurParSocket,
  retirerUtilisateur,
  obtenirUtilisateursEnLigne
};