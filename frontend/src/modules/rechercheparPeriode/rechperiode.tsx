import React, { useState, useEffect } from 'react';
import styles from './rechperiode.module.css';

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

// Function to parse "aujourd'hui" to current year
const parseYear = (yearStr: string): number => {
  if (yearStr === "aujourd'hui") {
    return new Date().getFullYear();
  }
  return parseInt(yearStr, 10);
};

// Function to check if a year falls within a period range
const isYearInPeriod = (year: number, periodRange: string): boolean => {
  const [startYearStr, endYearStr] = periodRange.split(' - ');
  const startYear = parseYear(startYearStr);
  const endYear = parseYear(endYearStr);
  
  return year >= startYear && year <= endYear;
};

const RecherchePeriode: React.FC = () => {
  // State for form inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [activePeriod, setActivePeriod] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Updated projects with specific years instead of period ranges
  const projects = [
    {
      id: 1,
      image: "/images/background.png",
      title: "MosquÃ©e Sidi Boumediene",
      category: "mosquÃ©e",
      region: "Tlemcen",
      year: 1339  // Year within 1152-1516
    },
    {
      id: 2,
      image: "/images/background2.png",
      title: "Palais du Bey",
      category: "palais",
      region: "Constantine",
      year: 1713  // Year within 1516-1830
    },
    {
      id: 3,
      title: "Arc de Triomphe de LambÃ¨se",
      category: "monument",
      region: "Batna",
      year: 540,  // Year within 430-647
      image: "/images/background3.png"
    },
    {
      id: 4,
      title: "Grande MosquÃ©e d'Alger",
      category: "mosquÃ©e",
      region: "Alger",
      year: 1612,  // Year within 1516-1830
      image: "/images/background4.png"
    },
    {
      id: 5,
      title: "MausolÃ©e Royal de MaurÃ©tanie",
      category: "monument",
      region: "Tipaza",
      year: 500,  // Year within 430-647
      image: "/images/background5.jpg"
    },
    {
      id: 6,
      title: "Citadelle de la Casbah",
      category: "monument",
      region: "Alger",
      year: 1700,  // Year within 1516-1830
      image: "/images/back1.jpg"
    },
    {
      id: 7,
      title: "MosquÃ©e Emir Abdelkader",
      category: "mosquÃ©e",
      region: "Constantine",
      year: 2018,  // Year within 2000-aujourd'hui
      image: "/images/background3.png"
    },
    {
      id: 8,
      title: "Villa Abd-el-Tif",
      category: "palais",
      region: "Alger",
      year: 1930,  // Year within 1900-1962
      image: "/images/background4.png"
    },
    {
      id: 9,
      title: "Timgad",
      category: "monument",
      region: "Batna",
      year: 600,  // Year within 430-647
      image: "/images/background5.jpg"
    },
    {
      id: 10,
      title: "MosquÃ©e de Sidi Ramdane",
      category: "mosquÃ©e",
      region: "Alger",
      year: 800,  // Year within 647-909
      image: "/images/back1.jpg"
    }
  ];

  // Updated periods according to your specifications
  const periods = [
    "430 - 647", 
    "647 - 909", 
    "909 - 1152",
    "1152 - 1516", 
    "1516 - 1830", 
    "1830 - 1900",
    "1900 - 1962", 
    "1962 - 1970", 
    "1970 - 1980",
    "1980 - 1990", 
    "1990 - 2000", 
    "2000 - aujourd'hui"
  ];

  // Updated filter logic to check if project year falls within the period range
  const filteredProjects = projects.filter(project => {
    // Search filter still works in real-time
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Updated period filter logic
    const matchesPeriod = activePeriod === '' || isYearInPeriod(project.year, activePeriod);
    
    return matchesSearch && matchesPeriod;
  });

  // Reference to the period buttons container
  const periodContainerRef = React.useRef<HTMLDivElement>(null);

  // Handle period click
  const handlePeriodClick = (period: string) => {
    setActivePeriod(period === activePeriod ? '' : period);
  };

  // Handle scroll buttons
  const scrollPeriods = (direction: 'left' | 'right') => {
    if (periodContainerRef.current) {
      const scrollAmount = 200; // Adjust as needed
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      periodContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
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
          
          {/* Period Filter Buttons */}
          <div className={styles.filtersSection}>
            <div className={styles.periodButtonsWrapper}>
              <button 
                className={styles.periodNavButton} 
                onClick={() => scrollPeriods('left')}
                aria-label="Previous periods"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color='#354618'>
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              
              <div className={styles.periodButtonsContainer} ref={periodContainerRef}>
                {periods.map(period => (
                  <button
                    key={period}
                    className={`${styles.periodButtonn} ${period === activePeriod ? styles.activePeriod : ''}`}
                    onClick={() => handlePeriodClick(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
              
              <button 
                className={styles.periodNavButton} 
                onClick={() => scrollPeriods('right')}
                aria-label="Next periods"
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
              <div key={project.id} className={styles.projectCard}>
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
                  {project.title} ({project.year})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecherchePeriode;