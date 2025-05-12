import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './Form.module.css';

const ProfessionnelForm = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const fileUpload = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const fileUpload2 = document.getElementById('file-upload2');
    const fileNameDisplay2 = document.getElementById('file-name2');
    if (fileUpload2 && fileNameDisplay2) {
      const handleFileChange = (event: Event) => {
          const target = event.target as HTMLInputElement; // Type assertion
          if (target) {
              const filename2 = target.value.split('\\').pop();
              if(filename2!=null){
                  fileNameDisplay2.textContent = filename2;
              }
              
          }
      }
    fileUpload2.addEventListener('change', handleFileChange);
    };
    if (fileUpload && fileNameDisplay) {
        const handleFileChange = (event: Event) => {
            const target = event.target as HTMLInputElement; // Type assertion
            if (target) {
                const filename = target.value.split('\\').pop();
                if(filename!=null){
                    fileNameDisplay.textContent = filename;
                }
                
            }
        };

        

      fileUpload.addEventListener('change', handleFileChange);

        
    }
}, []);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissanceJour: '',
    dateNaissanceMois: '',
    dateNaissanceAnnee: '',
    genre: '',
    telephone: '',
    email: '',
    specialite: '',
    etablissement_origine: '',
    numero_ordre: '',
    nom_agence: '',
    mot_de_passe: '',
    confirmezMotDePasse: '',
    ficheEtablissement: null as File | null,
    ficheAgence: null as File | null
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.files![0] }));
    }
  };

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleConfirmSubmit = async () => {
    setShowPopup(false);
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    
    // Ajout des champs texte
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value.toString());
      }
    });
  
    // Ajout des fichiers
    if (formData.ficheEtablissement) {
      formDataToSend.append('ficheEtablissement', formData.ficheEtablissement);
    }
    if (formData.ficheAgence) {
      formDataToSend.append('ficheAgence', formData.ficheAgence);
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/inscreption/professionnel', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur serveur');
      }
  
      const result = await response.json();
      console.log('Succès:', result);
      navigate('/professionnel/accueil');
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowPopup(false);
  };

  return (
    <div className={css.container}>
      <h1>INSCRIPTION PROFESSIONNEL</h1>
      {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
      
      {/* Popup de confirmation */}
      {showPopup && (
  <div className={css.popupOverlay}>
    <div className={css.popupContent}>
      <p>Vous devrez attendre que l'administrateur accepte votre inscription.</p>
      <div className={css.popupActions}>
        <button className={css.popupAction} onClick={handleConfirmSubmit}>Confirmer</button>
        <button onClick={() => setShowPopup(false)}>Annuler</button>
      </div>
    </div>
  </div>
)}

      
      <form onSubmit={handleSubmitClick}>
        {/* Champs texte */}
        <div className={css.flex}>
          <div className={css.nomPrenom}>
        <div className="form-group">
          <label>Nom <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Prénom <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
          <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
        </div>
        </div>

        {/* Date de naissance */}
        <div className="form-group">
          <label>Date de naissance <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
          <div className={css.dateGroup}>
         
          <input type="number" name="dateNaissanceJour" placeholder="JJ" min="1" max="31" 
                   value={formData.dateNaissanceJour} onChange={handleChange} required />
            <input type="number" name="dateNaissanceMois" placeholder="MM" min="1" max="12" 
                   value={formData.dateNaissanceMois} onChange={handleChange} required />
            <input type="number" name="dateNaissanceAnnee" placeholder="AAAA" min="1900" max={new Date().getFullYear()} 
                   value={formData.dateNaissanceAnnee} onChange={handleChange} required />
          </div>
        </div>

        {/* Autres champs */}
        <div className="form-group">
          <label>Genre <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
          <select name="genre" value={formData.genre} onChange={handleChange} required>
            <option value="">Genre</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
        </div>

        <div className="form-group">
          <label>Téléphone <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
          <input placeholder="----------"type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
          <input placeholder="***@email.com"type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Spécialité <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
          <select  name="specialite" value={formData.specialite}  onChange={handleChange} required >
                         <option value="">Spécialité</option>
                        <option value="architecte">Architècte</option>
                        <option value="historien">Historien</option>
                        <option value="archeologue">Archéologue</option>
                        </select>
        </div>

        <div className="form-group">
          <label>Établissement d'origine <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
          <input type="text" name="etablissement_origine" value={formData.etablissement_origine} onChange={handleChange} required />
        </div>
        <div className={css.bet}>
        <div className="form-group">
          <label>Numéro d'ordre (optionnel)</label>
          <input type="text" name="numero_ordre" value={formData.numero_ordre} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Nom de l'agence (optionnel)</label>
          <input type="text" name="nom_agence" value={formData.nom_agence} onChange={handleChange} />
        </div>
        </div>
        <div>
                    <label>Niveau d'éxpertise <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
                    <select required><option value="">Niveau d'éxpertise</option>
                        <option value="specialiste">Spécialiste</option>
                        <option value="expert">Expert (certifié par l'état)</option></select>
                </div>
        <div className="form-group">
          <label>Mot de passe <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
          <input type="password" name="mot_de_passe" value={formData.mot_de_passe} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Confirmez le mot de passe <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
          <input type="password" name="confirmezMotDePasse" value={formData.confirmezMotDePasse} onChange={handleChange} required />
        </div>

        {/* Fichiers */}
        <div className="form-group">
          <label>Fiche Établissement (PDF) <span style={{ color:'rgb(160, 19, 19)'}}>*</span></label>
          <label htmlFor="file-upload" className={css.customFileUpload}>
                        Parcourez vos fichiers
                      </label>
                      <input id="file-upload" type="file"  name="ficheEtablissement"   accept=".pdf" onChange={handleFileChange} required />
                      <span id="file-name"></span>
        </div>

        <div className="form-group">
          <label>Fiche Agence (PDF, optionnel)</label>
          <label htmlFor="file-upload2" className={css.customFileUpload}>
                        Parcourez vos fichiers
                      </label>
                      <input id="file-upload2" type="file"  name="ficheAgence"   accept=".pdf" onChange={handleFileChange} required />
                      <span id="file-name2"></span>
        </div>
        </div>
        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'Envoi en cours...' : "S'inscrire"}
        </button>
      </form>
    </div>
  );
};

export default ProfessionnelForm;