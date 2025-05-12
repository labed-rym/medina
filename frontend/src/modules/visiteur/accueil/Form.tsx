import { useState } from "react";
import style from "./Form.module.css";

function Form() {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        mot_de_passe: "",
        confirmezMotDePasse: "",
        genre: "",
        date_naissance:"1990-06-15",
        type: "visiteur", // Default to "visiteur"
    });

    // Fonction pour gérer les changements d'input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fonction pour gérer l'inscription
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.mot_de_passe !== formData.confirmezMotDePasse) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/inscreption/visiteur", { 
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData) // Send the formData with type included
            });

            const result = await response.json();
            console.log("Réponse du serveur :", result);

            if (response.ok) {
                alert("Inscription réussie !");
            } else {
                alert(result.error || "Une erreur est survenue.");
            }
        } catch (error) {
            console.error("Erreur serveur :", error);
            alert("Erreur serveur.");
        }
    };

    return (
        <div className={style.container}>
            <h1>INSCRIPTION</h1>
            <form onSubmit={handleSubmit}>
                <div className={style.inputs}>
                    <div className={style.nom}>
                        <label htmlFor="nom">Nom *</label>
                        <input type="text" id="nom" name="nom" placeholder="Nom" required onChange={handleChange} />
                    </div>

                    <div className={style.prenom}>
                        <label htmlFor="prenom">Prénom *</label>
                        <input type="text" id="prenom" name="prenom" placeholder="Prénom" required onChange={handleChange} />
                    </div>

                    <div className={style.email}>
                        <label htmlFor="email">Email *</label>
                        <input type="email" id="email" name="email" placeholder="Email" required onChange={handleChange} />
                    </div>

                    <div className={style.mot_de_passe}>
                        <label htmlFor="mot_de_passe">Mot de passe *</label>
                        <input type="password" id="mot_de_passe" name="mot_de_passe" placeholder="Mot de passe" required onChange={handleChange} />
                    </div>

                    <div className={style.confirmezMotDePasse}>
                        <label htmlFor="confirmezMotDePasse">Confirmer mot de passe *</label>
                        <input type="password" id="confirmezMotDePasse" name="confirmezMotDePasse" placeholder="Confirmer mot de passe" required onChange={handleChange} />
                    </div>

                    <div className={style.genre}>
                        <label htmlFor="genre">Genre *</label>
                        <select id="genre" name="genre" required onChange={handleChange}>
                            <option value="">Sélectionnez votre genre</option>
                            <option value="homme">Homme</option>
                            <option value="femme">Femme</option>
                        </select>
                    </div>
                </div>

                <button type="submit">S'inscrire</button>
            </form>
        </div>
    );
}

export default Form;