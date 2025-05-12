import React, { useState, useEffect, useRef } from 'react';
import styles from './RechercheCategorie.module.css';

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
   
    return () => {
      // Cleanup if needed
    };
  }, []);
 
  return null;
};

// Define project type
interface Project {
  id: number;
  image: string;
  title: string;
  category: string;
  region: string;
  year: number;
  wilaya: string;
}

const RechercheCategorie: React.FC = () => {
  // State for form inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
 
  // Categories list
  const categories = [
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
    "Zaouïa",
    "Jardins/Espaces verts historiques",
    "Bibliothèque historique",
    "Site archéologique",
    "Pont historique",
    "Port/Structure maritime",
    "Édifice colonial"
  ];
 
  // Updated projects with category information
  const projects = [
    {
      id: 1,
      image: "/images/background.png",
      title: "Mosquée Sidi Boumediene",
      category: "Mosquée",
      region: "Ouest",
      year: 1339,
      wilaya: "Tlemcen"
    },
    {
      id: 2,
      image: "/images/background2.png",
      title: "Palais du Bey",
      category: "Palais",
      region: "Est",
      year: 1713,
      wilaya: "Constantine"
    },
    {
      id: 3,
      title: "Arc de Triomphe de Lambèse",
      category: "Monument",
      region: "Est",
      year: 540,
      image: "/images/background3.png",
      wilaya: "Batna"
    },
    {
      id: 4,
      title: "Grande Mosquée d'Alger",
      category: "Mosquée",
      region: "Centre",
      year: 1612,
      image: "/images/background4.png",
      wilaya: "Alger"
    },
    {
      id: 5,
      title: "Mausolée Royal de Maurétanie",
      category: "Mausolée/Tombeau",
      region: "Centre",
      year: 500,
      image: "/images/background5.jpg",
      wilaya: "Tipaza"
    },
    {
      id: 6,
      title: "Citadelle de la Casbah",
      category: "Forteresse/Citadelle",
      region: "Centre",
      year: 1700,
      image: "/images/back1.jpg",
      wilaya: "Alger"
    },
    {
      id: 7,
      title: "Mosquée Emir Abdelkader",
      category: "Mosquée",
      region: "Est",
      year: 2018,
      image: "/images/background3.png",
      wilaya: "Constantine"
    },
    {
      id: 8,
      title: "Villa Abd-el-Tif",
      category: "Maison traditionnelle",
      region: "Centre",
      year: 1930,
      image: "/images/background4.png",
      wilaya: "Alger"
    },
    {
      id: 9,
      title: "Timgad",
      category: "Site archéologique",
      region: "Est",
      year: 600,
      image: "/images/background5.jpg",
      wilaya: "Batna"
    },
    {
      id: 10,
      title: "Mosquée de Sidi Ramdane",
      category: "Mosquée",
      region: "Centre",
      year: 800,
      image: "/images/back1.jpg",
      wilaya: "Alger"
    }
  ];

  // Updated filter logic to check if project matches selected category
  const filteredProjects = projects.filter(project => {
    // Search filter works in real-time
    const matchesSearch = searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase());
   
    // Filter by category
    const matchesCategory = activeCategory === '' || project.category === activeCategory;
   
    return matchesSearch && matchesCategory;
  });

  // Reference to the category buttons container
  const categoryContainerRef = useRef<HTMLDivElement>(null);

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === activeCategory ? '' : category);
  };

  // Handle scroll buttons
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryContainerRef.current) {
      const scrollAmount = 200; // Adjust as needed
      const newPosition = direction === 'left'
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;
     
      categoryContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
     
      setScrollPosition(newPosition);
    }
  };

  // Handle project click
  const handleProjectClick = (project: Project) => {
    // You can add your own navigation logic here
    console.log(`Project clicked: ${project.title}`);
    // For example: navigate to a details page
    // router.push(`/projects/${project.id}`);
  };

  return (
    <>
      <ViewportMeta />
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Navigation and Search Section */}
          <div className={styles.navigationSection}>
            <div className={styles.navigationContent}>
              <div className={styles.backButtonContainer}>
                <button className={styles.backButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color='#33331a'>
                <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              </div>
             
              {/* Search */}
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Rechercher"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <div className={styles.searchIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color='#354618'>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
         
          {/* Category Filter Buttons */}
          <div className={styles.filtersSection}>
            <div className={styles.periodButtonsWrapper}>
              <button
                className={styles.periodNavButton}
                onClick={() => scrollCategories('left')}
                aria-label="Previous categories"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color='#354618'>
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
             
              <div className={styles.periodButtonsContainer} ref={categoryContainerRef}>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`${styles.periodButtonn} ${category === activeCategory ? styles.activePeriod : ''}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
             
              <button
                className={styles.periodNavButton}
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
          <div className={styles.projectsGrid}>
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className={styles.projectCard}
                onClick={() => handleProjectClick(project)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.projectImage}
                  onError={(e) => {
                    // Fallback for missing images
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/placeholder.png";
                    target.onerror = null;
                  }}
                />
                <div className={styles.projectTitle}>
                  {project.title} ({project.category})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RechercheCategorie;