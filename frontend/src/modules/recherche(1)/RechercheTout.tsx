import React, { useState } from 'react';
import styles from './RechercheTout.module.css';

const RechercheTout: React.FC = () => {
  // State for form inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  
  // State for active filters (applied after clicking the button)
  const [activeCategory, setActiveCategory] = useState('');
  const [activeRegion, setActiveRegion] = useState('');
  const [activePeriod, setActivePeriod] = useState('');
  
  // Fixed image paths - assuming images are in public/images folder
  const projects = [
    {
      id: 1,
      image: "/images/background.png",
      title: "Mosquée Sidi Boumediene",
      category: "mosquée",
      region: "Tlemcen",
      period: "Almohad and Zianid"
    },
    {
      id: 2,
      image: "/images/background2.png",
      title: "Palais du Bey",
      category: "palais",
      region: "Constantine",
      period: "Ottoman"
    },
    {
      id: 3,
      title: "Arc de Triomphe de Lambèse",
      category: "monument",
      region: "Batna",
      period: "Roman",
      image: "/images/background3.png"
    },
    {
      id: 4,
      title: "Grande Mosquée d'Alger",
      category: "mosquée",
      region: "Alger",
      period: "Ottoman",
      image: "/images/background4.png"
    },
    {
      id: 5,
      title: "Mausolée Royal de Maurétanie",
      category: "monument",
      region: "Tipaza",
      period: "Numidian/Berber",
      image: "/images/background5.jpg"
    },
    {
      id: 6,
      title: "Citadelle de la Casbah",
      category: "monument",
      region: "Alger",
      period: "Ottoman",
      image: "/images/back1.jpg"
    },
    {
      id: 7,
      title: "Mosquée Emir Abdelkader",
      category: "mosquée",
      region: "Constantine",
      period: "Contemporary Period",
      image: "/images/background3.png"
    },
    {
      id: 8,
      title: "Villa Abd-el-Tif",
      category: "palais",
      region: "Alger",
      period: "Late French Colonization",
      image: "/images/background4.png"
    },
    {
      id: 9,
      title: "Timgad",
      category: "monument",
      region: "Batna",
      period: "Roman",
      image: "/images/background5.jpg"
    },
    {
      id: 10,
      title: "Mosquée de Sidi Ramdane",
      category: "mosquée",
      region: "Alger",
      period: "Early Islamic/Umayyad",
      image: "/images/back1.jpg"
    }
  ];

  // Filtrer les projets - now using the active filters
  const filteredProjects = projects.filter(project => {
    // Search filter still works in real-time
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category, region, and period filters only apply after clicking the button
    const matchesCategory = activeCategory === '' || project.category === activeCategory;
    const matchesRegion = activeRegion === '' || project.region === activeRegion;
    const matchesPeriod = activePeriod === '' || project.period === activePeriod;
    
    return matchesSearch && matchesCategory && matchesRegion && matchesPeriod;
  });

  // Options pour les sélecteurs
  const regions = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouira",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Alger",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M'Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arreridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "Timimoun", 
    "Bordj Badji Mokhtar",  
    "Ouled Djellal",  
    "Béni Abbès",  
    "In Salah",  
    "In Guezzam",  
    "Touggourt"  
  ];
  const categories = ["mosquée", "palais", "monument"];
  const periods = ["Numidian/Berber", "Roman", "Vandal and Byzantine","Early Islamic/Umayyad", "Fatimid and Hammadid", "Almohad and Zianid","Ottoman", "Early French Colonization", "Late French Colonization","Early Independence", "Boumediene Era", "Transition Period", "Black Decade", "Contemporary Period"];

  // Apply filters when button is clicked
  const applyFilters = () => {
    setActiveCategory(selectedCategory);
    setActiveRegion(selectedRegion);
    setActivePeriod(selectedPeriod);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Back button */}
        <div className={styles.bac}>
        <div className={styles.backButtonContainer}>
          <button className={styles.backButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
        </div>
        {/* Filters */}
        <div className={styles.filtersContainer}>
          <div className={styles.filterItem}>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className={styles.selectInput}
            >
              <option value="">Par Wilaya</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterItem}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.selectInput}
            >
              <option value="">Par Categorie</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterItem}>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={styles.selectInput}
            >
              <option value="">Par Periode</option>
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
          
          <button 
            className={styles.filterButton}
            onClick={applyFilters}
          >
            FILTRER
          </button>
        </div>
        
        {/* Projects Grid - With improved hover effect */}
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
              <div className={styles.projectTitle}>{project.title}</div>
            </div>
          ))}
        </div>
        
        
      </div>
    </div>
  );
};

export default RechercheTout;
