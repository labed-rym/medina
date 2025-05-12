import { useState, ReactElement, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for button navigation
import "../../../App.css";
import css from './Home.module.css';

function Home(): ReactElement {
  // Add useNavigate hook for the "Voir Tous" button
  const navigate = useNavigate();
  
  // Track the current position index for each image (0 = left, 1 = middle, 2 = right)
  const [imagePositions, setImagePositions] = useState<number[]>([0, 1, 2]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  /**
   * Handles the hover event and rotates images in a circular way
   * @param hoveredPosition - Index of the position that was hovered (0=left, 1=middle, 2=right)
   */
  const handleHover = (hoveredPosition: number): void => {
    // Only trigger circular movement when hovering left or right positions
    // and when not currently animating
    if (hoveredPosition === 1 || isAnimating) return;
    
    setIsAnimating(true);
    
    // Create circular movement based on which position was hovered
    if (hoveredPosition === 0) { // Left position
      // Circular shift: each image moves one position clockwise
      setImagePositions(prev => {
        // Map each image to its new position
        return prev.map(pos => (pos + 1) % 3);
      });
    } else if (hoveredPosition === 2) { // Right position
      // Circular shift: each image moves one position counter-clockwise
      setImagePositions(prev => {
        // Map each image to its new position
        return prev.map(pos => (pos + 2) % 3); // +2 is equivalent to -1 in modulo 3
      });
    }
  };
  
  // Clear the animating state after transitions complete
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Match this to your CSS transition duration
    
    return () => clearTimeout(timer);
  }, [imagePositions]);
  
  /**
   * Gets the caption text for an image
   * @param index - The index of the image
   * @returns The appropriate caption for the image
   */
  const getCaption = (index: number): string => {
    switch(index) {
      case 0: return 'Recherche Par Wilaya';
      case 1: return 'Recherche Par Type';
      case 2: return 'Recherche Par Periode';
      default: return 'Recherche';
    }
  };
  
  // Image sources with corresponding page routes
  const imageData: Array<{ src: string; path: string }> = [
    { src: "/images/Algeria (1) (1).jpg", path: "/recherche/Wilaya1" },
    { src: "/images/Constantine-Algeria (1).jpg", path: "/recherche/categorie1" },
    { src: "/images/download (11) (1).jpg", path: "/recherche/periode1" }
  ];

  const getPositionClass = (positionIndex: number): string => {
    switch(positionIndex) {
      case 0: return 'left';
      case 1: return 'middle';
      case 2: return 'right';
      default: return 'left';
    }
  };

  /**
   * Handles click on image container
   * @param imageIndex - The index of the clicked image
   */
  const handleClick = (imageIndex: number): void => {
    // If not in middle position, don't navigate, just move to middle
    const positionIndex = imagePositions[imageIndex];
    if (positionIndex !== 1) {
      handleHover(positionIndex);
    }
    // If already in middle, navigation will occur via the Link component
  };
  
  /**
   * Handles click on "Voir Tous" button
   * Navigates to the main search page
   */
  const handleVoirTousClick = (): void => {
    navigate('/recherche1'); // Navigate to the search page
  };

  return (
    <div className={css.filters}>
      <button 
        className={css.tous} 
        onClick={handleVoirTousClick}
      >
        Voir Tous
      </button>
     
      {imageData.map((data, imageIndex: number) => {
        const positionIndex = imagePositions[imageIndex];
        const positionClass = getPositionClass(positionIndex);
        
        return (
          <div 
            key={imageIndex}
            className={`image-container ${positionClass}`}
            onMouseEnter={(): void => handleHover(positionIndex)}
            onClick={(): void => handleClick(imageIndex)}
          >
            {/* Wrap with Link component for navigation */}
            <Link 
              to={data.path} 
              className={css.imageLink}
              // Only allow actual navigation when in the middle position
              onClick={(e): void => {
                if (positionIndex !== 1) {
                  e.preventDefault();
                }
              }}
            >
              <img 
                className={css.image}
                src={data.src} 
                alt={`Algeria image ${imageIndex + 1}`} 
              />
              <div className="cover">
                {positionIndex === 1 && (
                  <div className={css.overlayText}>{getCaption(imageIndex)}</div>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default Home;