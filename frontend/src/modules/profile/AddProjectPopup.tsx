import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddProjectPopup.module.css';

interface AddProjectPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: ProjectFormData) => Promise<number | undefined>;
}

interface ProjectFormData {
  title: string;       // Correspond à 'titre' dans le backend
  description: string; // Correspond à 'description'
  category: string;    // Correspond à 'categorie'
  wilaya: string;      // Correspond à 'wilaya'
  period: string;      // Correspond à 'periode'
  image?: File;        // Doit être envoyé comme 'photo'
  statut?: string;
}

// List of all 58 wilayas in Algeria
const wilayasList = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", 
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", 
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", 
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", 
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", 
  "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", 
  "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane",
  "El M'ghair", "El Meniaa", "Ouled Djellal", "Bordj Badji Mokhtar", "Béni Abbès", 
  "Timimoun", "Touggourt", "Djanet", "In Salah", "In Guezzam"
];

// List of monument categories
const categoriesList = [
  "Mosquée", "Palais", "Monument", "Forteresse/Citadelle", "Théâtre antique", 
  "Hammam/Bain", "Mausolée/Tombeau", "Marché/Souk", "Medersa/École coranique", 
  "Remparts/Murailles", "Maison traditionnelle", "Zaouïa", 
  "Jardins/Espaces verts historiques", "Bibliothèque historique", 
  "Site archéologique", "Pont historique", "Port/Structure maritime", 
  "Édifice colonial"
];

const AddProjectPopup: React.FC<AddProjectPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: '',
    wilaya: '',
    period: '',
  });
  
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setHasUploadedImage(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const documentId = await onSubmit({
            ...formData,
            statut: 'brouillon' // Ajout conforme au backend
        });
        
        if (documentId) {
            navigate(`/editeur/${documentId}`);
        }
    } catch (error) {
        console.error('Error creating project:', error);
    } finally {
        setIsSubmitting(false);
        onClose();
    }
};
  const handleEditeur = async (e: React.MouseEvent) => {
    e.preventDefault();
    onClose(); // Ferme le popup
    const documentId = await onSubmit(formData);
    if (documentId) {
      navigate(`/editeur/${documentId}`);
  } else {
      console.error('No document ID received after project creation');
  }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2>Ajouter un nouveau projet</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Titre</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titre du projet"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.title}
              onChange={handleChange}
              placeholder="description du projet"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="category">Catégorie</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={styles.selectInput}
            >
              <option value="" disabled>Sélectionnez une catégorie</option>
              {categoriesList.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="wilaya">Wilaya</label>
            <select
              id="wilaya"
              name="wilaya"
              value={formData.wilaya}
              onChange={handleChange}
              required
              className={styles.selectInput}
            >
              <option value="" disabled>Sélectionnez une wilaya</option>
              {wilayasList.map(wilaya => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="period">Période</label>
            <input
              type="text"
              id="period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              placeholder="Période"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="projectImage">Image du projet</label>
            <div className={styles.imageUploadContainer}>
              {hasUploadedImage ? (
                <div className={styles.uploadStatus}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Image téléchargée</span>
                  <button 
                    type="button" 
                    className={styles.removeImageButton}
                    onClick={() => {
                      setHasUploadedImage(false);
                      setFormData(prev => ({ ...prev, image: undefined }));
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              ) : (
                <label className={styles.uploadLabel}>
                  <input 
                    type="file"
                    id="projectImage"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                  <div className={styles.uploadPlaceholder}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Télécharger une image</span>
                  </div>
                </label>
              )}
            </div>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isSubmitting}
            onClick={handleEditeur}
          >
            {isSubmitting ? 'Chargement...' : 'Voir le document'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProjectPopup;