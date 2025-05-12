import React, { useState, useEffect } from 'react';
import { BiFontFamily, BiFontSize } from 'react-icons/bi';
import { MdMargin } from 'react-icons/md';

interface Project {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  wilaya: string;
  year: number;
}

// Embedded styles directly in the component file
const styles = {
  container: {
    backgroundColor: '#f4f6f2',
    minHeight: 'calc(100vh - 55px)',
    padding: '120px 20px 20px 20px',
    display: 'block',
    width: '100%',
    
    boxSizing: 'border-box' as const,
    position: 'relative' as const
    
  },
  contentWrapper: {
    width: '90%',
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative' as const
  },
  navSection: {
    position: 'fixed',
    marginTop:'-65px',
   
    width: '100%',
    backgroundColor: '#f4f6f2',
    zIndex: 100,
    padding: '40px 0'
  
  },
  navContent: {
    width: '90%',
    
    maxWidth: '1200px',
    margin: '14px auto',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0'
  },
  backButton: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: '2px solid #33331a',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  },
  searchContainer: {
  position: 'absolute',
  left: '35%',
  bottom: '40%',
  transform: 'translateX(-50%)',
  width: '30%',
  maxWidth: '500px'
  },
  searchInput: {
  fontWeight: 600,
  width: '100%',
  padding: '10px 15px',
  borderRadius: '9px',
  border: '1.6px solid #354618',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: '#f4f6f2',
  fontFamily: "'Amiri', serif",
  fontSize: '1.125rem',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  },
  searchIcon: {
    position: 'absolute',
    right: '-65px',
    top: '65%',
    transform: 'translateY(-50%)',
    color: '#354618',
    pointerEvents: 'none'
  },
  filtersSection: {
    position:'fixed',
    width: '100%',
    height:'10%',
    zIndex: 100,
    maxWidth: '1200px',
    backgroundColor: '#f4f6f2',
    marginTop: '7.5%',
    marginBottom: '10%',
    marginLeft:'6%',
    padding: '0 60px 0 30px',
  },
  
  selectInput: {
    
    marginLeft:'7%',
    padding: '0 60px 0 30px',
    borderRadius: '19px',
    margin:' 0 40px 0 0',
    border: '1.5px solid #354618',
    backgroundColor: 'transparent',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '20px',
    fontFamily: "'Amiri', serif",
    color: '#354618',
    fontSize: '20px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    height: '50px',
    minWidth: '200px',
    flex: '1',
    cursor: 'pointer'
  },
  selectInputt: {
    margin:' 0 40px 0 0',
    padding: '0 30px 0 30px',
    borderRadius: '19px',
    border: '1.5px solid #354618',
    backgroundColor: 'transparent',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '20px',
    fontFamily: "'Amiri', serif",
    color: '#354618',
    fontSize: '20px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    height: '50px',
    minWidth: '200px',
    
    cursor: 'pointer'
  },
  selectInputtt: {
  
    padding: '0 30px 0 30px',
    borderRadius: '19px',
    left: '75%',
    border: '1.5px solid #354618',
    backgroundColor: 'transparent',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '20px',
    fontFamily: "'Amiri', serif",
    color: '#354618',
    fontSize: '20px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    height: '50px',
    minWidth: '200px',
    flex: '1',
    cursor: 'pointer'
  },
  projectsGrid: {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '4%',
  width: '96%',
  margin: '200px 0 0 80px',
  
  backgroundColor: '#f4f6f2',
  },
  projectCard: {
    
    width: '100%',
    height:'100%',
    backgroundColor: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    aspectRatio: '1/1' as any
  },
  projectCardHover: {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.7)'
  },
  projectImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '0',
    padding: '0',
    margin: '0',
    display: 'block'
  },
  projectTitle: {
    position: 'absolute' as const,
    bottom: '0',
    left: '0',
    width: '100%',
    padding: '15px 0',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    textAlign: 'center' as const,
    fontFamily: "'Amiri', serif",
    fontSize: '1.1rem',
    opacity: 0,
    transform: 'translateY(100%)',
    transition: 'opacity 0.3s, transform 0.3s'
  },
  projectTitleVisible: {
    opacity: 1,
    transform: 'translateY(0)'
  },
  loading: {
    textAlign: 'center' as const,
    fontSize: '1.2rem',
    padding: '20px',
    width: '100%',
    marginTop: '350px',
    marginLeft:'-50%'
  },
  error: {
    textAlign: 'center' as const,
    color: 'red',
    fontSize: '1.2rem',
    padding: '20px',
    width: '100%',
    marginTop: '150px',
    marginLeft: '580px'
  },
  noResults: {
    gridColumn: 'span 3',
    textAlign: 'center' as const,
    fontSize: '18px',
    padding: '20px',
    width: '100%'
     
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#f4f6f2',
    borderRadius: '12px',
    padding: '20px',
    width: '40%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative' as const,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
  },
  closeButton: {
    position: 'absolute' as const,
    top: '5px',
    right: '15px',
    backgroundColor:'#354618',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    padding: 0,
    
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    }
   
  },
  titlle: {
    margin:' 10px 0 0 10px',
    color:'#354618',
    fontSize:'30px',
    BiFontFamily:'Amiri',
    
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '30px',
    marginTop: '20px'
  },
  
  modalDetails: {
    BiFontFamily:'Amiri',
    fontSize: '24px'
  },
  buttu:{
    width:'20%',
    marginLeft:'35%',
    color:'#f4f6f2',
    BiFontSize:'22px',
    BiFontFamily:'Amiri',
    padding:'10px 20px',
     backgroundColor: '#354618',
     borderRadius: '9px',
  border: '1.6px solid #354618'
  }
};

// Add a component to set viewport meta tag
const ViewportMeta: React.FC = () => {
  useEffect(() => {
    // Check if viewport meta tag exists
    let viewport = document.querySelector('meta[name="viewport"]');
   
    // If it doesn't exist, create it
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
   
    // Set the content attribute
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
  }, []);
 
  return null;
};

const RechercheTout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  const periodRanges = [
    { id: '', label: 'Toutes périodes', start: null, end: null },
    { id: '430-647', label: '430-647', start: 430, end: 647 },
    { id: '647-909', label: '647-909', start: 647, end: 909 },
    { id: '909-1152', label: '909-1152', start: 909, end: 1152 },
    { id: '1152-1516', label: '1152-1516', start: 1152, end: 1516 },
    { id: '1516-1830', label: '1516-1830', start: 1516, end: 1830 },
    { id: '1830-1900', label: '1830-1900', start: 1830, end: 1900 },
    { id: '1900-1962', label: '1900-1962', start: 1900, end: 1962 },
    { id: '1962-1970', label: '1962-1970', start: 1962, end: 1970 },
    { id: '1970-1980', label: '1970-1980', start: 1970, end: 1980 },
    { id: '1980-1990', label: '1980-1990', start: 1980, end: 1990 },
    { id: '1990-2000', label: '1990-2000', start: 1990, end: 2000 },
    { id: '2000-aujourdhui', label: '2000-aujourd\'hui', start: 2000, end: new Date().getFullYear() }
  ];

  const wilayas = [
    { id: '', label: 'Toutes les wilayas' },
    { id: 'Adrar', label: 'Adrar' },
    { id: 'Chlef', label: 'Chlef' },
    { id: 'Laghouat', label: 'Laghouat' },
    { id: 'Oum El Bouaghi', label: 'Oum El Bouaghi' },
    { id: 'Batna', label: 'Batna' },
    { id: 'Béjaïa', label: 'Béjaïa' },
    { id: 'Biskra', label: 'Biskra' },
    { id: 'Béchar', label: 'Béchar' },
    { id: 'Blida', label: 'Blida' },
    { id: 'Bouira', label: 'Bouira' },
    { id: 'Tamanrasset', label: 'Tamanrasset' },
    { id: 'Tébessa', label: 'Tébessa' },
    { id: 'Tlemcen', label: 'Tlemcen' },
    { id: 'Tiaret', label: 'Tiaret' },
    { id: 'Tizi Ouzou', label: 'Tizi Ouzou' },
    { id: 'Alger', label: 'Alger' },
    { id: 'Djelfa', label: 'Djelfa' },
    { id: 'Jijel', label: 'Jijel' },
    { id: 'Sétif', label: 'Sétif' },
    { id: 'Saïda', label: 'Saïda' },
    { id: 'Skikda', label: 'Skikda' },
    { id: 'Sidi Bel Abbès', label: 'Sidi Bel Abbès' },
    { id: 'Annaba', label: 'Annaba' },
    { id: 'Guelma', label: 'Guelma' },
    { id: 'Constantine', label: 'Constantine' },
    { id: 'Médéa', label: 'Médéa' },
    { id: 'Mostaganem', label: 'Mostaganem' },
    { id: 'M\'Sila', label: 'M\'Sila' },
    { id: 'Mascara', label: 'Mascara' },
    { id: 'Ouargla', label: 'Ouargla' },
    { id: 'Oran', label: 'Oran' },
    { id: 'El Bayadh', label: 'El Bayadh' },
    { id: 'Illizi', label: 'Illizi' },
    { id: 'Bordj Bou Arreridj', label: 'Bordj Bou Arreridj' },
    { id: 'Boumerdès', label: 'Boumerdès' },
    { id: 'El Tarf', label: 'El Tarf' },
    { id: 'Tindouf', label: 'Tindouf' },
    { id: 'Tissemsilt', label: 'Tissemsilt' },
    { id: 'El Oued', label: 'El Oued' },
    { id: 'Khenchela', label: 'Khenchela' },
    { id: 'Souk Ahras', label: 'Souk Ahras' },
    { id: 'Tipaza', label: 'Tipaza' },
    { id: 'Mila', label: 'Mila' },
    { id: 'Aïn Defla', label: 'Aïn Defla' },
    { id: 'Naâma', label: 'Naâma' },
    { id: 'Aïn Témouchent', label: 'Aïn Témouchent' },
    { id: 'Ghardaïa', label: 'Ghardaïa' },
    { id: 'Relizane', label: 'Relizane' },
    { id: 'Timimoun', label: 'Timimoun' },
    { id: 'Bordj Badji Mokhtar', label: 'Bordj Badji Mokhtar' },
    { id: 'Ouled Djellal', label: 'Ouled Djellal' },
    { id: 'Béni Abbès', label: 'Béni Abbès' },
    { id: 'In Salah', label: 'In Salah' },
    { id: 'In Guezzam', label: 'In Guezzam' },
    { id: 'Touggourt', label: 'Touggourt' }
  ];

  const categories = [
    { id: '', label: 'Toutes catégories' },
    { id: 'Mosquée', label: 'Mosquée' },
    { id: 'Palais', label: 'Palais' },
    { id: 'Monument', label: 'Monument' },
    { id: 'Monuments historiques', label: 'Monuments historiques' },
    { id: 'Maisons traditionnelles', label: 'Maisons traditionnelles' },
    { id: 'Casbahs et fortifications', label: 'Casbahs et fortifications' },
    { id: 'Sites archéologiques', label: 'Sites archéologiques' },
    { id: 'Architecture saharienne', label: 'Architecture saharienne' },
    { id: 'Bâtiments coloniaux', label: 'Bâtiments coloniaux' }
  ];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');

      const periodeRange = periodRanges.find(p => p.id === selectedPeriode);
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('motCle', searchQuery);
      if (selectedCategory) params.append('categorie', selectedCategory);
      if (selectedWilaya) params.append('wilaya', selectedWilaya);
      if (periodeRange && periodeRange.start) {
        params.append('yearStart', periodeRange.start.toString());
        params.append('yearEnd', periodeRange.end!.toString());
      }
      console.log("params:",params.toString());
      const url = `http://localhost:5000/api/recherche/oeuvres?${params.toString()}`;
      
      const response = await fetch(url);
     
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const data = await response.json();
      console.log("response :",data);
      // Handle different response formats
      let projectsData = [];
     
      if (data.data && Array.isArray(data.data)) {
        projectsData = data.data;
      } else if (Array.isArray(data)) {
        projectsData = data;
      } else {
        console.error('Unexpected API response format:', data);
        throw new Error('Format de rÃ©ponse API invalide');
      }
      
      // Transforme les URLs relatives en absolues
      const formattedData = projectsData.map((item: any) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        title: item.title || item.nom || item.name || 'Sans titre',
        imageUrl: `http://localhost:5000/uploads/${item.photo}`,
        category: item.category || item.categorie || 'Non spÃ©cifiÃ©',
        year: item.year || item.annee || new Date().getFullYear(),
        wilaya: item.wilaya || 'N/A'
      }));
      
      setProjects(formattedData);
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur API:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProjects, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedWilaya, selectedPeriode]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Calculate responsive grid columns based on screen width
  const getGridColumns = () => {
    const width = window.innerWidth;
    if (width < 768) return 'repeat(1, 1fr)';
    if (width < 992) return 'repeat(2, 1fr)';
    return 'repeat(3, 1fr)';
  };

  const [gridColumns, setGridColumns] = useState(getGridColumns());

  useEffect(() => {
    const handleResize = () => {
      setGridColumns(getGridColumns());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <ViewportMeta />
      <div style={styles.container}>
        {/* Navigation Section */}
        <div style={styles.navSection}>
          <div style={styles.navContent}>
            <button
              style={styles.backButton}
              onClick={() => window.history.back()}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color='#33331a'>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
           
            {/* Search */}
            
          </div>
          <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Rechercher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <div style={styles.searchIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color='#354618'>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
        </div>
       
        {/* Filters Section */}
        <div style={styles.filtersSection}>
         
            
          <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              style={styles.selectInput}
            >
              {periodRanges.map(periode => (
                <option key={periode.id} value={periode.id}>{periode.label}</option>
              ))}
            </select>


            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              style={styles.selectInputt}
            >
              {wilayas.map(wilaya => (
                <option key={wilaya.id} value={wilaya.id}>{wilaya.label}</option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.selectInputtt}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
            
           
            
            
          
        </div>
       
        {/* Projects Grid */}
        {loading ? (
          <div style={styles.loading}>
            Chargement...
          </div>
        ) : error ? (
          <div style={styles.error}>
            Erreur: {error}
          </div>
        ) : (
          <div style={{
            ...styles.projectsGrid,
            gridTemplateColumns: gridColumns
          }}>
            {projects.length > 0 ? (
              projects.map(project => (
                <div 
                  key={project.id} 
                  style={{
                    ...styles.projectCard,
                    ...(hoveredCardId === project.id ? styles.projectCardHover : {})
                  }}
                  onClick={() => handleProjectClick(project)}
                  onMouseEnter={() => setHoveredCardId(project.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    style={styles.projectImage}
                   /* onError={(e) => {
                      (e.target as HTMLImageElement).src = 'http://localhost:5000/images/placeholder.png';
                    }}*/
                  />
                  <div style={{
                    ...styles.projectTitle,
                    ...(hoveredCardId === project.id ? styles.projectTitleVisible : {})
                  }}>
                    {project.title}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noResults}>
                Aucun résultat trouvé
              </div>
            )}
          </div>
        )}

        {selectedProject && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={closeModal}>
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#f4f6f2" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
              <h2 style={styles.titlle} >{selectedProject.title}</h2>
              <div style={styles.modalBody}>
                
                <div style={styles.modalDetails}>
                  <p><strong>Catégorie:</strong> {selectedProject.category}</p>
                  <p><strong>Wilaya:</strong> {selectedProject.wilaya}</p>
                  <p><strong>Année:</strong> {selectedProject.year}</p>
                </div>
                <buttom style={styles.buttu}> Voir Le Projet</buttom>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RechercheTout;