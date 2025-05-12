import { Comment, User, ShareOptions } from './Types (1)';
import { CommentService } from "../../services/commentaires.services.tsx";
const API_BASE_URL='http://localhost:5000/api';
const commentService = new CommentService(API_BASE_URL);
// This is a placeholder service that would be implemented with WebSockets 
// or a real-time database like Firebase
export class CollaborationService {
  private documentId: string;
  private onUsersUpdate: (users: User[]) => void;
  private onCommentsUpdate: (comments: Comment[]) => void;
  private connectionStatus: 'connected' | 'connecting' | 'disconnected' = 'disconnected';
  

  constructor(
    documentId: string,
    onUsersUpdate: (users: User[]) => void,
    onCommentsUpdate: (comments: Comment[]) => void
  ) {
    this.documentId = documentId;
    this.onUsersUpdate = onUsersUpdate;
    this.onCommentsUpdate = onCommentsUpdate;
  }
// Add this method to your CollaborationService class
public updateSectionContent(section: string, content: string): void {
  if (this.connectionStatus !== 'connected') {
    console.warn('Not connected to collaboration service');
    return;
  }
  
  // In a real implementation, this would send the content update to your backend
  console.log(`Updating section "${section}" with new content`);
  
  // You would typically send this update to your server or directly to other users
  // For example, if using WebSockets:
  // this.socket.emit('section-update', { documentId: this.documentId, section, content });
  
  // For now, just log the update
  console.log('Section update:', { section, content });
}
  // Connect to the collaboration service
  public async connect(): Promise<boolean> {
    this.connectionStatus = 'connecting';
    console.log('Connecting to collaboration service...'); // Add this
    try {
      // Here you would establish a WebSocket connection or other real-time connection
      console.log(`Connecting to collaboration service for document ${this.documentId}`);
      
      // Simulate connection success after a short delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.connectionStatus = 'connected';
      
      // Simulate initial data load
      this.fetchActiveUsers();
      this.fetchComments();
      
      return true;
    } catch (error) {
      console.error('Failed to connect to collaboration service', error);
      this.connectionStatus = 'disconnected';
      return false;
    }
  }

  // Disconnect from the collaboration service
  public disconnect(): void {
    if (this.connectionStatus !== 'disconnected') {
      console.log(`Disconnecting from document ${this.documentId}`);
      this.connectionStatus = 'disconnected';
    }
  }

  private generateUserColor(userId: number): string {
    // Utiliser une valeur de hachage simple basée sur l'ID
    const hash = userId.toString().split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
  
    // Générer des composantes de couleur à partir du hachage
    const r = (hash * 13) % 256;
    const g = (hash * 17) % 256;
    const b = (hash * 19) % 256;
  
    // Convertir en hexadécimal et assurer le format à 2 chiffres
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  private async fetchActiveUsers(): Promise<void> {
    try {
      const response = await fetch(`http://localhost:5000/api/utilisateurs-en-ligne/contributeurs/${this.documentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch active users');
      }
  
      const users = await response.json();
      
      // Transformer les données du backend en format attendu par le frontend
      const formattedUsers: User[] = users.map((user: any) => ({
        id: user.utilisateur_id.toString(),
        name: `${user.prenom} ${user.nom}`,
        color: this.generateUserColor(user.utilisateur_id),
        isActive: true, // Vous pouvez ajuster cela si vous avez un statut en ligne
        role: user.role // Ajouter le rôle à l'interface User
      }));
  
      this.onUsersUpdate(formattedUsers);
    } catch (error) {
      console.error('Error fetching active users:', error);
      // Fallback aux mock users si nécessaire
      this.onUsersUpdate([]);
    }
  }
  // Mock method to fetch active users
  /*private fetchActiveUsers(): void {
    // In a real implementation, this would fetch data from your backend
    const mockUsers: User[] = [
      { id: 'user1', name: 'Alice', color: '#6200ee', isActive: true },
      { id: 'user2', name: 'Bob', color: '#03dac6', isActive: true },
      { id: 'user3', name: 'Charlie', color: '#ff0266', isActive: false }
    ];
    
    this.onUsersUpdate(mockUsers);
  }*/

  // Mock method to fetch comments
  /*private async fetchComments(): Promise<void> {
    // In a real implementation, this would fetch data from your backend
    /*const mockComments: Comment[] = [
      {
        id: 1,
        text: "Let's revise this section to be more clear.",
        selection: "Lorem ipsum dolor sit amet",
        position: { start: 0, end: 26 },
        author: "Alice",
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
        ,
        section: ''
      }
    ];
    const backendComments: Comment[] = await commentService.getCommentsByOeuvre(this.documentId);
    this.onCommentsUpdate(backendComments);
  }*/


    private async fetchComments(): Promise<void> {
      const backendComments: Comment[] = await commentService.getCommentsByOeuvre(this.documentId);
      
      // Transform backend comments to match frontend interface
      const formattedComments = backendComments.map(comment => ({
        id: comment.id,
        contenu: comment.contenu,
        selection: comment.selection || "",
        position: {
          start: comment.position?.start || 0,
          end: comment.position?.end || 0
        },
        section: comment.section || "",
        utilisateur_id: comment.utilisateur_id,
        date_creation: new Date(comment.date_creation)
      }));
    
      this.onCommentsUpdate(formattedComments);
    }
  // Add a new comment
  public async addComment(comment: Omit<Comment, 'id' | 'timestamp'>): Promise<Comment> {
    if (this.connectionStatus !== 'connected') {
      throw new Error('Not connected to collaboration service');
    }
    
    // In a real implementation, this would send the comment to your backend
    console.log('Adding comment', comment);
    
    // Create a complete comment with ID and timestamp
    const newComment: Comment = {
      ...comment,
      id: Date.now(),
      date_creation: new Date()
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Add the comment to our local state and notify listeners
    this.onCommentsUpdate([newComment]);
    
    return newComment;
  }

  // Generate a share link
  public async generateShareLink(options: ShareOptions): Promise<string> {
    if (this.connectionStatus !== 'connected') {
      throw new Error('Not connected to collaboration service');
    }
    
    // In a real implementation, this would interact with your backend
    console.log('Generating share link with options', options);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a mock URL
    const permissionPart = options.canEdit ? 'edit' : options.canComment ? 'comment' : 'view';
    return `https://youreditor.com/doc/${this.documentId}?permission=${permissionPart}`;
  }
}
