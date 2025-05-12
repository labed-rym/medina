import React, { useState, useEffect, useRef } from 'react';

interface Project {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  wilaya: string;
  year: number;
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#f4f6f2',
  minHeight: 'calc(100vh - 55px)',
  padding: '120px 20px 20px 20px',
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  position: 'relative'
};

const navSectionStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  right: '11%',
  width: '100%',
  backgroundColor: '#f4f6f2',
  zIndex: 100,
  padding: '40px 0'
};

const navContentStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  position: 'relative',
  height: '100px',
  backgroundColor: '#f4f6f2',
  alignItems: 'center',
  padding: '10px 15px'
};

const backButtonStyle: React.CSSProperties = {
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
};

const searchContainerStyle: React.CSSProperties = {
  position: 'absolute',
  left: '55%',
  bottom: '10%',
  transform: 'translateX(-50%)',
  width: '30%',
  maxWidth: '500px'
};

const searchInputStyle: React.CSSProperties = {
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
};

const searchIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: '-65px',
  top: '60%',
  transform: 'translateY(-50%)',
  color: '#354618',
  pointerEvents: 'none'
};

const filtersSectionStyle: React.CSSProperties = {
  position: 'fixed',
  top: '25%',
  left: 0,
  width: '100%',
  backgroundColor: '#f4f6f2',
  zIndex: 99,
  padding: '4% 0 0 0',
};

// New category button wrapper styles (similar to periodButtonsWrapperStyle)
const categoryButtonsWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '90%',
  margin: '0 auto'
};

// New category buttons container styles (similar to periodButtonsContainerStyle)
const categoryButtonsContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1%',
  overflowX: 'auto',
  maxWidth: 'calc(100% - 100px)',
  scrollBehavior: 'smooth',
  padding: '10px 0'
};

// Category button style function (similar to periodButtonStyle)
const categoryButtonStyle = (isActive: boolean): React.CSSProperties => ({
  width:'27%',
  padding: '8px 16px',
  borderRadius: '18px',
  backgroundColor: isActive ? '#354618' : '#f4f6f2',
  color: isActive ? '#f4f6f2' : '#354618',
  border: '1.5px solid #354618',
  cursor: 'pointer',
  fontFamily: "'Amiri', serif",
  fontSize: '18px',
  fontWeight: isActive ? 700 : 600,
  transition: 'all 0.3s ease',
  flexShrink: 0,
  margin: 0,
  boxShadow:'none',
  whiteSpace: 'nowrap',
  textAlign: 'center'
 
});

// Category navigation button styles (similar to periodNavButtonStyle)
const categoryNavButtonStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  flexShrink: 0,
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
  margin: '0 5px',
  border: 'none'
};

const projectsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '6%',
  width: '90%',
  maxWidth: '1200px',
  margin: '0 auto',
  paddingTop: '150px',
  backgroundColor: '#f4f6f2',
};

const projectCardStyle: React.CSSProperties = {
  backgroundColor: '#000',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  aspectRatio: '1/1' as any
};

const projectImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '0',
  padding: '0',
  margin: '0',
  display: 'block'
};

const projectTitleStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '0',
  left: '0',
  width: '100%',
  padding: '15px 0',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  textAlign: 'center',
  fontFamily: "'Amiri', serif",
  fontSize: '1.1rem'
};

const loadingStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '1.2rem',
  padding: '20px',
  width: '100%',
  marginTop: '50px'
};

const errorStyle: React.CSSProperties = {
  textAlign: 'center',
  color: 'red',
  fontSize: '1.2rem',
  padding: '20px',
  width: '100%',
  marginTop: '50px'
};

const noResultsStyle: React.CSSProperties = {
  gridColumn: 'span 3',
  textAlign: 'center',
  fontSize: '1.2rem',
  padding: '20px',
  width: '100%'
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

const RechercheCategorie: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Reference to the category buttons container for scrolling
  const categoryContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    "Toutes catégories",
    "Mosquée",
    "Palais",
    "Monument",
    "Forteresse/Citadelle",
    "Théâtre antique",
    "Hammam/Bain",
    "Mausolée/Tombeau",
    "Marché/Souk",
    "Medersa/École coranique",
    "Remparts/Murailles",
    "Maison traditionnelle",
    "Zaouéa",
    "Jardins/Espaces verts historiques",
    "Bibliothéque historique",
    "Site archéologique",
    "Pont historique",
    "Port/Structure maritime",
    "Édifice colonial"
  ];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:5000/api/recherche/oeuvres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categorie: selectedCategory === "Toutes catÃ©gories" ? "" : selectedCategory,
          motCle: searchQuery,
          wilaya: null,
          yearStart: null,
          yearEnd: null
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
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
  }, [searchQuery, selectedCategory]);

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle scroll buttons
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryContainerRef.current) {
      const scrollAmount = 200;
      const newScrollPosition = direction === 'left'
        ? categoryContainerRef.current.scrollLeft - scrollAmount
        : categoryContainerRef.current.scrollLeft + scrollAmount;
     
      categoryContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <ViewportMeta />
      <div style={containerStyle}>
        {/* Navigation Section */}
        <div style={navSectionStyle}>
          <div style={navContentStyle}>
            <button
              style={backButtonStyle}
              onClick={() => window.history.back()}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color='#33331a'>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
           
            {/* Search */}
            <div style={searchContainerStyle}>
              <input
                type="text"
                placeholder="Rechercher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
              />
              <div style={searchIconStyle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color='#354618'>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
          </div>
        </div>
       
        {/* Category Filter - Scrollable buttons replacing dropdown */}
        <div style={filtersSectionStyle}>
          <div style={categoryButtonsWrapperStyle}>
            <button
              style={categoryNavButtonStyle}
              onClick={() => scrollCategories('left')}
              aria-label="Previous categories"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color='#354618'>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
           
            <div style={categoryButtonsContainerStyle} ref={categoryContainerRef}>
              {categories.map(category => (
                <button
                  key={category}
                  style={categoryButtonStyle(category === selectedCategory)}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
           
            <button
              style={categoryNavButtonStyle}
              onClick={() => scrollCategories('right')}
              aria-label="Next categories"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color='#354618'>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
       
        {/* Projects Grid */}
        {loading ? (
          <div style={loadingStyle}>
            Chargement...
          </div>
        ) : error ? (
          <div style={errorStyle}>
            Erreur: {error}
          </div>
        ) : (
          <div style={projectsGridStyle}>
            {projects.length > 0 ? (
              projects.map(project => (
                <div key={project.id} style={projectCardStyle}>
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    style={projectImageStyle}
                  /* onError={(e) => {
                      (e.target as HTMLImageElement).src = 'http://localhost:5000/images/placeholder.png';
                    }}*/
                      />
                  <div style={projectTitleStyle}>
                    {project.title} ({project.category} - {project.wilaya} - {project.year})
                  </div>
                </div>
              ))
            ) : (
              <div style={noResultsStyle}>
                Aucun résultat trouvée
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RechercheCategorie;