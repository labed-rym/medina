import React, { useState } from 'react';
import TextEditor from './Editor';
import './Editor (1).css';
import style from './EditorPage.module.css';
const EditorPage: React.FC = () => {
  const [content, setContent] = useState<string>('<p>Start typing your document here...</p>');
  
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    // You can save to local storage, send to server, etc.
    console.log('Content updated:', newContent);
  };
  
  return (
    <div className={style.editorAll}>
      
      <main>
        <TextEditor 
          documentId="doc-123" 
          initialContent={content}
          onContentChange={handleContentChange}
        />
      </main>
      
      <footer>
        <p>Last saved: {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
};

export default EditorPage;