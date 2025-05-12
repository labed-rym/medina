import style from './ResetPasswordForm.module.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

function ResetPasswordForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!email) {
            setError("Veuillez entrer votre adresse email");
            setLoading(false);
            return;
        }

        try {
            // Appel Ã  l'endpoint motDePasseOublie du backend
            const response = await fetch('http://localhost:5000/api/auth/mot-de-passe-oublie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de la demande de rÃ©initialisation");
            }

            setSuccess("Un email de rÃ©initialisation a Ã©tÃ© envoyÃ© Ã  votre adresse !");
            
            // Optionnel : Redirection aprÃ¨s un dÃ©lai
           /* setTimeout(() => {
                navigate('/connexion');
            }, 3000); */

        } catch (error) {
            console.error('Erreur:', error);
            setError(error instanceof Error ? error.message : "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    const goToLogin = () => {
        navigate('/connexion');
    };

    return (
        <div className={style.containe}>
            <h2>REINITIALISATION DU MOT DE PASSE</h2>
            {error && <div className={style.error}>{error}</div>}
            {success && <div className={style.success}>{success}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className={style.inputGroup}>
                    <label className={style.lab} htmlFor="email">Adresse Email</label>
                    <input className={style.input}
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Votre adresse email"
                    />
                </div>
                <div className={style.loginLink}>
                    <a onClick={goToLogin} style={{cursor: 'pointer'}}>
                        Retour A la page de connexion
                    </a>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className={loading ? style.loadingButton : ''}
                >
                    {loading ? 'Envoi en cours...' : 'Envoyer les instructions'}
                </button>

                
            </form>
        </div>
    );
}

export default ResetPasswordForm;