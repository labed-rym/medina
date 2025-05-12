// Service pour gérer les annotations
export class AnnotationService {
    private baseUrl: string;
    private token: string | null;
  
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
      this.token = localStorage.getItem('token'); // Récupérer le token d'authentification
    }
  
    // Ajouter une annotation
    async addAnnotation(
      oeuvre_id: string,
      utilisateur_id: string,
      texte: string,
      section: string,
      position_x: number = 0,
      position_y: number = 0,
      largeur: number = 100,
      hauteur: number = 50
    ): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/annotations`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            oeuvre_id,
            utilisateur_id,
            texte,
            section,
            position_x,
            position_y,
            largeur,
            hauteur
          }),
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'annotation:', error);
        throw error;
      }
    }
  
    // Récupérer les annotations d'une oeuvre
    async getAnnotationsByOeuvre(oeuvreId: string): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/annotations/oeuvre/${oeuvreId}`, {
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
        console.error('Erreur lors de la récupération des annotations:', error);
        throw error;
      }
    }
  
    // Récupérer les annotations d'une section spécifique
    async getAnnotationsBySection(oeuvreId: string, section: string): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/annotations/oeuvre/${oeuvreId}/section/${section}`, {
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
        console.error('Erreur lors de la récupération des annotations de section:', error);
        throw error;
      }
    }
  
    // Modifier une annotation
    async updateAnnotation(
      annotationId: string,
      texte: string,
      position_x?: number,
      position_y?: number,
      largeur?: number,
      hauteur?: number
    ): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/annotations/${annotationId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            texte,
            position_x,
            position_y,
            largeur,
            hauteur
          }),
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Erreur lors de la modification de l\'annotation:', error);
        throw error;
      }
    }
  
    // Supprimer une annotation
    async deleteAnnotation(annotationId: string): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/annotations/${annotationId}`, {
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
        console.error('Erreur lors de la suppression de l\'annotation:', error);
        throw error;
      }
    }
  }
  