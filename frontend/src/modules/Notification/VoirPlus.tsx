import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './VoirPlus.module.css';
import ChatterPopup from './ChatterPopup';


const VoirPlusPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showChatterPopup, setShowChatterPopup] = useState(false);
  const [status, setStatus] = useState<'en attente' | 'accepte' | 'refuse'>('en attente');
  const [notification, setNotification] = useState<any>(null);

  
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/notifications/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setNotification(data.notification);
            console.log("notification data:", data.notification);
          }
        })
        .catch(err => console.error("Error fetching notification:", err));
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAccept = () => {
    if (!id) return;
    
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:5000/api/notifications/accepter/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "utilisateur_id": userId
      },
    })
    .then(() => {
      setStatus('accepte');
      if (id) {
        localStorage.setItem(`notification_${id}_status`, 'accepte');
      }
      setTimeout(() => {
        console.log('Modification acceptée');
        navigate(-1);
      }, 1500);
    })
    .catch(err => console.error("Error accepting notification:", err));
  };

  const handleRefuse = () => {
    if (!id) return;
    
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:5000/api/notifications/refuser/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "utilisateur_id": userId
      },
    })
    .then(() => {
      setStatus('refuse');
      if (id) {
        localStorage.setItem(`notification_${id}_status`, 'refuse');
      }
      setTimeout(() => {
        console.log('Modification refusée');
        navigate(-1);
      }, 1500);
    })
    .catch(err => console.error("Error refusing notification:", err));
  };

  const handleChatterAccept = () => {
    console.log('Demande de chat envoyée');
    setShowChatterPopup(false);
  };

  
  const displayNotification = notification || {
    id: id,
    email:'',
    username: '',
    profession: '',
    type: '',
    contenu_original: '',
    contenu_nouveau: ''
  };

  return (
    <>
      {showChatterPopup && (
        <ChatterPopup 
          email={notification.email}
          onClose={() => setShowChatterPopup(false)}
          onAccept={handleChatterAccept}
        />
      )}
      
      <div className={styles.detailsContainer}>
        <div className={styles.detailsHeader}>
          <button onClick={handleBack} className={styles.backButton}>Retour</button>
          
          {status === 'en attente' ? (
            <>
              <button 
                className={styles.chatterButton}
                onClick={() => setShowChatterPopup(true)}
              >
                Chatter
              </button>
              <button className={styles.acceptButton} onClick={handleAccept}>
                Accepter
              </button>
              <button className={styles.refuserButton} onClick={handleRefuse}>
                Refuser
              </button>
            </>
          ) : (
            <div className={`${styles.statusMessage} ${status === 'accepte' ? styles.accepte : styles.refuse}`}>
              {status === 'accepte' ? 'Notification acceptée' : 'Notification refusée'}
            </div>
          )}
        </div>
        <div className={styles.editDetails}>
          <div className={styles.detailsContent}>
            <div className={styles.originalModification}>
              {displayNotification.contenu_original}
            </div>
            <div className={styles.newModification}>
              {displayNotification.contenu_nouveau}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoirPlusPage;