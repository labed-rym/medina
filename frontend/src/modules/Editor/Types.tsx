export interface Comment {
  _id: string;
  utilisateur_id: string | { _id: string; username: string };
  oeuvre_id: string;
  contenu: string;
  createdAt: string;
  updatedAt?: string;
  // Ajoutez ces propriétés si nécessaires
  id?: string;
  text?: string;
  selection?: string;
  position?: { start: number; end: number };
  author?: string;
  timestamp?: Date | string;
}
  
  export interface TextRange {
    startOffset: number;
    endOffset: number;
  }
  
  export interface TextEditorProps {
    initialContent?: string;
    onContentChange?: (content: string) => void;
    readOnly?: boolean;
  }
  
  export interface User {
    id: string;
  name: string;
  color?: string; // For avatar background color
  isActive: boolean;
  major?: string;
  isAdmin?: boolean;
  role?: string;
  }
  
  export interface ShareOptions {
    canEdit: boolean;
    canComment: boolean;
    expiresAt?: Date;
    recipientEmail?: string;
  }
  
  