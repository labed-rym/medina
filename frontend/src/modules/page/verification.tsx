import { useNavigate } from 'react-router-dom';
import style from './verification.module.css';

function InscriptionForm({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  const handleVisiteur = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose(); // Ferme le popup
    navigate('/inscription-visiteur'); 
  };

  const handleProfessionnel = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose(); // Ferme le popup
    navigate('/inscription-professionnelle'); 
  };

  return (
    <>
      {/* Clicking outside closes the popup */}
      <div className={style.verifyOverlay} onClick={onClose}></div>

      {/* Popup container */}
      <div className={style.verifyContainer}>
        <span className={style.verifyCloseBtn} onClick={onClose}>&times;</span>

        <h1 className={style.verifyTitle}>INSCRIPTION</h1>

        <form className={style.verifyForm}>
          <h3 className={style.verifySubtitle}>Souhaitez-vous vous inscrire en tant que  visiteur  </h3>
          <h4 className={style.verifySubtitle2}> ou professionnel ?</h4>

          <div className={style.verifyButtons}>
          <button className={style.but} onClick={handleVisiteur}>Visiteur</button>
          <button className={style.butt} onClick={handleProfessionnel}>Professionnel</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default InscriptionForm;