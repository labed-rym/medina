import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import InscriptionForm from './verification';

function LandingPage() {
  const [showInscriptionPopup, setShowInscriptionPopup] = useState(false);
  const navigate = useNavigate();
  
  const openInscriptionPopup = () => {
    setShowInscriptionPopup(true);
  };
  
  const closeInscriptionPopup = () => {
    setShowInscriptionPopup(false);
  };
  
  const goToLogin = () => {
    navigate('/connexion');
  };
  
  return (
    <div className={styles.landingContainer}>
      {/* Main section with background pattern */}
      <div className={styles.heroSection}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className={styles.videoBackground}
        >
          <source src="src/modules/page/vd.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className={styles.contentSection}>
          <h1 className={styles.mainTitle}>Préserver l'Âme </h1>
          <h1 className={styles.mainTitl}>Architecturale de l'Algérie</h1>
          
          <p className={styles.description}>
            "Explorez et contribuez à la riche mosaïque du patrimoine algérien. Rejoignez-nous pour 
            documenter et préserver nos trésors architecturaux pour les générations futures." 
          </p>
          <div className={styles.buttonContainer}>
            <button className={styles.act} onClick={goToLogin}>Se Connecter</button>
            <button className={styles.acti} onClick={openInscriptionPopup}>S'inscrire</button> 
          </div>
        </div>
      
        {showInscriptionPopup && <InscriptionForm onClose={closeInscriptionPopup} />}
      </div>
    </div>
  );
}

export default LandingPage;