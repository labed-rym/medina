import styles from "./Help.module.css";

import './Help.module.css';
function Help(){
    return <>
    <div id="container"className={styles.container}>
        
        <div id="content" className={styles.supportContent}>
            <h1>AIDE ET SUPPORT</h1>
            <section>
                <h2 className={styles.heading2}>1. Inscription et Connexion</h2>
                <p>Créer un compte</p>
                <ul>
                    <li>Cliquez sur S'inscrire en haut de la page.</li>
                    <li>Choisissez votre type de compte : Visiteur ou Professionnel.</li>
                    <li>Remplissez les informations demandées et validez votre inscription.</li>
                    <li>Un e-mail de confirmation vous sera envoyé.</li>
                </ul>
                <p>Se connecter</p>
                <ul>
                    <li>Saisissez votre adresse e-mail et mot de passe.</li>
                    <li>En cas d'oubli, utilisez Mot de passe oublié ? pour réinitialiser votre accès.</li>
                </ul>
            </section>
            <section>
                <h2 className={styles.heading2}>2. Gestion des Documents</h2>
                <p>Ajouter un document</p>
                <ul>
                    <li>Accédez à votre Espace Personnel.</li>
                    <li>Cliquez sur Télécharger un document.</li>
                    <li>Sélectionnez le fichier et ajoutez une description.</li>
                    <li>Validez pour le partager avec la communauté.</li>
                </ul>
                <p>Télécharger un document</p>
                <ul>
                    <li>Recherchez le document dans la bibliothèque.</li>
                    <li>Assurez-vous d'avoir les droits d'accès requis.</li>
                    <li>Cliquez sur Télécharger pour enregistrer le fichier.</li>
                </ul>
                <p>Modifier ou Supprimer un document</p>
                <ul>
                    <li>Rendez-vous dans Mes Documents.</li>
                    <li>Cliquez sur Modifier pour changer les détails.</li>
                    <li>Pour supprimer, utilisez l'option Supprimer (action irréversible).</li>
                </ul>
            </section>
            <section className={styles.thirdSection}>
                <h2 className={styles.heading2}>3. Collaboration et Partage</h2>
                <p>Commenter un document</p>
                <ul>
                    <li>Ouvrez le document et utilisez la section Commentaires.</li>
                    <li>Ajoutez vos remarques et suggestions.</li>
                </ul>
                <p>Partager un document</p>
                <ul>
                    <li>Cliquez sur Partager et générez un lien.</li>
                    <li>Définissez les autorisations (lecture seule, modification, etc.).</li>
                </ul>
                <p>Suivre un document</p>
                <ul>
                    <li>Ajoutez un document à vos favoris pour être notifié des mises à jour.</li>
                </ul>
            </section>
            <section>
                <h2 className={styles.heading2}>4. Problèmes Techniques</h2>
                <p>Impossible de télécharger un document ?</p>
                <ul>
                    <li>Vérifiez vos droits d'accès.</li>
                    <li>Assurez-vous que le fichier est toujours disponible.</li>
                </ul>
                <p>Problème de connexion ?</p>
                <ul>
                    <li>Assurez-vous que vos identifiants sont corrects.</li>
                    <li>Réinitialisez votre mot de passe si nécessaire.</li>
                </ul>
                <p>Autres problèmes ?</p>
                <ul>
                    <li>Contactez notre support via le formulaire de contact.</li>
                </ul>
            </section>
            <section>
                <h2 className={styles.heading2}>5. Sécurité et Confidentialité</h2>
                <p>Confidentialité des documents</p>
                <ul>
                    <li>Vos documents sont protégés et accessibles uniquement selon vos autorisations.</li>
                    <li>Consultez notre Politique de confidentialité pour plus de détails.</li>
                </ul>
                <p>Bonnes pratiques</p>
                <ul>
                    <li>Respectez les droits d'auteur.</li>
                    <li>Ne partagez pas d'informations sensibles publiquement.</li>
                </ul>
            </section>
        </div>
        <div className='line'></div>
    </div>
    <footer>
        <p>&copy; 2025 Medina - Tous droits réservés</p>
    </footer>  </>
}
export default Help;