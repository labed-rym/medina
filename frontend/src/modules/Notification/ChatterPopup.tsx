
import React from 'react';
import styles from './ChatterPopup.module.css';
import { FaCopy } from 'react-icons/fa';

interface ChatterPopupProps {
  email: string;
  onClose: () => void;
  onAccept: () => void;
}

const ChatterPopup: React.FC<ChatterPopupProps> = ({ 
  email, 
  onClose,

}) => {
  const fullEmail = `${email}@gmail.com`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullEmail)
      .then(() => {
        alert('Adresse email copiée!');
      })
      .catch(err => {
        console.error('Erreur lors de la copie: ', err);
      });
  };

  return (
    <>
      <div className={styles.popupOverlay} onClick={onClose}></div>
      
      <div className={styles.popupContainer}>
        <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        
        
        
        <div className={styles.content}>
          
          
          <div className={styles.separator}></div>
          
          <div className={styles.emailContainer}>
            <p className={styles.emailInfo}>
            L’adresse e-mail de user  est: 
              <span className={styles.emailText} onClick={copyToClipboard}>
                {fullEmail}
                <FaCopy  />
                   </span>
              
              {email} user va resevoir votre demande de chat
            </p>
          </div>
          
         
        </div>
      </div>
    </>
  );
};

export default ChatterPopup;

