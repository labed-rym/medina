// You can expand this later to do things like blacklisting tokens
exports.logout = async (req, res) => {
  try {
      // Right now it's stateless, so just respond success
      res.status(200).json({ message: "✅ Déconnexion réussie." });
  } catch (error) {
      console.error("Erreur de déconnexion:", error);
      res.status(500).json({ message: "❌ Erreur serveur lors de la déconnexion." });
  }
};
