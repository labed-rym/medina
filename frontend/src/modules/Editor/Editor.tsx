/* <Type className="icon" {...({} as any)} />
<span>{currentFormat}</span>
<ChevronDown className="icon" {...({} as any)} />*/

"use client";

import React, { ChangeEvent, SyntheticEvent } from "react";
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "./Editor.css";
//import { useAuth } from './your-auth-provider';

// In your component
//const { user } = useAuth();
import { Comment, TextRange, User, ShareOptions } from "./Types";
import { CollaborationService } from "./CollaborationService";
import BoldIcon from "@mui/icons-material/FormatBold";
import ItalicIcon from "@mui/icons-material/FormatItalic";
import UnderlineIcon from "@mui/icons-material/FormatUnderlined";
import ListIcon from "@mui/icons-material/List";
import ListOrderedIcon from "@mui/icons-material/FormatListNumbered";
import AlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import AlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import AlignRightIcon from "@mui/icons-material/FormatAlignRight";
import AlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import Imagecon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import HistoryIcon from "@mui/icons-material/History";
import StarIcon from "@mui/icons-material/Star";
import FileTextIcon from "@mui/icons-material/Description";
import Share2Icon from "@mui/icons-material/Share";
import MessageSquareIcon from "@mui/icons-material/ChatBubbleOutline";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import TypographyIcon from "@mui/icons-material/TextFields"; // For the 'Type' icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // For 'ChevronDown'
import MoreVertIcon from "@mui/icons-material/MoreVert"; // For 'MoreVertical'
import TableIcon from "@mui/icons-material/TableChart";
import VideocamIcon from "@mui/icons-material/Videocam";
import SaveIcon from "@mui/icons-material/Save";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import { RefObject } from "react";
import { useParams } from 'react-router-dom';
import { CommentService } from "../../services/commentaires.services";
import { MediaService } from "../../services/media.services";

// Initialisation des services
const commentService = new CommentService("http://localhost:5000/api");
const mediaService = new MediaService("http://localhost:5000/api");

interface TextEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  readOnly?: boolean;
}

const ShareDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onShare: (email: string) => void;
}> = ({ isOpen, onClose, onShare }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus the email input when dialog opens
  React.useEffect(() => {
    if (isOpen && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple email validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    onShare(email);
    setEmail("");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2 className="dialog-title">Share Document</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Recipient Email
            </label>
            <input
              ref={emailInputRef}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter email address"
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="dialog-buttons">
            <button
              type="button"
              onClick={onClose}
              className="button button-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
interface ActiveUsersListProps {
  activeUsers: User[]; // Specify that activeUsers is an array of User objects
}

const ActiveUsersList: React.FC<ActiveUsersListProps> = ({ activeUsers }) => {
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const toggleUserList = () => {
    setIsUserListOpen(!isUserListOpen);
  };

  return (
    <div className="active-users-container">
      <div
        className="active-users"
        onClick={toggleUserList}
        title="Click to see all users"
      >
        {activeUsers
          .filter((user: User) => user.isActive)
          .map((user: User) => (
            <div
              key={user.id}
              className="user-avatar"
              title={user.name}
              style={{ backgroundColor: user.color }}
            >
              {user.name[0]}
            </div>
          ))}
      </div>

      {isUserListOpen && (
        <div className="users-list-popup">
          <div className="users-list-header">
            <h3>Active Users</h3>
            <button className="close-button" onClick={toggleUserList}>
              ×
            </button>
          </div>
          <ul className="users-list">
            {activeUsers.map((user: User) => (
              <li key={user.id} className="user-list-item">
                <div
                  className="user-avatar small"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name[0]}
                </div>
                <span className="user-name">{user.name}</span>
                <span
                  className={`status-indicator ${
                    user.isActive ? "online" : "offline"
                  }`}
                >
                  {user.isActive ? "Online" : "Offline"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
const saveIcon = () => <SaveIcon />;
const SaveAsPdfIcon = () => <PictureAsPdfIcon />;
const InsertVideoIcon = () => <VideocamIcon />;
const InsertArrayIcon = () => <TableIcon />;
const Bold = () => <BoldIcon />;
const Italic = () => <ItalicIcon />;
const Underline = () => <UnderlineIcon />;
const List = () => <ListIcon />;
const ListOrdered = () => <ListOrderedIcon />;
const AlignLeft = () => <AlignLeftIcon />;
const AlignCenter = () => <AlignCenterIcon />;
const AlignRight = () => <AlignRightIcon />;
const AlignJustify = () => <AlignJustifyIcon />;
const Type = () => <TypographyIcon />;
const ChevronDown = () => <ExpandMoreIcon />;
const Link = () => <LinkIcon />;
const ImageIcon = () => <Imagecon />;
const MoreVertical = () => <MoreVertIcon />;
const History = () => <HistoryIcon />;
const Star = () => <StarIcon />;
const FileText = () => <FileTextIcon />;
const Share2 = () => <Share2Icon />;
const MessageSquare = () => <MessageSquareIcon />;
const Undo = () => <UndoIcon />;
const Redo = () => <RedoIcon />;
const IconComponent = ({ children }: { children: React.ReactNode }) => (
  <span className="icon-fallback">{children}</span>
);

const Editor: React.FC<TextEditorProps> = ({
 // initialContent = "",
  //onContentChange,
  readOnly = false,
}) => {
  const { documentId } = useParams<{ documentId: string }>();
  const [documentTitle, setDocumentTitle] =
    useState<string>("Untitled document");

  const [showComments, setShowComments] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [fontSize, setFontSize] = useState<string>("11");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastSaved, setLastSaved] = useState<string>("All changes saved");
  const [showFontSizeDropdown, setShowFontSizeDropdown] =
    useState<boolean>(false);
  const [showFontFamilyDropdown, setShowFontFamilyDropdown] =
    useState<boolean>(false);
  const [showHeadingDropdown, setShowHeadingDropdown] =
    useState<boolean>(false);
  const [showImageDialog, setShowImageDialog] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [currentFormat, setCurrentFormat] = useState("Normal text");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fontSizeDropdownRef = useRef<HTMLDivElement>(null);
  const fontFamilyDropdownRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState([{ content: "", id: Date.now() }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageHeight, setPageHeight] = useState(842); // A4 height in pixels
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isUndoRedo, setIsUndoRedo] = useState<boolean>(false);
  const [showLinkDialog, setShowLinkDialog] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [linkText, setLinkText] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const [showArrayDialog, setShowArrayDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState<boolean>(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<HTMLVideoElement | null>(
    null
  );
  const [mediaList, setMediaList] = useState<{ [key: string]: any[] }>({
    architecture: [],
    histoire: [],
    archeologie: [],
    resources: []
  });
  const pageWidth = 816;
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedText, setSelectedText] = useState<string>("");
  const [collaborationStatus, setCollaborationStatus] =
    useState<string>("disconnected");

  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const collaborationServiceRef = useRef<CollaborationService | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Chargez les sections
        const sectionsResponse = await fetch(`http://localhost:5000/api/sections/${documentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (sectionsResponse.ok) {
          const sectionsData = await sectionsResponse.json();
          setEditorState({
            architecture: { content: sectionsData.architecture, history: [sectionsData.architecture], historyIndex: 0 },
            histoire: { content: sectionsData.histoire, history: [sectionsData.histoire], historyIndex: 0 },
            archeologie: { content: sectionsData.archeologie, history: [sectionsData.archeologie], historyIndex: 0 },
            ressources: { content: sectionsData.ressources, history: [sectionsData.ressources], historyIndex: 0 },
            isUndoRedo: false
          });
        }
  
        // Chargez les commentaires
        console.log("documentID:",documentId);
        const commentsResponse = await fetch(`http://localhost:5000/api/commentaires/oeuvre/${documentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        }
  
        // Chargez les médias si nécessaire
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
  
    loadInitialData();
  }, [documentId]);

  // Ajoutez ce useEffect après vos autres useEffect
useEffect(() => {
  const fetchMedia = async () => {
    if (!documentId) return;
    
    try {
      const mediaData = await mediaService.getMediasByOeuvre(documentId);
      console.log('Fetched media:', mediaData);
      
      // Organize media by section
      const organizedMedia: { [key: string]: any[] } = {
        architecture: [],
        histoire: [],
        archeologie: [],
        resources: []
      };
      
      mediaData.data.forEach((media: any) => {
        if (organizedMedia.hasOwnProperty(media.id_section)) {
          organizedMedia[media.id_section].push(media);
        }
      });
      
      setMediaList(organizedMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };
  
  fetchMedia();
}, [documentId]);

  useEffect(() => {
    if (!isUndoRedo) {
      const timer = setTimeout(() => {
        setLastSaved("All changes saved");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [content, isUndoRedo]);

  // Define types for each section's content
  interface EditorState {
    architecture: {
      content: string;
      history: string[];
      historyIndex: number;
    };
    histoire: {
      content: string;
      history: string[];
      historyIndex: number;
    };
    archeologie: {
      content: string;
      history: string[];
      historyIndex: number;
    };
    ressources: {
      content: string;
      history: string[];
      historyIndex: number;
    };
    isUndoRedo: boolean;
  }

  // Use useRef with proper typing
  const architectureRef = useRef<HTMLDivElement>(null);
  const histoireRef = useRef<HTMLDivElement>(null);
  const archeologieRef = useRef<HTMLDivElement>(null);
  const ressourcesRef = useRef<HTMLDivElement>(null);
  // Define a proper type for your sections mapping
  interface SectionRefs {
    architecture: RefObject<HTMLElement>;
    histoire: RefObject<HTMLElement>;
    archeologie: RefObject<HTMLElement>;
    ressources: RefObject<HTMLElement>;
  }

  // Create a unified state object
  const [editorState, setEditorState] = useState<EditorState>({
    architecture: { content: "", history: [""], historyIndex: 0 },
    histoire: { content: "", history: [""], historyIndex: 0 },
    archeologie: { content: "", history: [""], historyIndex: 0 },
    ressources: { content: "", history: [""], historyIndex: 0 },
    isUndoRedo: false,
  });
  const headingDropdownRef = useRef<HTMLDivElement>(null);
  type SectionKey = "architecture" | "histoire" | "archeologie" | "ressources";
  // Updated undo function with TypeScript

  // Add a new state to store selection information for each section
  // Add this type for section keys

  // Add a new state to store selection information
  interface SavedSelection {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
    section: SectionKey;
  }

  const [savedSelection, setSavedSelection] = useState<SavedSelection | null>(
    null
  );

  interface SectionState {
    content: string;
    history: string[];
    historyIndex: number;
  }

  interface EditorState {
    architecture: SectionState;
    histoire: SectionState;
    archeologie: SectionState;
    ressources: SectionState;
    isUndoRedo: boolean;
  }

  // Add this useEffect to restore cursor position
  /*useEffect(() => {
  if (!savedSelection) return;
  
  // Increased timeout to ensure DOM is fully ready
  const timeoutId = setTimeout(() => {
    try {
      const selection = window.getSelection();
      if (!selection) return;
      
      // Create a mapping of section names to refs
      const sections: Record<SectionKey, React.RefObject<HTMLDivElement|null>> = {
        architecture: architectureRef,
        histoire: histoireRef,
        archeologie: archeologieRef,
        ressources: ressourcesRef
      };
      
      // Validate the section key
      const sectionKey = savedSelection.section as SectionKey;
      if (!Object.keys(sections).includes(sectionKey)) {
        console.warn("Invalid section key in saved selection", sectionKey);
        return;
      }
      
      // Get the section ref from the mapping
      const sectionRef = sections[sectionKey];
      
      // Only proceed if we have a valid ref with current value
      if (!sectionRef?.current) {
        console.warn("Section ref not available", sectionKey);
        return;
      }
      
      // Apply LTR styling FIRST, before any selection manipulation
      applyLtrStyling(sectionRef.current);
      
      // Focus the section
      sectionRef.current.focus();
      
      // Try to restore the selection
      try {
        const range = document.createRange();
        range.setStart(savedSelection.startContainer, savedSelection.startOffset);
        range.setEnd(savedSelection.endContainer, savedSelection.endOffset);
        
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (rangeError) {
        console.error("Range creation failed", rangeError);
        placeCursorAtEnd(sectionRef.current);
      }
    } catch (error) {
      console.error("Failed to restore selection", error);
      
      // Better error recovery
      try {
        const sections: Record<SectionKey, React.RefObject<HTMLDivElement|null>> = {
          architecture: architectureRef,
          histoire: histoireRef,
          archeologie: archeologieRef,
          ressources: ressourcesRef
        };
        
        const sectionRef = sections[savedSelection.section as SectionKey];
        if (sectionRef?.current) {
          applyLtrStyling(sectionRef.current);
          sectionRef.current.focus();
          placeCursorAtEnd(sectionRef.current);
        }
      } catch (e) {
        console.error("Fallback focus also failed", e);
      }
    } finally {
      setSavedSelection(null);
    }
  }, 200); // Increased timeout for better reliability
  
  // Cleanup function to cancel timeout if component unmounts
  return () => clearTimeout(timeoutId);
}, [savedSelection, architectureRef, histoireRef, archeologieRef, ressourcesRef]);
useEffect(() => {
  // Apply LTR on component mount and set up preventative measures
  const allSections = [
    architectureRef.current,
    histoireRef.current, 
    archeologieRef.current,
    ressourcesRef.current
  ];
  
  // Apply initial styling to all sections
  allSections.forEach(section => {
    if (section) {
      applyLtrStyling(section);
    }
  });
  
  // Add a global style to force LTR for the editor
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    [contenteditable="true"] {
      direction: ltr !important;
      text-align: left !important;
      unicode-bidi: isolate !important;
      writing-mode: horizontal-tb !important;
    }
    [contenteditable="true"] * {
      direction: ltr !important;
      text-align: left !important;
      unicode-bidi: isolate !important;
      writing-mode: horizontal-tb !important;
    }
    //Override for common text containers 
    [contenteditable="true"] p, 
    [contenteditable="true"] div,
    [contenteditable="true"] span,
    [contenteditable="true"] h1,
    [contenteditable="true"] h2,
    [contenteditable="true"] h3,
    [contenteditable="true"] h4,
    [contenteditable="true"] h5,
    [contenteditable="true"] h6,
    [contenteditable="true"] li {
      direction: ltr !important;
      text-align: left !important;
      unicode-bidi: isolate !important;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Add input event handler to ensure LTR styling is maintained
  const inputHandler = (e: Event) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.getAttribute('contenteditable') === 'true') {
      // Save current selection
      const selection = window.getSelection();
      let savedRange = null;
      
      if (selection && selection.rangeCount > 0) {
        savedRange = selection.getRangeAt(0).cloneRange();
      }
      
      // Apply LTR styling
      applyLtrStyling(target);
      
      // Restore selection
      if (savedRange) {
        try {
          selection?.removeAllRanges();
          selection?.addRange(savedRange);
        } catch (err) {
          console.error("Failed to restore cursor after input event:", err);
        }
      }
    }
  };
  
  // Add listeners to all editable sections
  allSections.forEach(section => {
    if (section) {
      section.addEventListener('input', inputHandler, { capture: true });
    }
  });
  
  // Clean up
  return () => {
    allSections.forEach(section => {
      if (section) {
        section.removeEventListener('input', inputHandler, { capture: true });
      }
    });
    
    if (styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }
  };
}, []);
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only intercept if the target is a contenteditable element
    if (!(e.target instanceof HTMLElement) || e.target.getAttribute('contenteditable') !== 'true') {
      return;
    }
    
    // For arrow keys and special cursor movement keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      // Let the browser handle the movement
      setTimeout(() => {
        // After movement, ensure the context around the cursor remains LTR
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          
          // Apply LTR to the elements around the cursor
          if (range.startContainer instanceof HTMLElement) {
            applyLtrStyling(range.startContainer);
          } else if (range.startContainer.parentElement) {
            applyLtrStyling(range.startContainer.parentElement);
          }
        }
      }, 0);
    }
  };
  
  // Add listener to document
  document.addEventListener('keydown', handleKeyDown);
  
  // Cleanup
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, []);*/

  // Modify your handleContentChange function

  // Update the content and history for the specific section
  useEffect(() => {
    if (!activeSection) return;

    const sectionRefMap = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    const el = sectionRefMap[activeSection].current;
    if (el) {
      el.style.direction = "ltr";
      el.setAttribute("dir", "ltr");
      // Force child elements
      const childElements = el.querySelectorAll("*");
      childElements.forEach((child) => {
        if (child instanceof HTMLElement) {
          // Type guard for TypeScript
          child.style.direction = "ltr";
          child.setAttribute("dir", "ltr");
        }
      });
    }
  }, [editorState]);

  const handleContentChange = (
    section: SectionKey,
    e: React.SyntheticEvent
  ) => {
    const sectionRef = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    }[section];

    if (sectionRef.current) {
      // Store the current selection state
      const selection = window.getSelection();
      let cursorInfo: { path: number[]; offset: number } | null = null;

      // Capture cursor position information before state update
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Make sure we're working with the correct section
        if (sectionRef.current.contains(range.startContainer)) {
          // Store relative cursor position info that won't be affected by re-render
          const container = range.startContainer;
          const offset = range.startOffset;

          // Create a path to find this node after re-render
          let path: number[] = [];
          let currentNode: Node | null = container;
          while (currentNode && currentNode !== sectionRef.current) {
            const parent = currentNode.parentNode as ParentNode;
            if (!parent) break;

            const index = Array.from(parent.childNodes).indexOf(
              currentNode as ChildNode
            );
            path.unshift(index);
            currentNode = parent;
          }

          cursorInfo = { path, offset };
        }
      }

      // Get the content
      const newContent = sectionRef.current.innerHTML;
      const currentSectionState = editorState[section];

      // Only update if content has changed
      if (currentSectionState.content !== newContent) {
        // Create updated state for this specific section
        const updatedSectionState = {
          ...currentSectionState,
          content: newContent,
        };

        // Handle history
        if (!editorState.isUndoRedo) {
          const newHistory = currentSectionState.history.slice(
            0,
            currentSectionState.historyIndex + 1
          );
          if (newHistory[newHistory.length - 1] !== newContent) {
            updatedSectionState.history = [...newHistory, newContent];
            updatedSectionState.historyIndex = newHistory.length;
          }
        }

        // Check for Enter key press on heading elements - ensure next block is a paragraph
        const keyEvent = e.nativeEvent as KeyboardEvent;
        if (keyEvent && keyEvent.key === "Enter") {
          // Get active element
          const activeElement = document.activeElement;

          // Check if we're in a heading
          if (
            activeElement &&
            ["H1", "H2", "H3"].includes((activeElement as HTMLElement).tagName)
          ) {
            // Force next element to be a paragraph
            setTimeout(() => {
              document.execCommand("formatBlock", false, "<p>");
            }, 0);
          }
        }

        // Update state
        setEditorState((prevState) => {
          const newState = {
            ...prevState,
            [section]: updatedSectionState,
            isUndoRedo: false,
          };

          // Use a more reliable cursor restoration approach
          if (cursorInfo) {
            // Delay execution to ensure DOM is updated
            setTimeout(() => {
              try {
                // Start from the section element
                let targetNode: Node | null = sectionRef.current;

                // Follow the path to find the same relative position
                for (const index of cursorInfo.path) {
                  if (
                    targetNode &&
                    targetNode.childNodes &&
                    targetNode.childNodes[index]
                  ) {
                    targetNode = targetNode.childNodes[index];
                  } else {
                    // Path is no longer valid, fallback to section element
                    console.warn("Cursor restoration path is invalid");
                    break;
                  }
                }

                // Set the cursor position
                if (targetNode && selection) {
                  const range = document.createRange();
                  const offset = Math.min(
                    cursorInfo.offset,
                    targetNode.textContent?.length || 0
                  );

                  range.setStart(targetNode, offset);
                  range.collapse(true);

                  selection.removeAllRanges();
                  selection.addRange(range);

                  // Ensure the correct section has focus
                  sectionRef.current?.focus();
                }
              } catch (e) {
                console.error("Error restoring cursor position:", e);
              }
            }, 0);
          }

          return newState;
        });

        setLastSaved("Saving...");
      }
    }
  };

  /*const applyLtrStyling = (element: HTMLElement) => {
  if (!element) return;

  // Apply inline styles AND attributes for maximum browser compatibility
  const applyLTRToElement = (el: HTMLElement) => {
    // Set inline styles with !important
    el.style.setProperty('direction', 'ltr', 'important');
    el.style.setProperty('text-align', 'left', 'important');
    el.style.setProperty('unicode-bidi', 'isolate', 'important');
    el.style.setProperty('writing-mode', 'horizontal-tb', 'important');
    
    // Set attributes for additional enforcement
    el.setAttribute('dir', 'ltr');
  };
  
  // Apply to the element itself
  applyLTRToElement(element);
  
  // Apply to parent elements
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    applyLTRToElement(parent);
    parent = parent.parentElement;
  }
  
  // Apply to all children
  const allChildren = element.querySelectorAll('*');
  allChildren.forEach(child => {
    if (child instanceof HTMLElement) {
      applyLTRToElement(child);
    }
  });

  // Force reflow to ensure styles are applied
  void element.offsetHeight;
};
const placeCursorAtPosition = (element: HTMLElement, range: Range) => {
  try {
    // Ensure element is focused
    element.focus();
    
    // Try to find the nodes in the DOM
    const nodeExists = (node: Node): boolean => {
      try {
        return document.contains(node);
      } catch {
        return false;
      }
    };
    
    // If the range's nodes are still in the DOM, use them
    if (nodeExists(range.startContainer) && nodeExists(range.endContainer)) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      // Fallback: place cursor at the beginning of the element
      const newRange = document.createRange();
      newRange.setStart(element, 0);
      newRange.setEnd(element, 0);
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  } catch (e) {
    console.error("Error placing cursor at position:", e);
  }
};

// Helper function to place cursor at the end
const placeCursorAtEnd = (element: HTMLElement) => {
  if (!element) return;
  
  // Apply LTR styling first
  applyLtrStyling(element);
  
  // Focus the element
  element.focus();
  
  // Create a new range
  const range = document.createRange();
  const selection = window.getSelection();
  
  // For empty elements
  if (!element.childNodes.length) {
    range.setStart(element, 0);
    range.setEnd(element, 0);
    
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    return;
  }
  
  // For elements with content, put cursor at the end
  let lastNode = element.lastChild;
  
  // Find the last actual text node or element node
  while (lastNode && lastNode.nodeType !== Node.TEXT_NODE && lastNode.hasChildNodes()) {
    lastNode = lastNode.lastChild;
  }
  
  if (lastNode) {
    if (lastNode.nodeType === Node.TEXT_NODE) {
      range.setStart(lastNode, lastNode.textContent?.length || 0);
      range.setEnd(lastNode, lastNode.textContent?.length || 0);
    } else {
      range.setStartAfter(lastNode);
      range.setEndAfter(lastNode);
    }
    
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    // Fallback
    range.selectNodeContents(element);
    range.collapse(false); // Collapse to end
    
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};*/

  const handleUndo = (section: SectionKey) => {
    const currentSectionState = editorState[section];

    if (currentSectionState.historyIndex > 0) {
      // Set isUndoRedo to true to prevent handleContentChange from adding to history
      setEditorState({
        ...editorState,
        isUndoRedo: true,
        [section]: {
          ...currentSectionState,
          historyIndex: currentSectionState.historyIndex - 1,
          content:
            currentSectionState.history[currentSectionState.historyIndex - 1],
        },
      });
    }
  };

  const handleRedo = (section: SectionKey) => {
    const currentSectionState = editorState[section];

    if (
      currentSectionState.historyIndex <
      currentSectionState.history.length - 1
    ) {
      setEditorState({
        ...editorState,
        isUndoRedo: true,
        [section]: {
          ...currentSectionState,
          historyIndex: currentSectionState.historyIndex + 1,
          content:
            currentSectionState.history[currentSectionState.historyIndex + 1],
        },
      });
    }
  };
  // Example keyboard shortcut handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Check if active section exists
    if (!activeSection) return;

    // Ctrl+Z for undo
    if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      handleUndo(activeSection);
    }

    // Ctrl+Y or Ctrl+Shift+Z for redo
    if (
      (e.ctrlKey && e.key === "y") ||
      (e.ctrlKey && e.shiftKey && e.key === "z")
    ) {
      e.preventDefault();
      handleRedo(activeSection);
    }
  };

  const handleHeadingChange = (
    headingType: string,
    activeSection?: SectionKey
  ): void => {
    const formatLabels: { [key: string]: string } = {
      h1: "Heading 1",
      h2: "Heading 2",
      h3: "Heading 3",
      p: "Normal text",
    };

    setCurrentFormat(formatLabels[headingType]);
    setShowHeadingDropdown(false);

    // Create a mapping of section names to refs
    const sections = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    // Determine the active section
    let currentSection = activeSection;
    if (!currentSection) {
      currentSection = getActiveSection() as SectionKey;
    }

    // Only proceed if we have a valid section
    if (currentSection) {
      const sectionRef = sections[currentSection];

      if (sectionRef && sectionRef.current) {
        // Save current selection state precisely
        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0) {
          // Store the exact range before we do anything
          const originalRange = selection.getRangeAt(0).cloneRange();

          // Get the active block element
          let currentBlock = originalRange.startContainer;
          while (
            currentBlock &&
            (currentBlock.nodeType !== Node.ELEMENT_NODE ||
              !["P", "H1", "H2", "H3", "DIV", "BLOCKQUOTE"].includes(
                (currentBlock as Element).tagName
              )) &&
            currentBlock !== sectionRef.current
          ) {
            currentBlock = currentBlock.parentNode as Node;
          }

          // If we found a valid block element
          if (currentBlock && currentBlock !== sectionRef.current) {
            // Remember cursor offset
            const textNode = originalRange.startContainer;
            const offset = originalRange.startOffset;

            // Apply the heading change
            document.execCommand("formatBlock", false, `<${headingType}>`);

            // Manually fix cursor position - this is critical
            setTimeout(() => {
              try {
                // Create a fresh selection
                const newSelection = window.getSelection();
                if (!newSelection) return;

                // Intentionally remove all ranges to clear any phantom cursors
                newSelection.removeAllRanges();

                // Find the same text node or a corresponding one after DOM changes
                let targetNode = textNode;
                let targetOffset = offset;

                // If the original text node is no longer in the DOM, find a suitable replacement
                if (!document.contains(textNode)) {
                  // Find the transformed heading element
                  let newBlock;
                  const nodeIterator = document.createNodeIterator(
                    sectionRef.current!,
                    NodeFilter.SHOW_ELEMENT,
                    {
                      acceptNode(node) {
                        return node.nodeName.toLowerCase() === headingType
                          ? NodeFilter.FILTER_ACCEPT
                          : NodeFilter.FILTER_SKIP;
                      },
                    }
                  );

                  // Get the last added heading of this type (likely our newly created one)
                  while (nodeIterator.nextNode()) {
                    newBlock = nodeIterator.referenceNode;
                  }

                  // If we found our new heading
                  if (newBlock) {
                    // Find first text node in the heading
                    const textWalker = document.createTreeWalker(
                      newBlock,
                      NodeFilter.SHOW_TEXT,
                      null
                    );

                    // Get first text node
                    const firstTextNode = textWalker.nextNode();
                    if (firstTextNode) {
                      targetNode = firstTextNode;
                      // Try to maintain the same relative position in the text
                      targetOffset = Math.min(
                        offset,
                        firstTextNode.textContent?.length || 0
                      );
                    } else {
                      // No text node found, place cursor at the beginning of the block
                      targetNode = newBlock;
                      targetOffset = 0;
                    }
                  }
                }

                // Create a new range and set cursor position
                const newRange = document.createRange();
                newRange.setStart(targetNode, targetOffset);
                newRange.collapse(true); // Collapse to start

                // Apply the range
                newSelection.addRange(newRange);

                // Ensure section is focused
                if (sectionRef.current) sectionRef.current.focus();
              } catch (e) {
                console.error("Error fixing cursor position:", e);
              }
            }, 0);

            // Trigger save
            const changeEvent = new Event("input", { bubbles: true });
            sectionRef.current.dispatchEvent(changeEvent);
          } else {
            // Focus the section first
            sectionRef.current.focus();

            // Apply format
            document.execCommand("formatBlock", false, `<${headingType}>`);

            // Fix cursor position with same approach as above
            setTimeout(() => {
              try {
                const newSelection = window.getSelection();
                if (!newSelection) return;

                // Clear existing selections to remove phantom cursors
                newSelection.removeAllRanges();

                // Create new range based on original position
                const newRange = document.createRange();

                // Try to find the node where cursor should be
                let targetFound = false;

                // Look for a heading element that was just created
                const headings =
                  sectionRef.current!.querySelectorAll(headingType);
                if (headings.length > 0) {
                  // Get the last heading (most likely the one just created)
                  const lastHeading = headings[headings.length - 1];

                  // Find a suitable text node
                  if (
                    lastHeading.firstChild &&
                    lastHeading.firstChild.nodeType === Node.TEXT_NODE
                  ) {
                    newRange.setStart(
                      lastHeading.firstChild,
                      originalRange.startOffset
                    );
                    targetFound = true;
                  } else {
                    newRange.setStart(lastHeading, 0);
                    targetFound = true;
                  }
                }

                // Fallback if we couldn't find target
                if (!targetFound) {
                  newRange.setStart(
                    originalRange.startContainer,
                    originalRange.startOffset
                  );
                }

                newRange.collapse(true);
                newSelection.addRange(newRange);

                // Keep focus
                if (sectionRef.current) sectionRef.current.focus();
              } catch (e) {
                console.error("Error fixing cursor position:", e);
              }
            }, 0);

            // Trigger save
            const changeEvent = new Event("input", { bubbles: true });
            sectionRef.current.dispatchEvent(changeEvent);
          }
        } else {
          // No selection, just focus and apply
          sectionRef.current.focus();
          document.execCommand("formatBlock", false, `<${headingType}>`);

          // Trigger save
          const changeEvent = new Event("input", { bubbles: true });
          sectionRef.current.dispatchEvent(changeEvent);
        }
      }
    }
  };

  // Helper function to identify the current line/paragraph
  const getCurrentLine = (
    container: HTMLElement,
    range: Range
  ): Node | null => {
    // Start from the range's start container
    let node = range.startContainer;

    // If we're in a text node, move up to its parent
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode as Node;
    }

    // Look for block-level elements
    while (node && node !== container) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = (node as Element).tagName;
        if (["P", "H1", "H2", "H3", "DIV", "BLOCKQUOTE"].includes(tagName)) {
          return node;
        }
      }
      node = node.parentNode as Node;
    }

    // If we can't find a suitable block element
    return null;
  };
  // Helper function to find the first text node in an element
  const findFirstTextNode = (element: Node): Text | null => {
    if (element.nodeType === 3) {
      // Text node
      return element as Text;
    }

    // Search children
    for (let i = 0; i < element.childNodes.length; i++) {
      const textNode = findFirstTextNode(element.childNodes[i]);
      if (textNode) {
        return textNode;
      }
    }

    return null;
  };

  // Add this useEffect for handling clicks outside the dropdown
  const formatDoc = (
    command: string,
    section: SectionKey,
    value: string | null = null
  ): void => {
    // Get the correct ref based on the section
    const sectionRefs = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    const currentRef = sectionRefs[section];

    // Check if the ref exists and has a current value
    if (currentRef && currentRef.current) {
      try {
        // Save current selection
        const selection = window.getSelection();
        let range = null;

        // Only save and restore selection if it exists and is within the section
        if (selection && selection.rangeCount > 0) {
          const currentRange = selection.getRangeAt(0);
          const container = currentRange.commonAncestorContainer;

          // Check if the selection is within the target section
          if (currentRef.current.contains(container as Node)) {
            range = currentRange.cloneRange(); // Clone to avoid potential issues
          }
        }

        // Focus on the specific section
        currentRef.current.focus();

        // Restore selection if it exists and was within the section
        if (selection && range) {
          selection.removeAllRanges();
          selection.addRange(range);
        }

        // Execute the command
        if (value !== null) {
          document.execCommand(command, false, value);
        } else {
          document.execCommand(command, false);
        }

        // Trigger an input event to ensure content changes are saved
        const changeEvent = new Event("input", { bubbles: true });
        currentRef.current.dispatchEvent(changeEvent);
      } catch (error) {
        console.error(
          `Error applying format command ${command} to section ${section}:`,
          error
        );
      }
    }
  };
  /**
   * Gets the currently active section based on which editor has focus
   * @returns The active section key or null if no section is active
   */
  const getActiveSection = (): SectionKey | null => {
    // Get all section refs
    const sectionRefs = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    // Check which section contains the active element
    const activeElement = document.activeElement;

    // Go through each ref and check if it's the active element or contains it
    for (const [section, ref] of Object.entries(sectionRefs) as [
      SectionKey,
      React.RefObject<HTMLDivElement>
    ][]) {
      if (
        ref.current &&
        (ref.current === activeElement || ref.current.contains(activeElement))
      ) {
        return section as SectionKey;
      }
    }

    // No active section found
    return null;
  };
  const getSizeValue = (size: string): string => {
    const sizeMap: { [key: string]: string } = {
      "8": "1",
      "9": "2",
      "10": "2",
      "11": "3",
      "12": "3",
      "14": "4",
      "18": "5",
      "24": "6",
      "36": "7",
    };
    return sizeMap[size] || "3";
  };
  const handleFontSizeChange = (
    fontSize: string,
    activeSection?: SectionKey
  ): void => {
    // Map of font size values - adjust these as needed for your design
    const fontSizeValues: { [key: string]: string } = {
      small: "1", // Small text
      normal: "3", // Regular text
      medium: "4", // Medium text
      large: "5", // Large text
      "x-large": "6", // Extra large text
    };

    // Get the font size value
    const fontSizeValue = fontSizeValues[fontSize] || "3"; // Default to normal size if not found

    // Determine the active section
    let currentSection = activeSection;

    if (!currentSection) {
      currentSection = getActiveSection() as SectionKey;
    }

    // Only proceed if we have a valid section
    if (currentSection) {
      // Use the formatDoc function that already works well
      formatDoc("fontSize", currentSection, fontSizeValue);

      // Get reference to the section
      const sectionRefs = {
        architecture: architectureRef,
        histoire: histoireRef,
        archeologie: archeologieRef,
        ressources: ressourcesRef,
      };

      const sectionRef = sectionRefs[currentSection];

      // Update the UI state if needed
      setFontSize(fontSize); // Assuming you have a state for tracking current font size
      setShowFontSizeDropdown(false);
      // Focus the section again to ensure it maintains focus
      if (sectionRef && sectionRef.current) {
        sectionRef.current.focus();
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if dropdown is open and click is outside
      if (showHeadingDropdown && headingDropdownRef.current) {
        if (!headingDropdownRef.current.contains(event.target as Node)) {
          setShowHeadingDropdown(false);
        }
      }
    };

    // Add event listener when dropdown is shown
    if (showHeadingDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHeadingDropdown]);

  const handleFontFamilyChange = (
    section: SectionKey,
    fontFamily: string
  ): void => {
    // Get the correct ref based on the section
    setFontFamily(fontFamily);
    setShowFontFamilyDropdown(false);
    const sectionRefs = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    const currentRef = sectionRefs[section];

    // Check if the ref exists and has a current value
    if (currentRef && currentRef.current) {
      try {
        // Save current selection
        const selection = window.getSelection();
        let range = null;

        // Only save and restore selection if it exists and is within the section
        if (selection && selection.rangeCount > 0) {
          const currentRange = selection.getRangeAt(0);
          const container = currentRange.commonAncestorContainer;

          // Check if the selection is within the target section
          if (currentRef.current.contains(container as Node)) {
            range = currentRange.cloneRange(); // Clone to avoid potential issues
          }
        }

        // Focus on the specific section
        currentRef.current.focus();

        // Restore selection if it exists and was within the section
        if (selection && range) {
          selection.removeAllRanges();
          selection.addRange(range);
        }

        // Execute the font family command
        document.execCommand("fontName", false, fontFamily);

        // Trigger an input event to ensure content changes are saved
        const changeEvent = new Event("input", { bubbles: true });
        currentRef.current.dispatchEvent(changeEvent);
      } catch (error) {
        console.error(
          `Error applying font family ${fontFamily} to section ${section}:`,
          error
        );
      }
    }
  };
  const handleListOperation = (
    listType: "insertUnorderedList" | "insertOrderedList"
  ): void => {
    // Get selected text
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    // Create a mapping of section names to refs
    const sections = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    // Find the active section
    let activeSection: SectionKey | null = null;

    Object.entries(sections).forEach(([name, ref]) => {
      if (ref.current && container && ref.current.contains(container as Node)) {
        activeSection = name as SectionKey;
      }
    });

    if (activeSection === null) return;

    // Get the section ref
    const sectionRef = sections[activeSection as keyof typeof sections];
    if (!sectionRef.current) return;

    // Apply the list formatting using execCommand directly
    document.execCommand(listType);

    // Then ensure proper styling
    // Find all lists in the active section
    const lists = sectionRef.current.querySelectorAll("ul, ol");

    // Apply proper styling to each list using CSS classes instead of direct style manipulation
    lists.forEach((list) => {
      list.classList.add("editor-list");
      list.setAttribute("dir", "ltr"); // Ensure left-to-right direction for lists

      // Style list items with classes
      const items = list.querySelectorAll("li");
      items.forEach((item) => {
        item.classList.add("editor-list-item");
      });
    });

    // Create and dispatch an input event to trigger the content change handler
    const changeEvent = new Event("input", { bubbles: true });
    sectionRef.current.dispatchEvent(changeEvent);

    // Focus the active section
    sectionRef.current.focus();
  };

  const handleLinkClick = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSelectedRange(range.cloneRange());

      // If text is selected, use it as link text
      if (range.toString().length > 0) {
        setLinkText(range.toString());
      }

      setShowLinkDialog(true);
    } else {
      // No selection, just open dialog
      setShowLinkDialog(true);
    }
  };
  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl) {
      // Insert link with selected text or entered text
      const displayText = linkText || linkUrl;

      // If there was a selection, restore it
      if (selectedRange) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(selectedRange);
        }
      }

      // Create HTML for link
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${displayText}</a>`;

      const activeSection = getActiveSection();
      if (activeSection) {
        formatDoc("insertHTML", activeSection, linkHtml);
      }

      // Reset and close dialog
      setLinkUrl("");
      setLinkText("");
      setSelectedRange(null);
      setShowLinkDialog(false);
    }
  };
  useEffect(() => {
    const handleClickInEditor = (e: MouseEvent) => {
      // Check if clicked element is a link
      const target = e.target as HTMLElement;

      if (target.tagName === "A") {
        // Only open links when Ctrl+Click (or Cmd+Click on Mac)
        e.preventDefault();
        const href = target.getAttribute("href");
        if (href) {
          window.open(href, "_blank", "noopener,noreferrer");
        }
      }
    };

    // Create a mapping of section refs
    const sections = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    // Add click event listener to each editor section
    Object.values(sections).forEach((ref) => {
      if (ref.current) {
        ref.current.addEventListener("click", handleClickInEditor);
      }
    });

    return () => {
      // Cleanup listeners on unmount
      Object.values(sections).forEach((ref) => {
        if (ref.current) {
          ref.current.removeEventListener("click", handleClickInEditor);
        }
      });
    };
  }, []);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // Add state for currently selected image
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(
    null
  );
  useEffect(() => {
    const handleImageSelection = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Clear previous selection
      if (selectedImage) {
        selectedImage.classList.remove("selected-image");
      }

      // If clicked on an image, select it
      if (target.tagName === "IMG") {
        const imgElement = target as HTMLImageElement;
        imgElement.classList.add("selected-image");
        setSelectedImage(imgElement);
      } else {
        setSelectedImage(null);
      }
    };

    if (editorRef.current) {
      editorRef.current.addEventListener("click", handleImageSelection);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("click", handleImageSelection);
      }
    };
  }, [selectedImage]);

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>, section: SectionKey) => {
    const files = e.target.files;
    const userId = localStorage.getItem("userId");
  
    if (!files || files.length === 0 || !userId) return;
    if(!documentId) return;
    try {
      const file = files[0];
      const result = await mediaService.uploadMedia(
        file,
        section,
        userId,
        documentId
      );
  
      // Insérer la vidéo dans l'éditeur
      insertVideo(result.chemin_media, section);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video. Please try again.");
    }
  };
  // New insertVideo function with proper typing
  const insertVideo = (videoPath: string, section: SectionKey) => {
    const sectionRefs = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };
  
    const currentRef = sectionRefs[section];
    if (!currentRef.current) return;
  
    // Construire l'URL complète
    const videoUrl = `http://localhost:5000/api/medias/${videoPath.split('/').pop()}`;
  
    try {
      const videoContainer = document.createElement('div');
      videoContainer.className = 'video-container';
      videoContainer.style.margin = '10px 0';
      videoContainer.style.maxWidth = '100%';
  
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      videoElement.controls = true;
      videoElement.style.maxWidth = '100%';
      videoElement.style.height = 'auto';
  
      videoContainer.appendChild(videoElement);
  
      // Insérer le conteneur vidéo
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        selection.getRangeAt(0).insertNode(videoContainer);
      } else {
        currentRef.current.appendChild(videoContainer);
      }
  
      const inputEvent = new Event('input', { bubbles: true });
      currentRef.current.dispatchEvent(inputEvent);
    } catch (error) {
      console.error(`Error inserting video into ${section}:`, error);
    }
  };
  // Function to save current selection
  const saveSelection = (): void => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;

      // Create a mapping of section names to refs
      const sections = {
        architecture: architectureRef,
        histoire: histoireRef,
        archeologie: archeologieRef,
        ressources: ressourcesRef,
      };

      // Find the active section
      let activeSection: SectionKey | null = null;

      Object.entries(sections).forEach(([name, ref]) => {
        if (
          ref.current &&
          container &&
          ref.current.contains(container as Node)
        ) {
          activeSection = name as SectionKey;
        }
      });

      if (activeSection !== null) {
        setSavedSelection({
          startContainer: range.startContainer,
          startOffset: range.startOffset,
          endContainer: range.endContainer,
          endOffset: range.endOffset,
          section: activeSection,
        });
      }
    }
  };

  // Function to restore selection
  const restoreSelection = (): void => {
    if (savedSelection) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        const range = document.createRange();
        range.setStart(
          savedSelection.startContainer,
          savedSelection.startOffset
        );
        range.setEnd(savedSelection.endContainer, savedSelection.endOffset);
        selection.addRange(range);

        // Focus the right section
        const sections = {
          architecture: architectureRef,
          histoire: histoireRef,
          archeologie: archeologieRef,
          ressources: ressourcesRef,
        };

        const sectionRef =
          sections[savedSelection.section as keyof typeof sections];
        sectionRef.current?.focus();
      }
    }
  };

  // 2. Fix video selection effect
  useEffect(() => {
    const handleVideoSelection = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Clear previous selection
      if (selectedVideo) {
        selectedVideo.classList.remove("selected-video");
      }

      // If clicked on a video, select it
      if (
        target.tagName === "VIDEO" ||
        target.closest(".editor-video-container")?.querySelector("video")
      ) {
        const videoElement =
          target.tagName === "VIDEO"
            ? (target as HTMLVideoElement)
            : (target
                .closest(".editor-video-container")
                ?.querySelector("video") as HTMLVideoElement);

        if (videoElement) {
          videoElement.classList.add("selected-video");
          setSelectedVideo(videoElement);
        }
      } else {
        setSelectedVideo(null);
      }
    };

    // Create a mapping of section refs
    const sections = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    // Add click event listener to each editor section
    Object.values(sections).forEach((ref) => {
      if (ref.current) {
        ref.current.addEventListener("click", handleVideoSelection);
      }
    });

    return () => {
      // Cleanup listeners on unmount
      Object.values(sections).forEach((ref) => {
        if (ref.current) {
          ref.current.removeEventListener("click", handleVideoSelection);
        }
      });
    };
  }, [selectedVideo]);

  // First useEffect - Check page overflow for each section
  useEffect(() => {
    // Check if content exceeds page height and add new page if needed
    const checkPageOverflow = () => {
      // Create a mapping of section names to refs
      const sections = {
        architecture: architectureRef,
        histoire: histoireRef,
        archeologie: archeologieRef,
        ressources: ressourcesRef,
      };

      Object.entries(sections).forEach(([name, ref]) => {
        if (!ref.current) return;

        const contentHeight = ref.current.scrollHeight;
        if (
          contentHeight > pageHeight &&
          currentPageIndex === pages.length - 1
        ) {
          setPages([...pages, { content: "", id: Date.now() }]);
          setCurrentPageIndex(currentPageIndex + 1);
        }
      });
    };

    // Create a mapping of section names to refs
    const sections = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    // Set up observers for each section
    const observers: MutationObserver[] = [];

    Object.values(sections).forEach((ref) => {
      if (ref.current) {
        const observer = new MutationObserver(checkPageOverflow);
        observer.observe(ref.current, { childList: true, subtree: true });
        observers.push(observer);
      }
    });

    // Initial check in case content is already overflowing
    checkPageOverflow();

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [pages, currentPageIndex, pageHeight]);

  // Second useEffect - Apply styling to each section
  useEffect(() => {
    // Create a mapping of section names to refs
    const sections = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    Object.values(sections).forEach((ref) => {
      if (ref.current) {
        // Apply text wrapping styles
        ref.current.style.overflowWrap = "break-word";
        ref.current.style.wordWrap = "break-word";
        ref.current.style.wordBreak = "break-word";
        ref.current.style.whiteSpace = "pre-wrap";

        // Make vertically scrollable during editing
        ref.current.style.overflowY = "auto";
        ref.current.style.maxHeight = "600px"; // Set a reasonable height for editing

        // Constrain width to prevent horizontal overflow
        ref.current.style.width = `${pageWidth - 48}px`; // Account for padding
        ref.current.style.padding = "24px";
        ref.current.style.boxSizing = "border-box";
      }
    });
  }, [pageWidth]);
  // Function to export to PDF with proper pagination
  // Function to export to PDF with proper pagination
  const exportToPDF = () => {
    // Create a mapping of section names to refs
    const sections = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    // Check if any of the sections exist
    const hasSections = Object.values(sections).some((ref) => ref.current);
    if (!hasSections) return;

    // Create a temporary container with explicit sizing
    const tempContainer = document.createElement("div");
    tempContainer.style.visibility = "hidden";
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "-9999px";
    document.body.appendChild(tempContainer);

    // Generate HTML for each section
    let sectionsContent = "";

    Object.entries(sections).forEach(([name, ref]) => {
      if (!ref.current) return;

      // Add section title and content
      sectionsContent += `
        <div class="section">
          <h2 class="section-title">${
            name.charAt(0).toUpperCase() + name.slice(1)
          }</h2>
          <div class="section-content" dir="ltr" style="direction: ltr; text-align: left;">
            ${ref.current.innerHTML}
          </div>
        </div>
      `;
    });

    // Create a styled document with more appropriate settings
    tempContainer.innerHTML = `
      <div class="pdf-container">
        <style>
          .pdf-container {
            background-color: #ffffff;
            font-family: Arial, sans-serif;
            width: 794px; /* A4 width in px */
            padding: 50px;
            box-sizing: border-box;
            margin: 0;
          }
          .pdf-container * {
            word-wrap: break-word !important;
            white-space: normal !important;
            overflow-wrap: break-word !important;
            max-width: 100% !important;
          }
          .section {
            margin-bottom: 15px;
            page-break-inside: auto; /* Changed from avoid to allow content to flow naturally */
          }
          .section-title {
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 10px;
            color: #333;
            page-break-after: avoid;
          }
          /* Remove the page-break-before setting that was forcing sections to new pages */
          table {
            height:fit-content;
            width: 100% !important;
            border-collapse: collapse;
            direction: ltr !important;
          }
          td, th {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left !important;
            direction: ltr !important;
          }
        </style>
        ${sectionsContent}
      </div>
    `;

    const pdfContainer = tempContainer.querySelector(".pdf-container");
    if (!pdfContainer) {
      console.error("PDF container element not found");
      document.body.removeChild(tempContainer);
      return;
    }

    // Use html2pdf with modified settings
    html2pdf()
      .set({
        margin: [10, 10, 10, 10], // Small margins [top, right, bottom, left] in mm
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          logging: false, // Reduced logging
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          putOnlyUsedFonts: true,
          compress: true,
        },
        pagebreak: {
          mode: ["css", "legacy"], // Removed "avoid-all" which can cause spacing issues
          before: ".pagebreak", // Only break before elements with explicit pagebreak class
        },
      })
      .from(pdfContainer as HTMLElement)
      .save()
      .then(() => {
        // Clean up
        document.body.removeChild(tempContainer);
      })
      .catch((err) => {
        console.error("PDF generation error:", err);
        document.body.removeChild(tempContainer);
        alert("Error generating PDF. Please try again.");
      });
  };
  // Initialize collaboration service
  useEffect(() => {
    if (!documentId) return;
    const handleUsersUpdate = (users: User[]) => {
      setActiveUsers(users);
    };

    const handleCommentsUpdate = (newComments: Comment[]) => {
      setComments((prevComments) => [...prevComments, ...newComments]);
    };

    const service = new CollaborationService(
      documentId,
      handleUsersUpdate,
      handleCommentsUpdate
    );

    collaborationServiceRef.current = service;

    // Connect to the service
    const connectToService = async () => {
      setCollaborationStatus("connecting");
      const success = await service.connect();
      setCollaborationStatus(success ? "connected" : "error");
    };

    connectToService();

    // Cleanup on unmount
    return () => {
      if (collaborationServiceRef.current) {
        collaborationServiceRef.current.disconnect();
      }
    };
  }, [documentId]);

  const handleTextSelection = (): void => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      setSelectedText(selection.toString());
      setSelectedRange(range);
    } else {
      setSelectedText("");
      setSelectedRange(null);
    }
  };
  
  // Add a comment to the selected text
  const addComment = async (commentText: string) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
  
    if (!documentId || !userId || !token || !commentText.trim()) {
      alert("Veuillez vous connecter et entrer un commentaire valide");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/commentaires", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          utilisateur_id: userId,
          oeuvre_id: documentId,
          contenu: commentText
        })
      });
  
      if (!response.ok) throw new Error("Échec de l'ajout");
  
      const newComment = await response.json();
  
      // Mise à jour de l'état avec typage correct
      setComments(prev => [
        ...prev,
        {
          _id: newComment.id,
          utilisateur_id: userId,
          oeuvre_id: documentId,
          contenu: commentText,
          createdAt: new Date().toISOString(),
          // Champs optionnels pour compatibilité
          id: newComment.id,
          text: commentText,
          author: "Vous",
          timestamp: new Date()
        }
      ]);
  
    } catch (error) {
      console.error("Erreur:", error);
      alert(error instanceof Error ? error.message : "Erreur inconnue");
    }
  };
  // Share functionality

  // Handle comment submission
  const handleCommentSubmit = (): void => {
    if (commentInputRef.current) {
      addComment(commentInputRef.current.value);
      commentInputRef.current.value = "";
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // Add state for currently selected image

  useEffect(() => {
    const handleImageSelection = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Clear previous selection
      if (selectedImage) {
        selectedImage.classList.remove("selected-image");
      }

      // If clicked on an image, select it
      if (target.tagName === "IMG") {
        const imgElement = target as HTMLImageElement;
        imgElement.classList.add("selected-image");
        setSelectedImage(imgElement);
      } else {
        setSelectedImage(null);
      }
    };

    if (editorRef.current) {
      editorRef.current.addEventListener("click", handleImageSelection);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("click", handleImageSelection);
      }
    };
  }, [selectedImage]);

  useEffect(() => {
    const loadMediasForSections = async () => {
      const sections: SectionKey[] = ['architecture', 'histoire', 'archeologie', 'ressources'];
      
      for (const section of sections) {
        try {
          const medias = await mediaService.getMediasBySection(section);
          // Ici vous pouvez traiter les médias pour les afficher dans chaque section
          console.log(`Médias pour ${section}:`, medias);
        } catch (error) {
          console.error(`Error loading medias for ${section}:`, error);
        }
      }
    };
  
    loadMediasForSections();
  }, [documentId]);

  // Add delete image function
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, section: SectionKey) => {
    const files = e.target.files;
    const userId = localStorage.getItem("userId");
  
    if (!files || files.length === 0 || !userId) return;
  
    try {
      if (!documentId) return;
      const file = files[0];
      const result = await mediaService.uploadMedia(
        file,
        section, // ID de la section comme "architecture", "histoire", etc.
        userId,  // ID de l'utilisateur
        documentId,
      );
  
      // Insérer l'image dans l'éditeur
      insertImage(result.chemin_media, section);
    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Error uploading media. Please try again.");
    }
  };
  // Updated insertImage function with proper event typing
  const insertImage = (imagePath: string, section: SectionKey) => {
    const sectionRefs = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };
  
    const currentRef = sectionRefs[section];
    if (!currentRef.current) return;
  
    // Construire l'URL complète
    const imageUrl = `http://localhost:5000/api/medias/${imagePath.split('/').pop()}`;
  
    try {
      // Sauvegarder la sélection
      const selection = window.getSelection();
      let range = null;
  
      if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0).cloneRange();
      }
  
      // Focus sur la section
      currentRef.current.focus();
  
      // Restaurer la sélection si elle existe
      if (selection && range) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
  
      // Créer l'élément image avec des styles de base
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '10px 0';
  
      // Insérer l'image
      if (selection && selection.rangeCount > 0) {
        selection.getRangeAt(0).insertNode(img);
      } else {
        currentRef.current.appendChild(img);
      }
  
      // Déclencher l'événement de changement
      const inputEvent = new Event('input', { bubbles: true });
      currentRef.current.dispatchEvent(inputEvent);
    } catch (error) {
      console.error(`Error inserting image into ${section}:`, error);
    }
  };

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const shareDocument = async (recipientEmail: string): Promise<void> => {
    if (!collaborationServiceRef.current) {
      alert("Collaboration service not available.");
      return;
    }

    try {
      const shareOptions: ShareOptions = {
        canEdit: true,
        canComment: true,
      };

      const shareLink = await collaborationServiceRef.current.generateShareLink(
        shareOptions
      );

      // Close the dialog after successful share
      setIsShareDialogOpen(false);

      // Show success message in an alert only
      alert(`Document shared successfully with ${recipientEmail}`);

      // Don't set the success status message that would display on screen
      // Removing this line prevents the success message from showing in the UI
      // setShareStatus({
      //   message: `Document shared successfully with ${recipientEmail}`,
      //   type: 'success'
      // });
    } catch (error) {
      console.error("Failed to share document", error);
      alert("Failed to share document. Please try again.");
    }
  };

  const handleShareClick = () => {
    setIsShareDialogOpen(true);
    // Reset any previous share status when opening the dialog
    setShareStatus({ message: "", type: null });
  };

  // State to track which section is currently active
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  // State to store content for each section
  const [documentSections, setDocumentSections] = useState({
    architecture: "",
    archaeology: "",
    history: "",
  });

  const printDocument = () => {
    // Create a mapping of section names to refs
    const sections = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    };

    // Check if any of the sections exist
    const hasSections = Object.values(sections).some((ref) => ref.current);
    if (!hasSections) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow == null) return;

    // Start building the HTML content
    let sectionsContent = "";

    // Generate HTML for each section
    Object.entries(sections).forEach(([name, ref]) => {
      if (!ref.current) return;

      // Add section title and content
      sectionsContent += `
        <div class="section">
          <h2 class="section-title">${
            name.charAt(0).toUpperCase() + name.slice(1)
          }</h2>
          <div class="section-content">
            ${ref.current.innerHTML}
          </div>
        </div>
      `;
    });

    // Write the document content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Document</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-family: Arial, sans-serif;
          }
          .content {
            padding: 80px 40px 40px 40px;
            box-sizing: border-box;
            width: 100%;
            word-wrap: break-word;
            white-space: normal;
            overflow-wrap: break-word;
          }
          .content * {
            word-wrap: break-word !important;
            white-space: normal !important;
            overflow-wrap: break-word !important;
            max-width: 100% !important;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 24px;
            margin-bottom: 15px;
            color: #333;
            page-break-after: avoid;
          }
          .section:not(:first-child) {
            page-break-before: always;
          }
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="content">
          ${sectionsContent}
        </div>
        <script>
          // Automatically open print dialog when content loads
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  // Function to insert an array as a table with a custom modal
  const insertArray = () => {
    // Get the active section based on current selection
    const selection = window.getSelection();
    let activeSection: HTMLDivElement | null = null;
    let activeSectionKey: SectionKey | null = null;

    // Create a mapping of section elements to their keys
    const sectionElements: Record<string, SectionKey> = {
      architectureContent: "architecture",
      histoireContent: "histoire",
      archeologieContent: "archeologie",
      ressourcesContent: "ressources",
    };

    // Find which section contains the current selection
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      let element =
        container.nodeType === 3
          ? container.parentElement
          : (container as Element);

      // Traverse up to find the editor content div
      while (element && !Object.keys(sectionElements).includes(element.id)) {
        element = element.parentElement as Element;
        if (!element) break;
      }

      if (element) {
        activeSection = element as HTMLDivElement;
        activeSectionKey = sectionElements[element.id];
      }
    }

    // If no active section is found, return
    if (!activeSection || !activeSectionKey) {
      console.error("No active section detected");
      return;
    }

    // Create modal overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    // Create modal content
    const modal = document.createElement("div");
    modal.style.cssText = `
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 300px;
    `;

    // Add title
    const title = document.createElement("h3");
    title.textContent = "Insérer une table";
    title.style.cssText = "margin-top: 0; margin-bottom: 15px;margin-left:0;";

    // Row input
    const rowLabel = document.createElement("label");
    rowLabel.textContent = "Nombre de lignes:";
    rowLabel.style.display = "block";
    rowLabel.style.marginBottom = "5px";

    const rowInput = document.createElement("input");
    rowInput.type = "number";
    rowInput.value = "3";
    rowInput.min = "1";
    rowInput.style.cssText = `
      width: 100%;
      padding: 8px;
      margin-left:0;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    `;

    // Column input
    const colLabel = document.createElement("label");
    colLabel.textContent = "Nombre de colonnes:";
    colLabel.style.display = "block";
    colLabel.style.marginBottom = "5px";

    const colInput = document.createElement("input");
    colInput.type = "number";
    colInput.value = "3";
    colInput.min = "1";
    colInput.style.cssText = `
      width: 100%;
      padding: 8px;
      margin-left:0;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    `;

    // Button container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    `;

    // Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Annuler";
    cancelButton.style.cssText = `
      padding: 8px 12px;
      background-color: #f1f1f1;
      color: #4CAF50;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

    // Insert button
    const insertButton = document.createElement("button");
    insertButton.textContent = "Insérer";
    insertButton.style.cssText = `
      padding: 8px 12px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

    // Add event listeners
    cancelButton.onclick = () => {
      document.body.removeChild(overlay);
    };

    insertButton.onclick = () => {
      const rows = parseInt(rowInput.value);
      const cols = parseInt(colInput.value);

      if (rows > 0 && cols > 0) {
        // Create table HTML
        let tableHTML =
          '<table style="border-collapse: collapse; width: 100%; margin: 10px 0; direction: ltr;">';

        // Generate rows and cells
        for (let i = 0; i < rows; i++) {
          tableHTML += "<tr>";
          for (let j = 0; j < cols; j++) {
            tableHTML += `<td style="border: 1px solid #ccc; padding: 8px; text-align: left; direction: ltr;">Item [${i}][${j}]</td>`;
          }
          tableHTML += "</tr>";
        }

        tableHTML += "</table>";

        // Save current selection to restore after inserting table
        const savedSelection = saveSelection();

        // Try multiple insertion methods to ensure compatibility
        try {
          // Focus the active section
          activeSection.focus();

          // Method 1: Using execCommand
          document.execCommand("insertHTML", false, tableHTML);

          // If execCommand didn't work (check if table was inserted)
          setTimeout(() => {
            if (!document.querySelector("table")) {
              // Method 2: Insert at current selection
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();

                // Create a temporary div to hold our HTML
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = tableHTML;

                // Insert each child node
                while (tempDiv.firstChild) {
                  range.insertNode(tempDiv.firstChild);
                }

                // Move cursor after the table
                selection.collapseToEnd();
              } else {
                // Method 3: If no selection, append to the end
                activeSection.innerHTML += tableHTML;
              }
            }

            // Update the editorState to reflect the change
            if (activeSectionKey) {
              const newContent = activeSection.innerHTML;

              // Call handleContentChange programmatically
              const syntheticEvent = {
                target: activeSection,
              } as unknown as React.FormEvent<HTMLDivElement>;

              handleContentChange(activeSectionKey, syntheticEvent);
            }
          }, 10);

          console.log("Array table inserted successfully");
        } catch (error) {
          console.error("Error inserting table:", error);
          // Fallback method
          if (activeSection) {
            activeSection.innerHTML += tableHTML;

            // Update the editorState
            if (activeSectionKey) {
              const newContent = activeSection.innerHTML;

              // Call handleContentChange programmatically
              const syntheticEvent = {
                target: activeSection,
              } as unknown as React.FormEvent<HTMLDivElement>;

              handleContentChange(activeSectionKey, syntheticEvent);
            }
          }
        }
      }

      document.body.removeChild(overlay);
    };

    // Helper function to save current selection
    function saveSelection() {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        return {
          range: range,
          section: activeSectionKey,
        };
      }
      return null;
    }

    // Assemble modal
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(insertButton);

    modal.appendChild(title);
    modal.appendChild(rowLabel);
    modal.appendChild(rowInput);
    modal.appendChild(colLabel);
    modal.appendChild(colInput);
    modal.appendChild(buttonContainer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus on the first input
    rowInput.focus();
  };
  ////////////////////////////////////////////////////////////////////////////////

  type UserRole = "architect" | "historian" | "archaeologist" | "expert";

  // Define which sections each role can edit
  const sectionPermissions: Record<UserRole, Record<SectionKey, boolean>> = {
    architect: {
      architecture: true,
      histoire: false,
      archeologie: false,
      ressources: true,
    },
    historian: {
      architecture: false,
      histoire: true,
      archeologie: false,
      ressources: true,
    },
    archaeologist: {
      architecture: false,
      histoire: false,
      archeologie: true,
      ressources: true,
    },
    expert: {
      architecture: true,
      histoire: true,
      archeologie: true,
      ressources: true,
    },
  };

  // Add this to your component state
  const [userRole, setUserRole] = useState<UserRole>("expert");

  // Helper function to check if user can edit a specific section
  const canEditSection = (section: SectionKey): boolean => {
    return sectionPermissions[userRole][section];
  };

  // Updated render function with permissions check
  const renderSection = (section: SectionKey, title: string) => {
    const isEditable = canEditSection(section);
    const sectionRef = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    }[section];
  
    return (
      <>
        <h3>{title}</h3>
        <div
          id={`${section}Content`}
          ref={sectionRef}
          onMouseUp={handleTextSelection}
          onKeyUp={handleTextSelection}
          onInput={
            isEditable ? (e) => handleContentChange(section, e) : undefined
          }
          onKeyDown={
            isEditable
              ? (e) => {
                  // Force cursor position to be maintained on key events
                  if (e.key === "Backspace" || e.key === "Delete") {
                    const selection = window.getSelection();
                    if (selection && selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0);
                      setTimeout(() => {
                        try {
                          selection.removeAllRanges();
                          selection.addRange(range);
                        } catch (e) {
                          console.error(
                            "Error preserving selection on delete:",
                            e
                          );
                        }
                      }, 0);
                    }
                  }
                }
              : undefined
          }
          contentEditable={isEditable}
          dangerouslySetInnerHTML={{
            __html: editorState[section].content,
          }}
          className={`editor-content ${!isEditable ? "read-only" : ""}`}
          style={{
            fontFamily,
            direction: "ltr",
            textAlign: "left",
            unicodeBidi: "plaintext", // This is important for text direction
            caretColor: "currentColor", // Makes the cursor more visible
            opacity: isEditable ? 1 : 0.8,
            cursor: isEditable ? "text" : "default",
            // Force left-to-right text flow
            writingMode: "horizontal-tb",
          }}
          dir="ltr"
          lang="en" // Set appropriate language code for your content
          spellCheck={true}
          onFocus={(e) => {
            if (!isEditable) {
              e.target.blur();
              alert(`You don't have permission to edit the ${title} section.`);
            } else {
              setActiveSection(section); // Assuming you added this state
            }
          }}
        />
      </>
    );
  };
  // Add a role selector component (for testing purposes)
  const RoleSelector = () => {
    return (
      <div className="role-selector">
        <label>
          Select your role:
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
          >
            <option value="architect">Architect</option>
            <option value="historian">Historian</option>
            <option value="archaeologist">Archaeologist</option>
            <option value="expert">Expert</option>
          </select>
        </label>
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  /*
const [user, setUser] = useState<{
  id: string;
  name: string;
  role: UserRole;
} | null>(null);

// Mock authentication service (replace with your actual auth system)
const authService = {
  // This would be your actual authentication logic
  getCurrentUser: async () => {
    // For demonstration, return mock data
    // In a real app, this would check localStorage, cookies, or a backend API
    return {
      id: '123',
      name: 'John Doe',
      role: 'architect' as UserRole
    };
  },
  
  // Login function (mock)
  login: async (username: string, password: string) => {
    // Mock implementation
    console.log('Login attempt:', username);
    return {
      id: '123',
      name: username,
      role: username.includes('arch') ? 'architect' : 
             username.includes('hist') ? 'historian' : 
             username.includes('admin') ? 'admin' : 'guest'
    };
  }
};

// Load user on component mount
useEffect(() => {
  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setUserRole(currentUser.role);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      setUserRole('guest');
    }
  };
  
  loadUser();
}, []);

// Login form component
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await authService.login(username, password);
      setUser(user);
      setUserRole(user.role);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleLogin} className="login-form">
      <h3>Login to Edit Sections</h3>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Try 'architect', 'historian', etc."
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

// Update main component to include login
return (
  <div className="editor-page">
    {user ? (
      <>
        <div className="user-info">
          Logged in as: <strong>{user.name}</strong> ({user.role})
          <button 
            onClick={() => {
              setUser(null);
              setUserRole('guest');
            }}
            className="logout-button"
          >
            Logout
          </button>
        </div>
        {renderSection("architecture", "Architecture")}
        {renderSection("histoire", "Histoire")}
        {renderSection("archeologie", "Archeologie")}
        {renderSection("ressources", "Ressources")}
      </>
    ) : (
      <LoginForm />
    )}
  </div>
);

*/

  //////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////

  interface ExportedSection {
    html: string;
    plainText: string;
    metadata: {
      sectionKey: SectionKey;
      exportedAt: string;
      wordCount: number;
    };
  }
  /*Exports a section's content as HTML for database storage
   * @param sectionKey The section to export
   * @param sectionRef React ref to the section's DOM element
   * @param editorState Current editor state
   * @returns Object containing HTML, plaintext and metadata
   */
  const exportSectionAsHtml = (
    sectionKey: SectionKey,
    sectionRef: React.RefObject<HTMLDivElement>,
    editorState: any
  ): ExportedSection | null => {
    // Safety check
    if (!sectionRef.current) {
      console.error(
        `Cannot export section "${sectionKey}": DOM reference not found`
      );
      return null;
    }

    // Get HTML content directly from the DOM for most accurate representation
    const htmlContent = sectionRef.current.innerHTML;

    // Get plain text version (useful for searching, word counts, etc.)
    const plainText =
      sectionRef.current.innerText || sectionRef.current.textContent || "";

    // Calculate word count (simple split by spaces approach)
    const wordCount = plainText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    // Create export package with metadata
    const exportData: ExportedSection = {
      html: htmlContent,
      plainText: plainText,
      metadata: {
        sectionKey: sectionKey,
        exportedAt: new Date().toISOString(),
        wordCount: wordCount,
      },
    };

    return exportData;
  };

  /**
   * Sanitizes HTML content before database storage (removes potentially unsafe attributes)
   * @param html The HTML content to sanitize
   * @returns Sanitized HTML string
   */
  const sanitizeHtmlForStorage = (html: string): string => {
    // Create a temporary DOM element to parse and clean the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Find all elements with potentially unsafe attributes
    const allElements = tempDiv.querySelectorAll("*");
    allElements.forEach((el) => {
      // Remove event handlers and javascript: URLs
      Array.from(el.attributes).forEach((attr) => {
        if (
          attr.name.startsWith("on") ||
          (attr.name === "href" &&
            attr.value.toLowerCase().startsWith("javascript:"))
        ) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return tempDiv.innerHTML;
  };

  /**
   * Sends a section's HTML content to your database
   * @param sectionData The exported section data
   * @returns Promise resolving to the database response
   */
  const saveSectionToDatabase = async (
    sectionData: ExportedSection
  ): Promise<any> => {
    try {
      // Sanitize HTML before storage
      const sanitizedHtml = sanitizeHtmlForStorage(sectionData.html);

      // Create the payload to send to your database
      const payload = {
        sectionKey: sectionData.metadata.sectionKey,
        htmlContent: sanitizedHtml,
        plainText: sectionData.plainText,
        exportedAt: sectionData.metadata.exportedAt,
        wordCount: sectionData.metadata.wordCount,
      };
      const token = localStorage.getItem("token") ;
      // Replace with your actual API endpoint and method
      const response = await fetch("http://localhost:5000/api/sections/sections", {
        

        method: "PUT",
        headers: {
          Authorization : `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error saving section to database:", error);
      throw error;
    }
  };


  const exportAllSections = async () => {
    try {
      const token = localStorage.getItem('token');
      const sectionsData = {
        architecture: architectureRef.current?.innerHTML || '',
        histoire: histoireRef.current?.innerHTML || '',
        archeologie: archeologieRef.current?.innerHTML || '',
        ressources: ressourcesRef.current?.innerHTML || ''
      };
  
      const response = await fetch('http://localhost:5000/api/sections', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectionsData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to save sections');
      }
  
      setLastSaved("All changes saved");
    } catch (error) {
      console.error('Error saving sections:', error);
      setLastSaved("Error saving changes");
    }
  };
  /**
   * Example function to export all sections
   * @param sectionRefs Object containing refs to all section DOM elements
   * @param editorState Current editor state
   */
  /*const exportAllSections = async (
    sectionRefs: {
      architecture: React.RefObject<HTMLDivElement>;
      histoire: React.RefObject<HTMLDivElement>;
      archeologie: React.RefObject<HTMLDivElement>;
      ressources: React.RefObject<HTMLDivElement>;
    },
    editorState: any
  ) => {
    const sections: SectionKey[] = [
      "architecture",
      "histoire",
      "archeologie",
      "ressources",
    ];
    const results: Record<SectionKey, any> = {} as Record<SectionKey, any>;

    // Export each section
    for (const section of sections) {
      const exportedData = exportSectionAsHtml(
        section,
        sectionRefs[section],
        editorState
      );

      if (exportedData) {
        try {
          // Save to database
          const saveResult = await saveSectionToDatabase(exportedData);
          results[section] = { success: true, result: saveResult };
        } catch (error) {
          results[section] = { success: false, error };
        }
      } else {
        results[section] = {
          success: false,
          error: "Failed to export section",
        };
      }
    }

    return results;
  };*/

  const handleExportSection = async (sectionKey: SectionKey) => {
    // Get the correct ref for this section
    const sectionRef = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      ressources: ressourcesRef,
    }[sectionKey];

    try {
      // Show loading state if needed

      // Export the section
      const exportedData = exportSectionAsHtml(
        sectionKey,
        sectionRef as RefObject<HTMLDivElement>,
        editorState
      );

      if (!exportedData) {
        throw new Error("Failed to export section");
      }

      // Save to database
      const result = await saveSectionToDatabase(exportedData);

      // Show success message
      alert(`Section "${sectionKey}" exported successfully!`);
      console.log("Export result:", result);
    } catch (error) {
      // Handle errors
      console.error("Export error:", error);
      alert(
        `Failed to export section: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };
  return (
    <div className="editor-container">
      {/* Menu Bar */}
      <div className={`connection-status ${collaborationStatus}`}>
        {collaborationStatus === "connected"
          ? "Connected"
          : collaborationStatus === "connecting"
          ? "Connecting..."
          : "Disconnected"}
      </div>
      <div className="menu-bar">
        <div className="menu-left">
          <FileText />
          <div className="menu-title-container">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="menu-title-input"
            />
          </div>
        </div>

        <div className="menu-right">
          <button
            className="icon-button noBackground"
            onClick={() => setShowComments(!showComments)}
            aria-label="Toggle comments"
            title="Commentaires"
          >
            <MessageSquare />
            <span className="icon-button-text"></span>
          </button>
          <button
            title="inviter"
            onClick={handleShareClick}
            className="button button-primary  noBackground"
          >
            <Share2 />
            <span className="icon-button-text"></span>
          </button>
          {/* Share dialog */}
          <ShareDialog
            isOpen={isShareDialogOpen}
            onClose={() => setIsShareDialogOpen(false)}
            onShare={shareDocument}
          />
          <ActiveUsersList activeUsers={activeUsers} />
        </div>

        {/* Comments Panel */}
        {showComments && (
          <div className="comments-panel">
            <div className="comments-header">
              <h3 className="comments-title">Comments</h3>
              <button
                className="close-button"
                onClick={() => setShowComments(false)}
                aria-label="Close comments"
              >
                <X />
              </button>
            </div>

            {comments.length > 0 ? (
              <div className="comments-list">
               {comments.map(comment => {
  // Gestion sécurisée de la date
  const commentDate = comment.timestamp 
    ? new Date(comment.timestamp) 
    : new Date(); // Valeur par défaut si timestamp est undefined

  return (
    <div key={comment._id || `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}>
      <div className="comment-header">
        <span className="comment-author">{comment.author || 'Anonyme'}</span>
        <span className="comment-time">
          {commentDate.toLocaleString()}
        </span>
      </div>
      <div className="comment-text">{comment.text}</div>
    </div>
  );
})}
              </div>
            ) : (
              <div className="comments-empty">
                <MessageSquare />
                <p className="comments-empty-text">No comments yet</p>
                <p className="comments-empty-subtext">
                  Select text to add a comment
                </p>
              </div>
            )}

            {selectedText && (
              <div className="add-comment-form">
                <p className="selected-text">"{selectedText}"</p>
                <textarea
                  ref={commentInputRef}
                  placeholder="Add your comment..."
                  className="comment-input"
                  aria-label="Comment input"
                />
                <button
                  className="add-comment-button"
                  onClick={handleCommentSubmit}
                >
                  Add Comment
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-group">
          <button
            className="icon-button"
            onClick={() => activeSection && handleUndo(activeSection)}
            disabled={
              !activeSection || editorState[activeSection]?.historyIndex <= 0
            }
          >
            <Undo />
          </button>
          {showVideoDialog && (
            <div
              className="dialog-overlay"
              onClick={() => setShowVideoDialog(false)}
            >
              <div
                className="dialog-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="dialog-title">Insert Video</h3>
                <div className="dialog-options">
                  <button
                    className="dialog-option-button"
                    onClick={() => {
                      if (videoFileInputRef.current) {
                        videoFileInputRef.current.click();
                      }
                      setShowVideoDialog(false);
                    }}
                  >
                    Upload from computer
                  </button>

                  <div className="dialog-actions">
                    <button
                      type="button"
                      className="dialog-button dialog-button-cancel"
                      onClick={() => setShowVideoDialog(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showLinkDialog && (
            <div
              className="dialog-overlay"
              onClick={() => setShowLinkDialog(false)}
            >
              <div
                className="dialog-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="dialog-title">Insert Link</h3>
                <form onSubmit={handleLinkSubmit} className="dialog-form">
                  <div className="dialog-form-group">
                    <label htmlFor="link-text">Link Text</label>
                    <input
                      id="link-text"
                      type="text"
                      placeholder="Text to display"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      className="dialog-input"
                    />
                  </div>
                  <div className="dialog-form-group">
                    <label htmlFor="link-url">URL</label>
                    <input
                      id="link-url"
                      type="text"
                      placeholder="Enter URL"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="dialog-input"
                    />
                  </div>

                  <div className="dialog-actions">
                    <button
                      type="button"
                      className="dialog-button dialog-button-cancel"
                      onClick={() => setShowLinkDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="dialog-button dialog-button-insert"
                      disabled={!linkUrl}
                    >
                      Insert
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={videoFileInputRef}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              activeSection && handleVideoSelect(e, activeSection)
            }
            accept="video/*"
            style={{ display: "none" }}
          />

          <button
            className="icon-button"
            onClick={() => activeSection && handleRedo(activeSection)}
            disabled={
              !activeSection ||
              editorState[activeSection]?.historyIndex >=
                editorState[activeSection]?.history.length - 1
            }
          >
            <Redo />
          </button>
        </div>

        <div className="divider"></div>

        <div className="formatting-container" ref={headingDropdownRef}>
          <button
            className="format-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowHeadingDropdown(!showHeadingDropdown);
              setShowFontSizeDropdown(false);
              setShowFontFamilyDropdown(false);
            }}
          >
            <Type className="icon" {...({} as any)} />
            <span>{currentFormat}</span>
            <ChevronDown className="icon" {...({} as any)} />
          </button>
          {showHeadingDropdown && (
            <div className="format-dropdown">
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection && handleHeadingChange("h1", activeSection)
                }
              >
                Heading 1
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection && handleHeadingChange("h2", activeSection)
                }
              >
                Heading 2
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection && handleHeadingChange("h3", activeSection)
                }
              >
                Heading 3
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection && handleHeadingChange("p", activeSection)
                }
              >
                Normal text
              </button>
            </div>
          )}
        </div>

        <div className="dropdown" ref={fontFamilyDropdownRef}>
          <button
            className="dropdown-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowFontFamilyDropdown(!showFontFamilyDropdown);
              setShowHeadingDropdown(false);
              setShowFontSizeDropdown(false);
            }}
          >
            <span>{fontFamily}</span>
            <ChevronDown />
          </button>
          {showFontFamilyDropdown && (
            <div className="dropdown-content">
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection &&
                  handleFontFamilyChange(activeSection, "arial")
                }
              >
                Arial
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection &&
                  handleFontFamilyChange(activeSection, "Times New Roman")
                }
              >
                Times New Roman
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection &&
                  handleFontFamilyChange(activeSection, "Courier New")
                }
              >
                Courier New
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection &&
                  handleFontFamilyChange(activeSection, "Georgia")
                }
              >
                Georgia
              </button>
            </div>
          )}
        </div>

        <div className="dropdown" ref={fontSizeDropdownRef}>
          <button
            className="dropdown-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowFontSizeDropdown(!showFontSizeDropdown);
              setShowHeadingDropdown(false);
              setShowFontFamilyDropdown(false);
            }}
          >
            <span>{fontSize}</span>
            <ChevronDown />
          </button>
          {showFontSizeDropdown && (
            <div className="dropdown-content">
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection && handleFontSizeChange("small", activeSection)
                }
              >
                small
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection && handleFontSizeChange("normal", activeSection)
                }
              >
                normal
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection && handleFontSizeChange("medium", activeSection)
                }
              >
                medium
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection && handleFontSizeChange("large", activeSection)
                }
              >
                large
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection &&
                  handleFontSizeChange("x-large", activeSection)
                }
              >
                x-large
              </button>
            </div>
          )}
        </div>

        <div className="divider"></div>

        <div className="toolbar-group">
          <button
            className="icon-button"
            onClick={() => activeSection && formatDoc("bold", activeSection)}
            title="Gras"
          >
            <Bold />
          </button>
          <button
            className="icon-button"
            onClick={() => activeSection && formatDoc("italic", activeSection)}
            title="Italique"
          >
            <Italic />
          </button>
          <button
            className="icon-button"
            onClick={() =>
              activeSection && formatDoc("underline", activeSection)
            }
            title="Souligner"
          >
            <Underline />
          </button>
        </div>

        <div className="divider"></div>

        <div className="toolbar-group">
          <button
            className="icon-button"
            onClick={() => handleListOperation("insertUnorderedList")}
            title="liste á puces"
          >
            <List />
          </button>
          <button
            className="icon-button"
            onClick={() => handleListOperation("insertOrderedList")}
            title="Liste enumérer"
          >
            <ListOrdered />
          </button>
        </div>

        <div className="divider"></div>

        <div className="toolbar-group">
          <button
            className="icon-button"
            onClick={() =>
              activeSection && formatDoc("justifyLeft", activeSection)
            }
            title="Aligner á gauche"
          >
            <AlignLeft />
          </button>
          <button
            className="icon-button"
            onClick={() =>
              activeSection && formatDoc("justifycenter", activeSection)
            }
            title="Aligner au centre"
          >
            <AlignCenter />
          </button>
          <button
            className="icon-button"
            onClick={() =>
              activeSection && formatDoc("justifyright", activeSection)
            }
            title="Aligner á droite"
          >
            <AlignRight />
          </button>
        </div>

        <div className="divider"></div>

        <div className="toolbar-group">
          <button
            className="icon-button"
            onClick={handleLinkClick}
            title="Inserer un lien"
          >
            <Link />
          </button>
          <button
            className="icon-button"
            onClick={handleImageClick}
            title="Inserer image"
          >
            <ImageIcon />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              activeSection && handleFileSelect(e, activeSection)
            }
            accept="image/*"
            style={{ display: "none" }}
          />
          <button
            className="icon-button"
            onClick={() => setShowVideoDialog(true)}
            title="Inserer video"
          >
            <VideocamIcon />
          </button>
          <button
            title="inserer un tableau"
            className="icon-button"
            onClick={insertArray}
          >
            <InsertArrayIcon />
          </button>
          <div className="divider"></div>
          <button
            title="Exporter pdf"
            className="icon-button"
            onClick={exportToPDF}
          >
            <SaveAsPdfIcon />
          </button>
          <button
            onClick={() => {
              const allRefs = {
                architecture: architectureRef as RefObject<HTMLDivElement>,
                histoire: histoireRef as RefObject<HTMLDivElement>,
                archeologie: archeologieRef as RefObject<HTMLDivElement>,
                ressources: ressourcesRef as RefObject<HTMLDivElement>,
              };

              exportAllSections();
            }}
          >
            <SaveIcon />
          </button>
          <button
            title="Imprimer"
            className="icon-button"
            onClick={printDocument}
          >
            <PrintIcon />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="editor-wrapper">
          <div className="editor-page" onKeyDown={handleKeyDown}>
            <RoleSelector />

            {renderSection("architecture", "Architecture")}
            {renderSection("histoire", "Histoire")}
            {renderSection("archeologie", "Archeologie")}
            {renderSection("ressources", "Ressources")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
