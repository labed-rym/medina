import style from './validation.module.css';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React from 'react';

function ValidationForm() {
    const navigate = useNavigate();
    const { token } = useParams(); // rÃ©cupÃ¨re le token depuis lâ€™URL
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email"); // rÃ©cupÃ¨re lâ€™email depuis ?email=

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const password1 = (document.getElementById('mot_de_passe1') as HTMLInputElement).value;
        const password2 = (document.getElementById('mot_de_passe2') as HTMLInputElement).value;

        if (password1 !== password2) {
            alert("Les mots de passe ne correspondent pas!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/auth/reinitialiser-mot-de-passe/${token}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    nouveau_mot_de_passe: password1
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert("Mot de passe rÃ©initialisÃ© avec succÃ¨s!");
            navigate('/');
        } catch (error) {
            if (error instanceof Error) {
                alert("Erreur : " + error.message);
            } else {
                alert("Une erreur inconnue s'est produite.");
            }
        }
    };

    return (
        <div className={style.container}>
            <h1>RÃ©initialisez votre mot de passe</h1>
            <form onSubmit={handleSubmit}>
                <div className={style.inputs}>
                    <div className={style.mot_de_passe1}>
                        <h3>Nouveau Mot De Passe</h3>    
                        <input type="password" id="mot_de_passe1" required />
                    </div>

                    <div className={style.mot_de_passe2}>
                        <h3>Confirmer Le Mot De Passe</h3>      
                        <input type="password" id="mot_de_passe2" required />
                    </div>
                </div>
                <button className={style.utti} type="submit">RÃ©initialiser le mot de passe</button>
            </form>
        </div>
    );
}

export default ValidationForm;
