import React from 'react';
import css from './LogoutModal.module.css';
interface LogoutModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className={css.modalOverlay} onClick={onClose}>
      <div className={css.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={css.modalTitle}>Confirmation de déconnexion</h3>
        <p className={css.modalText}>Êtes-vous sûr que vous voulez vous déconnecter?</p>
        <div className={css.buttonContainer}>
          <button className={css.cancelButton} onClick={onClose}>
            Annuler
          </button>
          <button className={css.logoutButton} onClick={onConfirm}>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;