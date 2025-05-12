import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';
import AdminStatisticsCharts from './AdminStatisticsCharts';

interface UserData {
  name: string;
  profession: string;
  profileImage: string;
  email: string;
  phone: string;
}

interface UserRequest {
  id: number;
  name: string;
  speciality: string;
  email: string;
  institution: string;
  orderNumber: string;
  agencyName: string;
  phone: string;
  gender: string;
  certificate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface StatisticItem {
  name: string;
  count: number;
  color: string;
}

interface NewAdminData {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'homme' | 'femme' | '';
  email: string;
  password: string;
  confirmPassword: string;
}

const AdminDashboard: React.FC = () => {
  const [adminData, setAdminData] = useState<UserData>({
    name: 'USER NAME',
    profession: 'ADMIN',
    profileImage: localStorage.getItem("userPhoto") ? `http://localhost:5000/${localStorage.getItem("userPhoto")}` : '/images/profile-placeholder.png',
    email: 'admin@example.com',
    phone: '0123456789'
  });

  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
  const [statisticsData, setStatisticsData] = useState<StatisticItem[]>([]);
  const [activePanel, setActivePanel] = useState<'notifications' | 'statistics' | 'addAdmin'>('notifications');
  const [popupRequestId, setPopupRequestId] = useState<number | null>(null);
  const [newAdminData, setNewAdminData] = useState<NewAdminData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formMessage, setFormMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const token = localStorage.getItem('token');

  const fetchFichesUtilisateur = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/fiches/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des fiches");
      }
  
