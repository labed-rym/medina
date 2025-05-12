const modelUtilisateurs = require('./src/models/utilisateursEnLigne');
const { gererConnexionUtilisateur, gererDeconnexionUtilisateur, diffuserUtilisateursEnLigne } = require('./src/controllers/utilisateursEnLigneController');

function initialiserSocket(io) {
  io.on('connection', (socket) => {
    console.log('Un client connecté :', socket.id);

    socket.on('rejoindre_projet', ({ utilisateurId, nom, projetId }) => {
      // Rejoindre la salle du projet
      socket.join(`projet-${projetId}`);
      
      // Gérer la connexion
      gererConnexionUtilisateur(socket, { utilisateurId, nom, projetId });
      
      // Diffuser les utilisateurs pour ce projet
      diffuserUtilisateursEnLigne(io, projetId);
    });

    socket.on('disconnect', () => {
      // Obtenir tous les projets concernés avant de déconnecter
      const projetsConcernes = modelUtilisateurs.obtenirProjetsParSocket(socket.id);
      
      // Gérer la déconnexion
      gererDeconnexionUtilisateur(socket);
      
      // Diffuser les mises à jour pour chaque projet concerné
      projetsConcernes.forEach(projetId => {
        diffuserUtilisateursEnLigne(io, projetId);
      });
    });
  });
}

module.exports = initialiserSocket;