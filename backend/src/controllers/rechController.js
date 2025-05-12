const Oeuvre = require('../models/oeuvre');

async function rechercher(req, res) {
    try {
        const filtres = {
            motCle: req.query.motCle || null,
            categorie: req.query.categorie || null,
            wilaya: req.query.wilaya || null
        };

        console.log("Filtres reçus :", filtres);

        const resultats = await Oeuvre.rechercherOeuvres(filtres);

        console.log("Résultats retournés :", resultats);
        
        if (resultats.length === 0) {
            return res.status(200).json({ 
                message: "Aucun résultat trouvé",
                resultats: [] 
            });
        }

        return res.json(resultats);

    } catch (erreur) {
        console.error("Erreur complète :", erreur);
        return res.status(500).json({ 
            message: "Erreur serveur", 
            erreur: erreur.message 
        });
    }
}

module.exports = { rechercher };