      const data = await response.json();
      console.log("Fiches récupérées :", data);
      return data;
    } catch (error) {
      console.error("Erreur lors du fetch des fiches :", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/demandes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Erreur lors du chargement des demandes');
        const data = await response.json();
        setUserRequests(data.map((item: any, index: number) => ({
          id: item.utilisateur_id,
          name: item.nom,
          speciality: item.specialite,
          email: item.email,
          institution: item.etablissement_origine,
          orderNumber: item.numero_ordre,
          agencyName: item.nom_agence,
          phone: item.telephone,
          gender: item.genre,
          certificate: item.certificat,
          status: 'pending',
        })));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchStatistics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/statistiques', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Erreur lors du chargement des statistiques');
        const data = await response.json();
       
        setStatisticsData([
          { name: 'Visiteurs', count: Number(data.visiteurs), color: '#5B1D15' },
          { name: 'Historiens', count: Number(data.historiens), color: '#354618' },
          { name: 'Architectes', count: Number(data.architectes), color: '#5D8C4E' },
          { name: 'Archéologues', count: Number(data.archeologues), color: '#C6D0B7' },
        ]);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchRequests();
    fetchStatistics();
  }, [token]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Afficher l'image en preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setAdminData({
          ...adminData,
          profileImage: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
  
      // Préparer l'upload immédiat
      const formData = new FormData();
      formData.append('photo', file);
  
      try {
        const response = await fetch(`http://localhost:5000/api/modifyaccount/modifier/${localStorage.getItem('userEmail')}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Erreur lors de l\'upload');
        }
  
        const result = await response.json();
        console.log('Profil mis à jour:', result);
  
      } catch (error) {
        console.error('Erreur upload photo:', error);
      }
    }
  };
  
  const handleRequestAction = async (requestId: number, action: 'approved' | 'rejected') => {
    const request = userRequests.find(r => r.id === requestId);
    if (!request) return;

    const url = action === 'approved'
      ? `http://localhost:5000/api/admin/valider/${request.email}`
      : `http://localhost:5000/api/admin/refuser/${request.email}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la validation/refus');

      setUserRequests(userRequests.map(req =>
        req.id === requestId ? { ...req, status: action } : req
      ));
      setPopupRequestId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (
      !newAdminData.firstName ||
      !newAdminData.lastName ||
      !newAdminData.birthDate ||
      !newAdminData.gender ||
      !newAdminData.email ||
      !newAdminData.password
    ) {
      setFormMessage({ text: 'Veuillez remplir tous les champs', type: 'error' });
      return;
    }
    
    if (newAdminData.password !== newAdminData.confirmPassword) {
      setFormMessage({ text: 'Les mots de passe ne correspondent pas', type: 'error' });
      return;
    }
    
    try {
      // This is where you would make an API call to add the new admin
      // Example API call (need to be adjusted to match your backend):
      const response = await fetch('http://localhost:5000/api/admin/ajouterAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          prenom: newAdminData.firstName,
          nom: newAdminData.lastName,
          date_naissance: newAdminData.birthDate,
          genre: newAdminData.gender,
          email: newAdminData.email,
          mot_de_passe: newAdminData.password,
          role: 'admin'
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'administrateur');
      }
      
      // Reset form and show success message
      setNewAdminData({
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      setFormMessage({ text: 'Administrateur ajouté avec succès', type: 'success' });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setFormMessage(null);
      }, 5000);
      
    } catch (error) {
      console.error('Erreur:', error);
      setFormMessage({ text: 'Erreur lors de l\'ajout de l\'administrateur', type: 'error' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePopup = (requestId: number | null) => {
    setPopupRequestId(requestId);
  };

  const getStatusText = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved':
        return 'Notification acceptée';
      case 'rejected':
        return 'Notification refusée';
      default:
        return 'Voir plus';
    }
  };

  return (
    <div className={styles.adminDashboard}>
      {/* Left panel - simplified with profile image, username, email and phone */}
      <div className={styles.leftPanel}>
        <div className={styles.profileImageSection}>
          <div className={styles.imageContainer}>
            <img 
              src={adminData.profileImage} 
              alt="Admin Profile" 
              className={styles.profileImage} 
            />
            <label htmlFor="imageUpload" className={styles.editOverlay}>
              <svg className={styles.editIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </label>
            <input 
              type="file" 
              id="imageUpload" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className={styles.fileInput} 
            />
          </div>
          <h2 className={styles.userName}>{adminData.name}</h2>
          <p className={styles.userProfession}>{adminData.profession}</p>
          
          {/* Added contact information */}
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <svg className={styles.contactIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span className={styles.phone}>{adminData.phone}</span>
              
            </div>
            <div className={styles.contactItem}>
              <svg className={styles.contactIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span className={styles.contactText}>{adminData.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Admin dashboard */}
      <div className={styles.rightPanel}>
        <div className={styles.tabsContainer}>
          <div 
            className={`${styles.tab} ${activePanel === 'notifications' ? styles.activeTab : ''}`}
            onClick={() => setActivePanel('notifications')}
          >
            <span>Notification</span>
          </div>
          <div 
            className={`${styles.tab} ${activePanel === 'statistics' ? styles.activeTab : ''}`}
            onClick={() => setActivePanel('statistics')}
          >
            <span>STATISTICS</span>
          </div>
          <div 
            className={`${styles.tab} ${activePanel === 'addAdmin' ? styles.activeTab : ''}`}
            onClick={() => setActivePanel('addAdmin')}
          >
            <span>AJOUTER ADMIN</span>
          </div>
        </div>

        {/* Notifications Panel */}
        {activePanel === 'notifications' && (
          <div className={styles.notificationsPanel}>
            {userRequests.map(request => (
              <div key={request.id} className={styles.notificationCard}>
                <div className={styles.notificationHeader}>
                  <p className={styles.notificationText}>
                    Une nouvelle demande d'inscription a été reçue.
                  </p>
                  {request.status === 'pending' ? (
                    <button 
                      className={styles.viewMoreBtn}
                      onClick={() => togglePopup(request.id)}
                    >
                      Voir plus
                    </button>
                  ) : (
                    <p className={`${styles.statusText} ${
                      request.status === 'approved' ? styles.approvedText : styles.rejectedText
                    }`}>
                      {getStatusText(request.status)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* User Request Popup */}
        {popupRequestId !== null && (
          <div className={styles.popupOverlay} onClick={() => togglePopup(null)}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
              <div className={styles.popupHeader}>
                <h3 className={styles.popupHeaderr} >Détails de la demande</h3>
                <button className={styles.closeBtnn} onClick={() => togglePopup(null)}>×</button>
              </div>
              
              {userRequests.find(r => r.id === popupRequestId) && (
                <div className={styles.popupContent}>
                  {(() => {
                    const request = userRequests.find(r => r.id === popupRequestId)!;
                    return (
                      <div className={styles.requestForm}>
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Nom</label>
                            <p>{request.name}</p>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Spécialité</label>
                            <p>{request.speciality}</p>
                          </div>
                        </div>
                        
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Email</label>
                            <p>{request.email}</p>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Établissement d'origine</label>
                            <p>{request.institution}</p>
                          </div>
                        </div>
                        
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Numéro d'Ordre</label>
                            <p>{request.orderNumber}</p>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Nom de l'agence</label>
                            <p>{request.agencyName}</p>
                          </div>
                        </div>
                        
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Numéro de téléphone</label>
                            <p>{request.phone}</p>
                          </div>
                          <div className={styles.formGroup}>
                            <label>Genre</label>
                            <p>{request.gender}</p>
                          </div>
                        </div>
                        
                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label>Certificat</label>
                            <div className={styles.certificateContainer}>
                              <p>{request.certificate}</p>
                              <button 
                                className={styles.viewCertBtn}
                                onClick={async () => {
                                  const fiches = await fetchFichesUtilisateur(request.id);
                                  if (fiches) {
                                    window.open(`http://localhost:5000/uploads/${fiches[0].fichier_pdf}`, '_blank');
                                  } else {
                                    alert("Aucun certificat trouvé pour cet utilisateur.");
                                  }
                                }}
                              >
                                Voir le certificat
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.validateBtn}
                            onClick={() => handleRequestAction(request.id, 'approved')}
                          >
                            Valider
                          </button>
                          <button 
                            className={styles.rejectBtn}
                            onClick={() => handleRequestAction(request.id, 'rejected')}
                          >
                            Refuser
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics Panel */}
        {activePanel === 'statistics' && (
          <div className={styles.statisticsPanel}>
            {/* Updated Charts Component */}
            <AdminStatisticsCharts statisticsData={statisticsData} />
            
            {/* Original bar chart */}
            <div className={styles.chartContainer}>
              <div className={styles.chart}>
                {statisticsData.map((item, index) => (
                  <div key={index} className={styles.barContainer}>
                    <div className={styles.barLabel}>{item.name}</div>
                    <div className={styles.barWrapper}>
                      <div 
                        className={styles.bar} 
                        style={{ 
                          width: `${(item.count / Math.max(...statisticsData.map(d => d.count))) * 100}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                      <span className={styles.barValue}>{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Admin Panel */}
        {activePanel === 'addAdmin' && (
          <div className={styles.addAdminPanel}>
            <h3 className={styles.addAdminTitle}>Ajouter un nouvel administrateur</h3>
            
            {formMessage && (
              <div className={`${styles.formMessage} ${formMessage.type === 'success' ? styles.successMessage : styles.errorMessage}`}>
                {formMessage.text}
              </div>
            )}
            
            <form onSubmit={handleAddAdmin} className={styles.addAdminForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">Prénom</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={newAdminData.firstName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Prénom"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Nom</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={newAdminData.lastName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Nom"
                  />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="birthDate">Date de naissance</label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={newAdminData.birthDate}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.genderLabel}>Genre</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="gender"
                        value="homme"
                        checked={newAdminData.gender === 'homme'}
                        onChange={handleInputChange}
                        className={styles.radioInput}
                      />
                      Homme
                    </label>
                    
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="gender"
                        value="femme"
                        checked={newAdminData.gender === 'femme'}
                        onChange={handleInputChange}
                        className={styles.radioInput}
                      />
                      Femme
                    </label>
                  </div>
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newAdminData.email}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="password">Mot de passe</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newAdminData.password}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Mot de passe"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={newAdminData.confirmPassword}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
              </div>
              
              <div className={styles.submitButtonContainer}>
                <button type="submit" className={styles.addAdminSubmitBtn}>
                  Ajouter l'administrateur
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;