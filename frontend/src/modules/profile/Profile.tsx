import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './profile.module.css';
import AddProjectPopup from './AddProjectPopup';

// Interface for user data
interface UserData {
  name: string;
  profession: string;
  profileImage: string;
  education: Education[];
  experience: Experience[];
}

interface Education {
  school: string;
  degree: string;
  location: string;
}

interface Experience {
  company: string;
  position: string;
  location: string;
}

interface Project {
  id: number;
  image: string;
  title: string;
  category: string;
  year: number;
  wilaya: string;
}

// Interface for backend profile data
interface ProfileData {
  nomComplet: string;
  role: string;
  specialite: string;
  photo: string;
  etablissement?: string;
  education?: string;
  experience?: string[];
}

// Interface for backend project data
interface BackendProject {
  id: number;
  titre: string;
  media: string;
  description: string;
  // Other project fields as needed
}

// Interface for project form data
interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  wilaya: string;
  period: string;
  image?: File;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  // State for user data
  const [userData, setUserData] = useState<UserData>({
    name: '',
    profession: '',
    profileImage: '',
    education: [],
    experience: []
  });

  // State for projects data
  const [projects, setProjects] = useState<Project[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search functionality for projects
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for project popup
  const [isAddProjectPopupOpen, setIsAddProjectPopupOpen] = useState(false);

  // Fetch profile data from API
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data: ProfileData = await response.json();
        
        // Update userData state with fetched profile data
        setUserData({
          name: data.nomComplet || '',
          profession: data.specialite || '',
          profileImage: data.photo ? `http://localhost:5000${data.photo}` : '',
          education: [
            {
              school: data.etablissement || '',
              degree: data.education || '',
              location: ''
            }
          ],
          experience: data.experience?.map(exp => ({
            company: exp,
            position: '',
            location: ''
          })) || []
        });

        // Fetch user projects
        await fetchUserProjects(userId);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchUserProjects = async (userId: string) => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile/oeuvre/utilisateur/${userId}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user projects');
        }
        
        const projectsData: BackendProject[] = await response.json();
        
        // Transform projects data to the format our components expect
        const formattedProjects = projectsData.map(project => ({
          id: project.id,
          title: project.titre || '',
          image: project.media ? `http://localhost:5000${project.media}` : '',
          category: project.description || '',
          year: 0, // Add mapping if year is available in the backend data
          wilaya: '' // Add mapping if wilaya is available in the backend data
        }));
        
        setProjects(formattedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      }
    };
    
    fetchProfileData();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show image preview right away
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData({
          ...userData,
          profileImage: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
      
      // Upload the image to the server
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const formData = new FormData();
          formData.append('photo', file);
          
          const response = await fetch(`http://localhost:5000/api/profile/${userId}/update-photo`, {
            method: 'POST',
            credentials: 'include',
            body: formData
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload profile image');
          }
          
          console.log('Profile image updated successfully');
        } catch (err) {
          console.error('Error uploading profile image:', err);
          setError('Failed to upload profile image. Please try again later.');
        }
      }
    }
  };

  // Handle section edit
  const handleSectionEdit = (section: string) => {
    console.log(`Edit ${section} section`);
    // Here you would implement the edit functionality for each section
    // For example, open a modal or form to edit the section data
  };
  
  // Filter projects based on search
  const filteredProjects = projects.filter(project => {
    return searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle project click
  const handleProjectClick = (project: Project) => {
    console.log(`Project clicked: ${project.title}`);
    // Navigate to the editor page with the project ID
    navigate(`/editeur/${project.id}`);
  };

  // Handle add project click
  const handleAddProject = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Open the add project popup
      setIsAddProjectPopupOpen(true);
    } else {
      setError('You must be logged in to add projects');
    }
  };

  // Handle project submission
  const handleSubmitProject = async (projectData: ProjectFormData): Promise<number | undefined> => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        setError('User not authenticated');
        return undefined;
    }

    try {
        const formData = new FormData();
        // Les noms des champs doivent correspondre exactement à ce que le backend attend
        formData.append('titre', projectData.title);
        formData.append('description', projectData.description || '');
        formData.append('categorie', projectData.category);
        formData.append('wilaya', projectData.wilaya);
        formData.append('periode', projectData.period || '');
        formData.append('id_createur', userId);
        formData.append('statut', 'brouillon'); // Champ requis par le backend

        // Le champ fichier doit s'appeler 'photo' comme dans le backend
        if (projectData.image) {
            formData.append('photo', projectData.image);
        }

        const response = await fetch(`http://localhost:5000/api/oeuvre`, {
            method: 'POST',
            credentials: 'include',
            body: formData
            // Ne pas mettre de header 'Content-Type' pour FormData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la création du projet');
        }

        const responseData = await response.json();
        
        // Le backend retourne l'ID dans responseData.data.id
        return responseData.data.id;

    } catch (error:any) {
        console.error('Erreur création projet:', error);
        setError(error.message || 'Échec de la création du projet');
        return undefined;
    }
};

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading profile data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-banner">
        <span>{error}</span>
        <button className="close-error" onClick={() => setError(null)}>×</button>
      </div>
    );
  }

  return (
      <div className={styles.profileContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.profileImageSection}>
            <div className={styles.imageContainer}>
              <img 
                src={userData.profileImage || '/images/profile-placeholder.png'} 
                alt="User Profile" 
                className={styles.profileImage} 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/profile-placeholder.png"; 
                  target.onerror = null;
                }}
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
            <h2 className={styles.userName}>{userData.name || 'User Name'}</h2>
            <p className={styles.userProfession}>{userData.profession || 'Profession'}</p>
          </div>

          <div className={styles.sectionContainer}>
            <div 
              className={styles.sectionOverlay} 
              onClick={() => handleSectionEdit('education')}
            >
              
            </div>
            
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>EDUCATION</h3>
            </div>
            <div className={styles.sectionContent}>
              {userData.education && userData.education.length > 0 ? (
                userData.education.map((edu, index) => (
                  <div className={styles.infoItem} key={index}>
                    <span className={styles.school}>{edu.school}</span>
                    {'  '}
                    <span className={styles.degree}>{edu.degree}</span>
                    {edu.location && (
                      <>
                       
                        <span className={styles.location}>{edu.location}</span>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className={styles.noData}>No education data available</p>
              )}
            </div>
          </div>

          <div className={styles.sectionContainer}>
            <div 
              className={styles.sectionOverlay} 
              onClick={() => handleSectionEdit('experience')}
            >
             
            </div>
            
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>EXPERIENCE</h3>
            </div>
            <div className={styles.sectionContent}>
              {userData.experience && userData.experience.length > 0 ? (
                userData.experience.map((exp, index) => (
                  <div key={index} className={styles.infoItem}>
                    <p className={styles.company}>{exp.company}</p>
                    {exp.position && <p className={styles.position}>{exp.position}</p>}
                    {exp.location && <p className={styles.location}>{exp.location}</p>}
                  </div>
                ))
              ) : (
                <p className={styles.noData}>No experience data available</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Rechercher un projet" 
              className={styles.searchInput} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className={styles.searchIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          <div className={styles.projectsGrid}>
            {filteredProjects.length > 0 ? (
              <>
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
                    <div className={styles.projectDetails}>
                      {project.title}
                    </div>
                  </div>
                ))}
                
                {/* Only show Add Project card when there are actual projects or no search query */}
                <div 
                  className={styles.addProjectCard}
                  onClick={handleAddProject}
                >
                  <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
              </>
            ) : searchQuery ? (
              <div className={styles.noProjects}>No projects found matching your search</div>
            ) : (
              <>
                <div className={styles.noProjects}>No projects found. Add your first project!</div>
                
                {/* Show Add Project card when there are no projects at all */}
                <div 
                  className={styles.addProjectCard}
                  onClick={handleAddProject}
                >
                  <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </div>

        <AddProjectPopup 
          isOpen={isAddProjectPopupOpen} 
          onClose={() => setIsAddProjectPopupOpen(false)} 
          onSubmit={handleSubmitProject}
        />
      </div>
  );
};

export default UserProfile;