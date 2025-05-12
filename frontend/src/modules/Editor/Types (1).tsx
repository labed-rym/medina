
export interface Comment {
  id: number;
  contenu: string;
  selection: string;
  position: {
    start: number;
    end: number;
  };
  utilisateur_id: string;
  date_creation: Date | string;
  section:string;
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

