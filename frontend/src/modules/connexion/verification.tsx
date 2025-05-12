import style from './verification.module.css'; // Make sure this file exists
import { useNavigate } from 'react-router-dom';
import React from 'react';

function VerificationForm() {
    const navigate = useNavigate();
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Navigate to validation page
        navigate('/validation');
    };
    
    return (
        <div className={style.container}>
            <h2>RÃ‰INITIALISEZ VOTRE MOT DE PASSE</h2>
            <form onSubmit={handleSubmit}>
                <h3 className={style.hthree}>Entrez le code que vous avez reÃ§u dans votre boÃ®te mail</h3>
                <div className={style.inputs}>
                    <div >
                        <input className={style.in}
                            type="text" 
                            id="mot_de_passe" 
                            name="mot_de_passe" 
                            placeholder="Code De Verification" 
                            required
                        />
                    </div>
                </div>
                <button className={style.u} type="submit">Envoyer Le Code</button>
            </form>
        </div>
    );
}

export default VerificationForm;