// Services pour gérer les commentaires
export class CommentService {
    private baseUrl: string;
    private token: string | null;
  
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
      this.token = localStorage.getItem('token'); // Récupérer le token d'authentification
    }
  
    // Ajouter un commentaire
    // Mettez à jour la méthode addComment pour accepter les paramètres supplémentaires
    async addComment(
      oeuvre_id: string, 
      utilisateur_id: string, 
      contenu: string,
      selection?: string,
      section?: string,
      position?: { start: number, end: number }
    ) {
      const response = await fetch(`${this.baseUrl}/commentaires`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          oeuvre_id,
          utilisateur_id,
          contenu,
          selection,
          section,
          position
        })
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de l\'ajout du commentaire');
      }
    
      return await response.json();
    }
    // Récupérer les commentaires d'une oeuvre
    async getCommentsByOeuvre(oeuvreId: string): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/commentaires/oeuvre/${oeuvreId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }const comments = await response.json();
    
        // Print the comments to console
        console.log('Comments from backend:', comments);
        
        return comments;
      } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
        throw error;
      }
    }
  
    // Modifier un commentaire
    async updateComment(commentId: string, content: string): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/commentaires/${commentId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contenu: content
          }),
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Erreur lors de la modification du commentaire:', error);
        throw error;
      }
    }
  
    // Supprimer un commentaire
    async deleteComment(commentId: string): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/commentaires/${commentId}`, {
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
        console.error('Erreur lors de la suppression du commentaire:', error);
        throw error;
      }
    }
  }