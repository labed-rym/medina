/* <Type className="icon" {...({} as any)} />
<span>{currentFormat}</span>
<ChevronDown className="icon" {...({} as any)} />*/

import React, { ChangeEvent, SyntheticEvent } from "react";

import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

import { useState, useRef, useEffect } from "react";
import "./Editor (1).css";
//import { useAuth } from './your-auth-provider';

// In your component
//const { user } = useAuth();
import { Comment, TextRange, User, ShareOptions } from "./Types (1)";
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
import { MediaService } from "../../services/media.services.tsx";
import { CommentService } from "../../services/commentaires.services.tsx";
import { useParams } from "react-router-dom";
const API_BASE_URL = "http://localhost:5000/api";
const commentService = new CommentService(API_BASE_URL);
const mediaService = new MediaService(API_BASE_URL);
interface TextEditorProps {
  documentId: string;
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
        <h2 className="dialog-title">Inviter un collaborateur</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email du recepteur
            </label>
            <input
              ref={emailInputRef}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Entrer l'adresse email"
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="dialog-buttons">
            <button
              type="button"
              onClick={onClose}
              className="button button-cancel"
            >
              Annuler
            </button>
            <button type="submit" className="button button-primary">
              Inviter
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
        {activeUsers.map((user: User) => (
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
            <h3>Collaborateurs</h3>
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
                <span className={`user-role`}>{user.role}</span>
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
  initialContent = "",
  onContentChange,
  readOnly = false,
}) => {
  useEffect(() => {
    if (initialContent == "") {
      setContent(initialContent);
    }
  }, [initialContent]);
  const { documentId } = useParams<{ documentId: string }>();
  const userId = localStorage.getItem("userId");
  interface window {
    find(
      text: string,
      caseSensitive?: boolean,
      backwards?: boolean,
      wrap?: boolean,
      wholeWord?: boolean,
      searchInFrames?: boolean,
      showDialog?: boolean
    ): boolean;
  }
  const [documentTitle, setDocumentTitle] =
    useState<string>("Titre du document");

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
  const [currentFormat, setCurrentFormat] = useState("Texte normal");
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
  const pageWidth = 816;
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedText, setSelectedText] = useState<string>("");
  const [collaborationStatus, setCollaborationStatus] =
    useState<string>("disconnected");

  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const collaborationServiceRef = useRef<CollaborationService | null>(null);

  const [temporaryMedia, setTemporaryMedia] = useState<{
    architecture: File[];
    histoire: File[];
    archeologie: File[];
    resources: File[];
  }>({
    architecture: [],
    histoire: [],
    archeologie: [],
    resources: [],
  });

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
    resources: {
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
  const resourcesRef = useRef<HTMLDivElement>(null);
  // Define a proper type for your sections mapping
  interface SectionRefs {
    architecture: RefObject<HTMLElement>;
    histoire: RefObject<HTMLElement>;
    archeologie: RefObject<HTMLElement>;
    resources: RefObject<HTMLElement>;
  }

  // Create a unified state object
  const [editorState, setEditorState] = useState<EditorState>({
    architecture: { content: "", history: [""], historyIndex: 0 },
    histoire: { content: "", history: [""], historyIndex: 0 },
    archeologie: { content: "", history: [""], historyIndex: 0 },
    resources: { content: "", history: [""], historyIndex: 0 },
    isUndoRedo: false,
  });
  const headingDropdownRef = useRef<HTMLDivElement>(null);
  type SectionKey = "architecture" | "histoire" | "archeologie" | "resources";
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
  // Add this state near your other state declarations
  const [storedSelection, setStoredSelection] = useState<{
    text: string;
    range: Range | null;
    section: SectionKey | null;
  }>({
    text: "",
    range: null,
    section: null,
  });
  const [setSavedSelection] = useState<SavedSelection | null>(null);

  interface SectionState {
    content: string;
    history: string[];
    historyIndex: number;
  }

  interface EditorState {
    architecture: SectionState;
    histoire: SectionState;
    archeologie: SectionState;
    resources: SectionState;
    isUndoRedo: boolean;
  }
  const fetchProjectDetails = async () => {
    if (!documentId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/oeuvre/donnee/${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }

      const projectData = await response.json();
      console.log("project data :",projectData);
      setDocumentTitle(projectData.data.titre || "Titre du document");
      
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  // Appelez cette fonction au chargement du composant
  useEffect(() => {
    fetchProjectDetails();
  }, [documentId]);


  // Replace your existing handleSelectionChange function
  const handleSelectionChange = (e: Event) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedStr = selection.toString().trim();

    // Check if clicking in comments panel
    if (e.type === "mouseup") {
      const target = e.target as Node;
      const commentsPanel = document.querySelector(".comments-panel");

      // If clicking in comments panel, preserve selection
      if (commentsPanel && commentsPanel.contains(target)) {
        if (storedSelection.text) {
          setSelectedText(storedSelection.text);
          setSelectedRange(storedSelection.range);
          setActiveSection(storedSelection.section);
          return;
        }
      }
    }

    if (selectedStr) {
      const sections: Record<SectionKey, RefObject<HTMLDivElement | null>> = {
        architecture: architectureRef,
        histoire: histoireRef,
        archeologie: archeologieRef,
        resources: resourcesRef,
      };

      // Find which section contains the selection
      let detectedSection: SectionKey | null = null;

      for (const [section, ref] of Object.entries(sections)) {
        if (
          ref.current &&
          ref.current.contains(range.commonAncestorContainer)
        ) {
          detectedSection = section as SectionKey;
          break;
        }
      }
      if (detectedSection) {
        // Store selection for future reference
        setStoredSelection({
          text: selectedStr,
          range: range,
          section: detectedSection,
        });

        // Also update current selection
        setSelectedText(selectedStr);
        setSelectedRange(range);
        setActiveSection(detectedSection);

        if (!showComments) {
          setShowComments(true);
        }
      }
    } else {
      // Don't clear if clicking in comments panel
      const target = e.target as Node;
      const commentsPanel = document.querySelector(".comments-panel");
      if (!(commentsPanel && commentsPanel.contains(target))) {
        setSelectedText("");
        setSelectedRange(null);
        setStoredSelection({ text: "", range: null, section: null });
      }
    }
  };

  
  // Update the content and history for the specific section
  useEffect(() => {
    if (!activeSection) return;

    const sectionRefMap = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      resources: resourcesRef,
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
      resources: resourcesRef,
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

  // Add these variables at the component level (outside any function)
  let savedRange: Range | null = null;
  let hasSelection: boolean = false;

  // Add this function to save the selection state when opening the dropdown
  // Define a type for stored selection
  interface StoredSelection {
    text: string;
    range: Range | null;
    section: SectionKey | null;
  }

  // Store selection at component level

  // Function to save selection when dropdown is opened

  // Improved heading change handler

  // Modified heading change function that uses the saved selection
  // Add these variables at the component level
  let savedSelection: {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
    text: string;
  } | null = null;

  // Function to save the current selection more reliably
  const saveSelectionState = (): void => {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Store essential information about the selection
      savedSelection = {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset,
        text: selection.toString(),
      };
      if (savedSelection) console.log("Selection saved:", savedSelection.text);
    } else {
      savedSelection = null;
    }
  };

  // Call this function when dropdown is opened

  // Improved heading change handler

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
      resources: resourcesRef,
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
      resources: resourcesRef,
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
      resources: resourcesRef,
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
      resources: resourcesRef,
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
  // Function to save current selection
  interface StoredSelection {
    text: string;
    range: Range | null;
    section: SectionKey | null;
  }

  const toggleHeadingDropdown = (): void => {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString().trim();

      if (selectedText) {
        // Determine which section contains this selection
        const sections: Record<SectionKey, RefObject<HTMLDivElement | null>> = {
          architecture: architectureRef,
          histoire: histoireRef,
          archeologie: archeologieRef,
          resources: resourcesRef,
        };

        let detectedSection: SectionKey | null = null;

        for (const [section, ref] of Object.entries(sections)) {
          if (
            ref.current &&
            ref.current.contains(range.commonAncestorContainer)
          ) {
            detectedSection = section as SectionKey;
            break;
          }
        }

        if (detectedSection) {
          // Store selection for later use
          setStoredSelection({
            text: selectedText,
            range: range.cloneRange(), // Clone to preserve
            section: detectedSection,
          });

          console.log(
            "Selection saved:",
            selectedText,
            "in section:",
            detectedSection
          );
        }
      }
    }

    // Toggle dropdown
    setShowHeadingDropdown((prev) => !prev);
  };

  // Improved heading change handler
  const handleHeadingChange = (
    headingType: string,
    activeSection?: SectionKey
  ): void => {
    const formatLabels: { [key: string]: string } = {
      h1: "Titre 1",
      h2: "Titre 2",
      h3: "Titre 3",
      p: "Texte normal",
    };

    setCurrentFormat(formatLabels[headingType]);
    setShowHeadingDropdown(false);

    // Determine the active section
    let currentSection = activeSection;
    if (!currentSection) {
      currentSection =
        storedSelection.section || (getActiveSection() as SectionKey);
    }

    // Create a mapping of section names to refs
    const sections = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      resources: resourcesRef,
    };

    const sectionRef = sections[currentSection];
    if (!sectionRef || !sectionRef.current) return;

    // Focus the section
    sectionRef.current.focus();

    // HANDLE SELECTION
    if (storedSelection.text && storedSelection.range) {
      try {
        console.log("Applying heading to selected text:", storedSelection.text);

        // Get the selection
        const selection = window.getSelection();
        if (!selection) return;

        // Clear any current selection
        selection.removeAllRanges();

        // Check if the stored range is still valid
        let isRangeValid = false;
        try {
          // Try to check if range is still valid (in the document)
          isRangeValid = document.contains(
            storedSelection.range.commonAncestorContainer
          );
        } catch (e) {
          console.error("Error checking range validity:", e);
        }

        if (isRangeValid) {
          // Use the stored range directly since it's still valid
          selection.addRange(storedSelection.range.cloneRange());

          // Apply heading to the selection
          const range = selection.getRangeAt(0);

          // Create heading element
          const newHeading = document.createElement(headingType);

          // Extract and preserve content
          const fragment = range.extractContents();
          newHeading.appendChild(fragment);

          // Insert the new heading
          range.insertNode(newHeading);

          // Clean up selection
          selection.removeAllRanges();
        } else {
          // If stored range is no longer valid, try to find the text
          console.log("Stored range no longer valid, searching for text");

          // Create a text finder function (simplified version)
          const findTextInSection = (
            section: HTMLElement,
            text: string
          ): Range | null => {
            if (!text || !section) return null;

            // Get all text nodes
            const textNodes: Text[] = [];
            const walker = document.createTreeWalker(
              section,
              NodeFilter.SHOW_TEXT,
              null
            );

            let node;
            while ((node = walker.nextNode())) {
              textNodes.push(node as Text);
            }

            // Search for exact text
            for (const textNode of textNodes) {
              const content = textNode.textContent || "";
              const index = content.indexOf(text);

              if (index >= 0) {
                const range = document.createRange();
                range.setStart(textNode, index);
                range.setEnd(textNode, index + text.length);
                return range;
              }
            }

            return null;
          };

          // Find the text in the section
          const foundRange = findTextInSection(
            sectionRef.current,
            storedSelection.text
          );

          if (foundRange) {
            // Apply the heading to the found text
            selection.removeAllRanges();
            selection.addRange(foundRange);

            // Create heading element
            const newHeading = document.createElement(headingType);

            // Extract and preserve content
            const fragment = foundRange.extractContents();
            newHeading.appendChild(fragment);

            // Insert the new heading
            foundRange.insertNode(newHeading);

            // Clean up selection
            selection.removeAllRanges();
          } else {
            // Fallback if we can't find the text
            console.warn(
              "Could not find stored text in section",
              storedSelection.text
            );
            document.execCommand("formatBlock", false, `<${headingType}>`);
          }
        }
      } catch (e) {
        console.error("Error applying heading to selection:", e);

        // Fallback to execCommand
        document.execCommand("formatBlock", false, `<${headingType}>`);
      }
    } else {
      // No selection, apply heading at cursor position
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        document.execCommand("formatBlock", false, `<${headingType}>`);
        return;
      }

      // Get current block element at cursor
      const range = selection.getRangeAt(0);
      let currentNode = range.startContainer;

      // Find closest block element
      let closestBlock = null;
      while (currentNode && currentNode !== sectionRef.current) {
        if (
          currentNode.nodeType === Node.ELEMENT_NODE &&
          ["P", "H1", "H2", "H3", "DIV"].includes(
            (currentNode as Element).tagName
          )
        ) {
          closestBlock = currentNode;
          break;
        }
        currentNode = currentNode.parentNode as Node;
      }

      if (closestBlock) {
        // Transform this block
        try {
          // Create new heading
          const newHeading = document.createElement(headingType);
          newHeading.innerHTML = (closestBlock as HTMLElement).innerHTML;

          // Remember cursor position
          const originalOffset = range.startOffset;

          // Replace the block
          if (closestBlock.parentNode) {
            closestBlock.parentNode.replaceChild(newHeading, closestBlock);

            // Try to restore cursor
            setTimeout(() => {
              try {
                const newSelection = window.getSelection();
                if (!newSelection) return;

                newSelection.removeAllRanges();

                // Find a suitable text node
                let targetNode: Node | null = null;
                let targetOffset = originalOffset;

                const walker = document.createTreeWalker(
                  newHeading,
                  NodeFilter.SHOW_TEXT,
                  null
                );

                // Find first text node
                targetNode = walker.nextNode();

                if (targetNode) {
                  // Place cursor at same relative position
                  targetOffset = Math.min(
                    originalOffset,
                    targetNode.textContent?.length || 0
                  );
                } else {
                  targetNode = newHeading;
                  targetOffset = 0;
                }

                // Set selection
                const newRange = document.createRange();
                newRange.setStart(targetNode, targetOffset);
                newRange.collapse(true);
                newSelection.addRange(newRange);
              } catch (e) {
                console.error("Error restoring cursor:", e);
              }
            }, 0);
          }
        } catch (e) {
          console.error("Error transforming block:", e);
          document.execCommand("formatBlock", false, `<${headingType}>`);
        }
      } else {
        // No suitable block found, use execCommand
        document.execCommand("formatBlock", false, `<${headingType}>`);
      }
    }

    // Trigger save event
    const changeEvent = new Event("input", { bubbles: true });
    sectionRef.current.dispatchEvent(changeEvent);

    // Clear stored selection
    setStoredSelection({
      text: "",
      range: null,
      section: null,
    });
  };

  // First useEffect - Check page overflow for each section
  useEffect(() => {
    // Check if content exceeds page height and add new page if needed
    const checkPageOverflow = () => {
      // Create a mapping of section names to refs
      const sections = {
        architecture: architectureRef,
        histoire: histoireRef,
        archeologie: archeologieRef,
        resources: resourcesRef,
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
      resources: resourcesRef,
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
      resources: resourcesRef,
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
      resources: resourcesRef,
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
    const handleUsersUpdate = (users: User[]) => {
      setActiveUsers(users);
    };

    const handleCommentsUpdate = (newComments: Comment[]) => {
      setComments((prevComments) => {
        // Merge and deduplicate by comment ID
        const merged = [...prevComments, ...newComments];
        return merged.filter(
          (comment, index, self) =>
            index === self.findIndex((c) => c.id === comment.id)
        );
      });
    };

    const service = new CollaborationService(
      documentId || "",
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

  // Add a comment to the selected text
  // Dans Editor (5).tsx

  useEffect(() => {
    console.log("Current comments in state:", comments);
  }, [comments]);

  const addComment = async (commentText: string): Promise<void> => {
    const commentSection = activeSection || storedSelection.section;
    const commentSelection = selectedText || storedSelection.text;
    const commentRange = selectedRange || storedSelection.range;
  
    if (commentSelection && commentSection && commentText.trim() !== "" && collaborationServiceRef.current) {
      try {
        if (!userId) {
          console.error("User ID not found in local storage");
          return;
        }
  
        if (!documentId) {
          console.error("document id not found");
          return;
        }
  
        // Send comment to backend with all details
        const backendComment = await commentService.addComment(
          documentId,
          userId,
          commentText,
          commentSelection,
          commentSection,
          {
            start: commentRange ? commentRange.startOffset : 0,
            end: commentRange ? commentRange.endOffset : commentSelection.length
          }
        );
  
        // Create full comment object
        const newComment: Comment = {
          id: backendComment.id || Date.now(),
          contenu: commentText,
          selection: commentSelection,
          position: {
            start: commentRange ? commentRange.startOffset : 0,
            end: commentRange ? commentRange.endOffset : commentSelection.length
          },
          section: commentSection,
          utilisateur_id: backendComment.author || userId,
          date_creation: new Date(backendComment.timestamp || Date.now())
        };
  
        // Add via collaboration service
        await collaborationServiceRef.current.addComment(newComment);
  
        // Clear selections
        setSelectedText("");
        setSelectedRange(null);
        setStoredSelection({ text: "", range: null, section: null });
  
        // Refresh comments from backend
        const updatedComments = await commentService.getCommentsByOeuvre(documentId);
        setComments(updatedComments);
      } catch (error) {
        console.error("Failed to add comment", error);
        // Fallback: local comment if backend fails
        const newComment: Comment = {
          id: Date.now(),
          contenu: commentText,
          selection: commentSelection,
          position: {
            start: commentRange ? commentRange.startOffset : 0,
            end: commentRange ? commentRange.endOffset : commentSelection.length
          },
          section: commentSection,
          utilisateur_id: "Vous",
          date_creation: new Date(),
        };
  
        setComments((prev) => [...prev, newComment]);
        setSelectedText("");
        setSelectedRange(null);
        setStoredSelection({ text: "", range: null, section: null });
  
        alert("Comment was saved locally (server error)");
      }
    }
  };
  useEffect(() => {
    // Store selection state variables outside the handler
    let savedSelection: Range | null = null;
    let savedText: string = "";
    let isProcessingSelection: boolean = false;

    const handleSelectionChange = (): void => {
      // Only process selection if comment panel is open and we're not already processing
      if (showComments && !isProcessingSelection) {
        const selection = window.getSelection();

        // Check if we have a valid selection with length
        if (selection && selection.toString().length > 0) {
          // Save the current selection
          const range = selection.getRangeAt(0);
          savedText = selection.toString();
          savedSelection = range;

          // Update state with selection info
          setSelectedText(savedText);
          setSelectedRange(savedSelection);
        }
      }
    };

    // Handle clicks on the comment panel to prevent losing selection
    const handleCommentPanelInteraction = (e: MouseEvent): void => {
      // Check if click is within the comment panel
      const commentPanel = document.getElementById("comment-panel"); // Update with your actual panel ID
      if (commentPanel && commentPanel.contains(e.target as Node)) {
        // Prevent default to avoid losing selection
        e.stopPropagation();

        // If we have a saved selection, make sure it's still active
        if (savedSelection && savedText) {
          isProcessingSelection = true;

          // Keep the selection and range active in state
          setSelectedText(savedText);
          setSelectedRange(savedSelection);

          // Small delay to prevent selection handling conflicts
          setTimeout(() => {
            isProcessingSelection = false;
          }, 100);
        }
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("mousedown", handleCommentPanelInteraction);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mouseup", handleSelectionChange);
      document.removeEventListener("mousedown", handleCommentPanelInteraction);
    };
  }, [showComments]); // Re-create effect when showComments state changes
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

  // Add delete image function
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: SectionKey
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Store the file temporarily
      setTemporaryMedia((prev) => ({
        ...prev,
        [section]: [...prev[section], file],
      }));

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          insertImage(event.target.result.toString(), section);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSectionMedia = async (section: SectionKey) => {
    const files = temporaryMedia[section];
    if (!files.length) return;

    const userId = localStorage.getItem("userId");
    if (!userId || !documentId) return;

    try {
      // Get the section ref
      const sectionRef = {
        architecture: architectureRef,
        histoire: histoireRef,
        archeologie: archeologieRef,
        resources: resourcesRef,
      }[section];

      if (!sectionRef.current) return;

      // Find all images that need processing
      const imagesToProcess = sectionRef.current.querySelectorAll(
        'img[data-needs-processing="true"]'
      );

      // Process each image with its corresponding file
      let fileIndex = 0;
      for (const img of imagesToProcess) {
        if (fileIndex < files.length) {
          const file = files[fileIndex++];

          // Upload the file
          const response = await mediaService.uploadMedia(
            file,
            file.name,
            userId,
            documentId,
            section
          );
          console.log("response", response);
          if (response && response.data.id) {
            // Set the real DB ID as data-media-id
            img.setAttribute("data-media-id", response.data.id);
            console.log("Image ID set:", img.getAttribute("data-media-id"));
            // Remove the processing flag
            img.removeAttribute("data-needs-processing");
          }
        }
      }

      // Clear temporary media after successful save
      setTemporaryMedia((prev) => ({
        ...prev,
        [section]: [],
      }));

      // Trigger a content change to save the updated image IDs
      if (sectionRef.current) {
        const changeEvent = new Event("input", { bubbles: true });
        sectionRef.current.dispatchEvent(changeEvent);
      }
    } catch (error) {
      console.error(`Failed to save media for ${section}:`, error);
      alert(`Failed to save media for ${section}`);
    }
  };
  // Updated insertImage function with proper event typing
  const insertImage = (imageData: string, section: SectionKey) => {
    // Get the correct ref based on the section
    const sectionRefs = {
      architecture: architectureRef,
      histoire: histoireRef,
      archeologie: archeologieRef,
      resources: resourcesRef,
    };

    const currentRef = sectionRefs[section];

    if (currentRef && currentRef.current) {
      try {
        // Save selection if it exists
        const selection = window.getSelection();
        let range = null;

        if (selection && selection.rangeCount > 0) {
          const currentRange = selection.getRangeAt(0);
          const container = currentRange.commonAncestorContainer;

          // Check if the selection is within the target section
          if (currentRef.current.contains(container)) {
            range = currentRange.cloneRange();
          }
        }

        // Focus on the section
        currentRef.current.focus();

        // Restore selection if applicable
        if (selection && range) {
          selection.removeAllRanges();
          selection.addRange(range);
        }

        // Insert the image at cursor position using execCommand
        document.execCommand("insertImage", false, imageData);

        // Find the newly inserted image and mark it for processing
        setTimeout(() => {
          const images = currentRef.current
            ? currentRef.current.querySelectorAll("img")
            : [];
          if (images) {
            // Find the last inserted image (most likely the one we just added)
            const lastImage = images[images.length - 1];
            if (lastImage && lastImage.src === imageData) {
              lastImage.setAttribute("data-needs-processing", "true");
            }
          }
        }, 0);

        // Create a native input event
        const inputEvent = new Event("input", { bubbles: true });
        currentRef.current.dispatchEvent(inputEvent);

        // Get the updated content after image insertion
        const newContent = currentRef.current.innerHTML;

        // Directly update the editor state
        setEditorState((prevState) => {
          const newHistory = [
            ...prevState[section].history.slice(
              0,
              prevState[section].historyIndex + 1
            ),
            newContent,
          ];

          return {
            ...prevState,
            [section]: {
              content: newContent,
              history: newHistory,
              historyIndex: newHistory.length - 1,
            },
          };
        });
      } catch (error) {
        console.error(`Error inserting image into section ${section}:`, error);
      }
    }
  };

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const handleShareClick = () => {
    setIsShareDialogOpen(true);
    // Reset any previous share status when opening the dialog
    setShareStatus({ message: "", type: null });
  };
  const shareDocument = async (recipientEmail: string): Promise<void> => {
    if (!collaborationServiceRef.current || !documentId) {
      alert("Collaboration service or document ID not available.");
      return;
    }

    try {
      // Envoyer l'invitation via l'API de notifications
      const response = await fetch(`${API_BASE_URL}/notifications/inviter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          emailInvite: recipientEmail,
          idOeuvre: documentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send invitation");
      }

      // Fermer le dialogue et afficher un message de succès
      setIsShareDialogOpen(false);
      alert(`Invitation sent successfully to ${recipientEmail}`);
    } catch (error) {
      console.error("Failed to share document", error);
      alert(
        `Failed to share document: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
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
      resources: resourcesRef,
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
      resourcesContent: "resources",
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

  type UserRole = "architecte" | "historien" | "archeologue"|"expert";

  // Define which sections each role can edit
  const sectionPermissions: Record<UserRole, Record<SectionKey, boolean>> = {
    architecte: {
      architecture: true,
      histoire: false,
      archeologie: false,
      resources: true,
    },
    historien: {
      architecture: false,
      histoire: true,
      archeologie: false,
      resources: true,
    },
    archeologue: {
      architecture: false,
      histoire: false,
      archeologie: true,
      resources: true,
    },
    expert: { // Added expert role with full permissions
      architecture: true,
      histoire: true,
      archeologie: true,
      resources: true,
    }
  };

  // Add this to your component state
  const [userRole, setUserRole] = useState<UserRole>(() => {
    // Get role from localStorage or default to 'architecte'
    const role = localStorage.getItem("userSpecialite") as UserRole;
    return role || 'architecte';
  });

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
      resources: resourcesRef,
    }[section];

    return (
      <>
        <h3>{title}</h3>
        <div
          id={`${section}Content`}
          ref={sectionRef}
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
  /*const RoleSelector = () => {
    return (
      <div className="role-selector">
        <label>
          Select your role:
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
          >
            <option value="architecte">architecte</option>
            <option value="historien">historien</option>
            <option value="archeologue">archeologue</option>
            <option value="expert">Expert</option>
          </select>
        </label>
      </div>
    );
  };*/
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
             username.includes('hist') ? 'historien' : 
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
            placeholder="Try 'architect', 'historien', etc."
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
        {renderSection("resources", "resources")}
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

  function processHtmlContent(html: string): string {
    // Create a DOM parser to manipulate the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    console.log("doc :", doc);
    // Process all media elements (img, video, etc.)
    const mediaElements = doc.querySelectorAll("img, video");
    console.log("mediaElements :", mediaElements);
    mediaElements.forEach((element) => {
      // Get the src attribute
      const src = element.getAttribute("src");

      // Skip if it's already a placeholder or doesn't have a src
      if (!src || src.startsWith("[MEDIA:")) return;

      // Check for data-media-id attribute (this would be the real DB ID)
      const mediaId = element.getAttribute("data-media-id");
      console.log("mediaId :", mediaId);
      if (mediaId) {
        // If we have a real DB ID, use it in the placeholder
        element.setAttribute("src", `[MEDIA:${mediaId}]`);
      }
      // For images with data URLs (base64 encoded)
      else if (src.startsWith("data:")) {
        // Generate a temporary ID for the media that will be replaced later
        const tempMediaId = `temp_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        element.setAttribute("data-media-id", tempMediaId);
        element.setAttribute("src", `[MEDIA:${tempMediaId}]`);

        // Mark it as needing processing
        element.setAttribute("data-needs-processing", "true");
      }
    });
    console.log("doc new :", doc);
    return doc.body.innerHTML;
  }
  const saveSectionToDatabase = async (
    sectionData: ExportedSection
  ): Promise<any> => {
    try {
      // 1. First upload all media files
      if (!sectionData.plainText?.trim() || !sectionData.html?.trim()) {
        console.warn(
          `Skipping empty section: ${sectionData.metadata.sectionKey}`
        );
        return { success: true, skipped: true };
      }
      // 2. Process HTML to replace actual media with placeholders
      const processedHtml = await processHtmlContent(sectionData.html);
      console.log("html apres fct :", processedHtml);
      // 3. Sanitize the processed HTML
      const sanitizedHtml = sanitizeHtmlForStorage(processedHtml);
      console.log("apres sanitize :", sanitizedHtml);
      const specialite = localStorage.getItem("userSpecialite");
      const type = localStorage.getItem("userRole");
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // 4. Create payload with processed content
      const payload = {
        documentId: documentId,
        utilisateur_id: userId,
        specialite: specialite,
        type: type,
        titre: sectionData.metadata.sectionKey,
        htmlContent: sanitizedHtml, // This now contains placeholders
        content: sectionData.plainText,
        exportedAt: sectionData.metadata.exportedAt,
        wordCount: sectionData.metadata.wordCount,
      };

      // 5. Send to backend
      const response = await fetch(`${API_BASE_URL}/sections/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving section to database:", error);
      throw error;
    }
  };

  const [mediaList, setMediaList] = useState<{ [key: string]: any[] }>({
    architecture: [],
    histoire: [],
    archeologie: [],
    resources: [],
  });

  // Ajoutez cette fonction après vos autres fonctions utilitaires
  const restoreMediaUrls = (html: string) => {
    if (!html) return "";

    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Find all placeholders and replace them with actual URLs
    const mediaElements = doc.querySelectorAll(
      'img[src^="[MEDIA:"], video[src^="[MEDIA:"]'
    );
    console.log("mediaElements of restore medias :", mediaElements);
    mediaElements.forEach((element) => {
      const src = element.getAttribute("src");
      if (src) {
        // Extract the media ID from the placeholder
        const mediaIdMatch = src.match(/\[MEDIA:([^\]]+)\]/);
        if (mediaIdMatch && mediaIdMatch[1]) {
          const mediaId = mediaIdMatch[1];

          // Store the media ID as a data attribute for future reference
          element.setAttribute("data-media-id", mediaId);

          // Replace with the actual URL
          element.setAttribute("src", `${API_BASE_URL}/medias/${mediaId}`);
          console.log("src of media :", element.getAttribute("src"));
        }
      }
    });

    return doc.body.innerHTML;
  };
  // Ajoutez ce useEffect après vos autres useEffects
  useEffect(() => {
    const loadSectionContent = async () => {
      if (!documentId) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token d'authentification non trouvé");
          return;
        }

        // Charger les sections du projet
        const response = await fetch(`${API_BASE_URL}/sections/${documentId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `Erreur lors du chargement des sections: ${response.status}`
          );
        }

        const sections = await response.json();
        console.log("sections recuperees :", sections);
        // Mettre à jour l'état de l'éditeur avec le contenu chargé
        setEditorState((prevState) => {
          const newState = { ...prevState };

          sections.forEach((section: any) => {
            if (section.titre && section.contenu_html) {
              const sectionKey = section.titre as SectionKey;
              if (newState[sectionKey]) {
                // Restaurer les URLs des médias dans le contenu HTML
                const processedContent = restoreMediaUrls(section.contenu_html);
                console.log("processed content :", processedContent);
                newState[sectionKey] = {
                  ...newState[sectionKey],
                  content: processedContent,
                  history: [processedContent],
                  historyIndex: 0,
                };
              }
            }
          });

          return newState;
        });
      } catch (error) {
        console.error("Erreur lors du chargement des sections:", error);
      }
    };

    loadSectionContent();
  }, [documentId]);

  // Add this useEffect to fetch media when documentId changes
  useEffect(() => {
    const fetchMedia = async () => {
      if (!documentId) return;

      try {
        const mediaData = await mediaService.getMediasByOeuvre(documentId);
        console.log("Fetched media:", mediaData);

        // Organize media by section
        const organizedMedia: { [key: string]: any[] } = {
          architecture: [],
          histoire: [],
          archeologie: [],
          resources: [],
        };

        mediaData.data.forEach((media: any) => {
          if (organizedMedia.hasOwnProperty(media.id_section)) {
            organizedMedia[media.id_section].push(media);
          }
        });

        setMediaList(organizedMedia);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, [documentId]);

  /**
   * Example function to export all sections
   * @param sectionRefs Object containing refs to all section DOM elements
   * @param editorState Current editor state
   */
  const exportAllSections = async (
    sectionRefs: {
      architecture: React.RefObject<HTMLDivElement>;
      histoire: React.RefObject<HTMLDivElement>;
      archeologie: React.RefObject<HTMLDivElement>;
      resources: React.RefObject<HTMLDivElement>;
    },
    editorState: any
  ) => {
    const sections: SectionKey[] = [
      "architecture",
      "histoire",
      "archeologie",
      "resources",
    ];
    const results: Record<SectionKey, any> = {} as Record<SectionKey, any>;
    for (const section of sections) {
      if (temporaryMedia[section].length > 0) {
        try {
          console.log("there is a file for :", section);
          await saveSectionMedia(section);
        } catch (error) {
          console.error(`Error saving media for ${section}:`, error);
          results[section] = { success: false, error: "Media upload failed" };
          continue;
        }
      }
    }
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
  };

  const handleExportSection = async (sectionKey: SectionKey) => {
    try {
      // First save any pending media
      await saveSectionMedia(sectionKey);

      // Then export the section content
      const sectionRef = {
        architecture: architectureRef,
        histoire: histoireRef,
        archeologie: archeologieRef,
        resources: resourcesRef,
      }[sectionKey];

      const exportedData = exportSectionAsHtml(
        sectionKey,
        sectionRef as RefObject<HTMLDivElement>,
        editorState
      );

      if (!exportedData) {
        throw new Error("Failed to export section");
      }

      const result = await saveSectionToDatabase(exportedData);
      alert(`Section "${sectionKey}" exported successfully!`);
    } catch (error) {
      console.error("Export error:", error);
      alert(
        `Failed to export section: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };
  /*
  // Define the enhanced section types with IDs
interface SectionData {
  id: string;
  sectionKey: SectionKey;
  htmlContent: string;
  plainText: string;
  exportedAt: string;
  wordCount: number;
}

interface EditorSectionState {
  id: string | null; // Now includes a database ID
  content: string;
  lastSaved: string | null;
}

type EditorState = Record<SectionKey, EditorSectionState>;

// Enhanced export structure with ID
interface ExportedSection {
  id: string | null; // Can be null for new sections
  html: string;
  plainText: string;
  metadata: {
    sectionKey: SectionKey;
    exportedAt: string;
    wordCount: number;
  };
}


 //* Loads section content from the database
 //* @param sectionKey The section key to load
 //* @returns Promise resolving to the section data
 //
const loadSectionFromDatabase = async (
  sectionKey: SectionKey
): Promise<SectionData | null> => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(`YOUR_API_ENDPOINT/sections/${sectionKey}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`Section ${sectionKey} not found in database`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading ${sectionKey} from database:`, error);
    return null;
  }
};

///**
 //* Loads all sections from the database
 //* @returns Promise resolving to an object with all section data
 //
const loadAllSectionsFromDatabase = async (): Promise<Record<SectionKey, SectionData | null>> => {
  const sections: SectionKey[] = [
    "architecture",
    "histoire",
    "archeologie",
    "resources",
  ];
  
  const results: Record<SectionKey, SectionData | null> = {} as Record<SectionKey, SectionData | null>;
  
  // Load each section in parallel
  await Promise.all(
    sections.map(async (section) => {
      results[section] = await loadSectionFromDatabase(section);
    })
  );
  
  return results;
};

///**
// * Initializes the editor state with content from the database
 //
const initializeEditorFromDatabase = async (): Promise<EditorState> => {
  const dbSections = await loadAllSectionsFromDatabase();
  
  const initialState: EditorState = {
    architecture: {
      id: dbSections.architecture?.id || null,
      content: dbSections.architecture?.htmlContent || "<p>Architecture content goes here...</p>",
      lastSaved: dbSections.architecture?.exportedAt || null,
    },
    histoire: {
      id: dbSections.histoire?.id || null,
      content: dbSections.histoire?.htmlContent || "<p>Histoire content goes here...</p>",
      lastSaved: dbSections.histoire?.exportedAt || null,
    },
    archeologie: {
      id: dbSections.archeologie?.id || null,
      content: dbSections.archeologie?.htmlContent || "<p>Archeologie content goes here...</p>",
      lastSaved: dbSections.archeologie?.exportedAt || null,
    },
    resources: {
      id: dbSections.resources?.id || null,
      content: dbSections.resources?.htmlContent || "<p>resources content goes here...</p>",
      lastSaved: dbSections.resources?.exportedAt || null,
    },
  };
  
  return initialState;
};

///**
// * Exports a section's content as HTML for database storage
 //* @param sectionKey The section to export
// * @param sectionRef React ref to the section's DOM element
 //* @param sectionState Current state of the section
 //* @returns Object containing HTML, plaintext and metadata
 //
const exportSectionAsHtml = (
  sectionKey: SectionKey,
  sectionRef: React.RefObject<HTMLDivElement>,
  sectionState: EditorSectionState
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
    id: sectionState.id, // Include the database ID
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
 //* Sanitizes HTML content before database storage (removes potentially unsafe attributes)
// * @param html The HTML content to sanitize
 //* @returns Sanitized HTML string
 //
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

///**
 //* Sends a section's HTML content to your database
// * @param sectionData The exported section data
// * @returns Promise resolving to the database response
 //
const saveSectionToDatabase = async (
  sectionData: ExportedSection
): Promise<SectionData> => {
  try {
    // Sanitize HTML before storage
    const sanitizedHtml = sanitizeHtmlForStorage(sectionData.html);

    // Create the payload to send to your database
    const payload = {
      id: sectionData.id, // Include the ID if it exists
      sectionKey: sectionData.metadata.sectionKey,
      htmlContent: sanitizedHtml,
      plainText: sectionData.plainText,
      exportedAt: sectionData.metadata.exportedAt,
      wordCount: sectionData.metadata.wordCount,
    };

    // Use POST for new sections or PUT for updating existing ones
    const method = sectionData.id ? "PUT" : "POST";
    const endpoint = sectionData.id 
      ? `YOUR_API_ENDPOINT/sections/${sectionData.id}` 
      : "YOUR_API_ENDPOINT/sections";

    const response = await fetch(endpoint, {
      method: method,
      headers: {
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


// * Example function to export all sections
// * @param sectionRefs Object containing refs to all section DOM elements
 //* @param editorState Current editor state
 
const exportAllSections = async (
  sectionRefs: {
    architecture: React.RefObject<HTMLDivElement>;
    histoire: React.RefObject<HTMLDivElement>;
    archeologie: React.RefObject<HTMLDivElement>;
    resources: React.RefObject<HTMLDivElement>;
  },
  editorState: EditorState
) => {
  const sections: SectionKey[] = [
    "architecture",
    "histoire",
    "archeologie",
    "resources",
  ];
  const results: Record<SectionKey, any> = {} as Record<SectionKey, any>;

  // Export each section
  for (const section of sections) {
    const exportedData = exportSectionAsHtml(
      section,
      sectionRefs[section],
      editorState[section]
    );

    if (exportedData) {
      try {
        // Save to database
        const saveResult = await saveSectionToDatabase(exportedData);
        
        // Update the editor state with the new ID if it was a new section
        if (!editorState[section].id && saveResult.id) {
          editorState[section].id = saveResult.id;
        }
        
        // Update last saved timestamp
        editorState[section].lastSaved = saveResult.exportedAt;
        
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

  return { results, editorState };
};


 //* Updated render function that includes the database ID in the section element
 
const renderSection = (
  section: SectionKey, 
  title: string, 
  editorState: EditorState,
  {
    architectureRef, 
    histoireRef, 
    archeologieRef, 
    resourcesRef
  }: {
    architectureRef: React.RefObject<HTMLDivElement>;
    histoireRef: React.RefObject<HTMLDivElement>;
    archeologieRef: React.RefObject<HTMLDivElement>;
    resourcesRef: React.RefObject<HTMLDivElement>;
  },
  handleContentChange: (section: SectionKey, e: React.FormEvent<HTMLDivElement>) => void,
  canEditSection: (section: SectionKey) => boolean,
  setActiveSection: (section: SectionKey | null) => void,
  fontFamily: string
) => {
  const isEditable = canEditSection(section);
  const sectionRef = {
    architecture: architectureRef,
    histoire: histoireRef,
    archeologie: archeologieRef,
    resources: resourcesRef,
  }[section];
  
  const sectionState = editorState[section];

  return (
    <>
      <h3>{title}</h3>
      <div
        id={`${section}Content`}
        ref={sectionRef}
        // Store the database ID as a data attribute
        data-section-id={sectionState.id || ""}
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
          __html: sectionState.content,
        }}
        className={`editor-content ${!isEditable ? "read-only" : ""} ${sectionState.lastSaved ? "saved" : "unsaved"}`}
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
            setActiveSection(section);
          }
        }}
      />
      {sectionState.lastSaved && (
        <div className="last-saved-info">
          Last saved: {new Date(sectionState.lastSaved).toLocaleString()}
        </div>
      )}
    </>
  );
};


 //* Handle content changes and update the editor state
 
const handleContentChange = (
  section: SectionKey,
  e: React.FormEvent<HTMLDivElement>,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
) => {
  const newContent = e.currentTarget.innerHTML;
  
  setEditorState((prevState) => ({
    ...prevState,
    [section]: {
      ...prevState[section],
      content: newContent,
    },
  }));
};


// * Save a specific section to the database
 
const saveSectionToDatabaseById = async (
  section: SectionKey,
  sectionRef: React.RefObject<HTMLDivElement>,
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
) => {
  try {
    const sectionData = exportSectionAsHtml(
      section,
      sectionRef,
      editorState[section]
    );
    
    if (sectionData) {
      const result = await saveSectionToDatabase(sectionData);
      
      // Update the editor state with the new ID and timestamp
      setEditorState((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          id: result.id,
          lastSaved: result.exportedAt,
        },
      }));
      
      return { success: true, result };
    } else {
      return { success: false, error: "Failed to export section" };
    }
  } catch (error) {
    console.error(`Error saving ${section} to database:`, error);
    return { success: false, error };
  }
};*/
  function formatCommentTimestamp(
    timestamp: Date | string | undefined
  ): string {
    if (!timestamp) return "";

    // If it's already a Date object
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString();
    }

    // If it's a string that can be parsed to Date
    if (typeof timestamp === "string") {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString();
      }
      return timestamp; // Fallback to raw string if can't parse
    }

    return "";
  }

  return (
    <div className="editor-container">
      {/* Menu Bar */}
      <div className={`connection-status ${collaborationStatus}`}>
        {collaborationStatus === "connected"
          ? "Connecté"
          : collaborationStatus === "connecting"
          ? "Connexion..."
          : "Deconnecté"}
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
          <div
            className="comments-panel"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="comments-header">
              <h3 className="comments-title">Commentaires</h3>
              <button
                className="close-button"
                onClick={() => setShowComments(false)}
                aria-label="Close comments"
              >
                ×
              </button>
            </div>

            {comments.length > 0 ? (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">
                        User {comment.utilisateur_id} {/* Or fetch username */}
                      </span>
                      <span className="comment-time">
                        {new Date(comment.date_creation).toLocaleString()}
                      </span>
                    </div>
                    {comment.selection && (
                      <div className="comment-selection">
                        "{comment.selection}"
                      </div>
                    )}
                    <div className="comment-text">{comment.contenu}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="comments-empty">
                <MessageSquare />
                <p>Pas de Commentaires</p>
                <p>Selectionnez un texte pour inserer un commentaire</p>
              </div>
            )}
            {(selectedText || storedSelection.text) && (
              <div className="add-comment-form">
                <p className="selected-text">
                  <strong>
                    Selectionne dans {activeSection || storedSelection.section}:
                  </strong>{" "}
                  "{selectedText || storedSelection.text}"
                </p>
                <textarea
                  ref={commentInputRef}
                  placeholder="Ajoutez votre commentaire..."
                  className="comment-input"
                  aria-label="Comment input"
                  onMouseDown={(e) => e.stopPropagation()}
                />
                <button
                  className="add-comment-button"
                  onClick={handleCommentSubmit}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  Ajoutez commentaire
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

          {showLinkDialog && (
            <div
              className="dialog-overlay"
              onClick={() => setShowLinkDialog(false)}
            >
              <div
                className="dialog-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="dialog-title">Inserer un lien</h3>
                <form onSubmit={handleLinkSubmit} className="dialog-form">
                  <div className="dialog-form-group">
                    <label htmlFor="link-text">Text a afficher</label>
                    <input
                      id="link-text"
                      type="text"
                      placeholder="text a afficher"
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
                      placeholder="Entrer URL"
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
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="dialog-button dialog-button-insert"
                      disabled={!linkUrl}
                    >
                      Inserer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
                Titre 1
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection && handleHeadingChange("h2", activeSection)
                }
              >
                Titre 2
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection && handleHeadingChange("h3", activeSection)
                }
              >
                Titre 3
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  activeSection && handleHeadingChange("p", activeSection)
                }
              >
                Texte normal
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
            className="icon-button"
            onClick={() => {
              const allRefs = {
                architecture: architectureRef as RefObject<HTMLDivElement>,
                histoire: histoireRef as RefObject<HTMLDivElement>,
                archeologie: archeologieRef as RefObject<HTMLDivElement>,
                resources: resourcesRef as RefObject<HTMLDivElement>,
              };

              exportAllSections(allRefs, editorState);
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
            {/*<RoleSelector />*/}

            {renderSection("architecture", "Architecture")}
            {renderSection("histoire", "Histoire")}
            {renderSection("archeologie", "Archeologie")}
            {renderSection("resources", "resources")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
