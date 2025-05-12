// Services pour gérer les médias
export class MediaService {
    private baseUrl: string;
    private token: string | null;
  
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
      this.token = localStorage.getItem('token'); // Récupérer le token d'authentification
    }
  
    // Méthode pour uploader un média
    async uploadMedia(file: File, nom: string, userId: string, oeuvreId:string,id_section:string): Promise<any> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('nom', nom);
      formData.append('id_utilisateur', userId);
      formData.append('id_oeuvre' ,oeuvreId);
      formData.append('id_section' ,id_section);
  
      try {
        const response = await fetch(`${this.baseUrl}/medias/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
          body: formData,
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Erreur lors de l\'upload du média:', error);
        throw error;
      }
    }
    
    async getMediasByOeuvre(oeuvreId: string): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/medias/oeuvre/${oeuvreId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error fetching media by oeuvre:', error);
        throw error;
      }
    }

    // Récupérer les médias d'une section
    async getMediasBySection(sectionId: string): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/medias/section/${sectionId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Erreur lors de la récupération des médias:', error);
        throw error;
      }
    }
  
    // Supprimer un média
    async deleteMedia(mediaId: string): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/medias/${mediaId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Erreur lors de la suppression du média:', error);
        throw error;
      }
    }
  }