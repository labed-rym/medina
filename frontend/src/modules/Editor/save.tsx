<div className="main-content">
        <div className="editor-wrapper">
          <div className="editor-page">
            <div ref={editorRef}
              onMouseUp={handleTextSelection}
              onKeyUp={handleTextSelection}
              className="editor-content"
              contentEditable
              onInput={handleContentChange}
              style={{
                fontFamily,
                direction: "ltr",
                textAlign: "left",
                unicodeBidi: "isolate",
              }}
              dir="ltr"/>
           </div>
         </div>

        </div>

        {/* Image Dialog */}
        {showImageDialog && (
        <div
          className="dialog-overlay"
          onClick={() => setShowImageDialog(false)}
        >
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="dialog-title">Insert Image</h3>
            <div className="dialog-options">
              <button
                className="dialog-option-button"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                Upload from computer
              </button>

              <form onSubmit={handleImageUrlSubmit} className="dialog-form">
                <input
                  type="text"
                  placeholder="Paste image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="dialog-input"
                />

                <div className="dialog-actions">
                  <button
                    type="button"
                    className="dialog-button dialog-button-cancel"
                    onClick={() => setShowImageDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="dialog-button dialog-button-insert"
                  >
                    Insert
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        )}
        {selectedImage && (
        <div className="image-controls">
          <button
            className="image-delete-button"
            onClick={handleDeleteImage}
            title="Delete image"
          >
            Delete
          </button>
        </div>
        )}
    </div>

















    --------------------------------------------------------------------------------------
    <div className="main-content">
    <div className="section-tabs">
    <button className={activeSection === 'architecture' ? 'active' : ''} onClick={() => setActiveSection('architecture')}>Architecture</button>
    <button className={activeSection === 'archaeology' ? 'active' : ''} onClick={() => setActiveSection('archaeology')}>Archaeology</button>
    <button className={activeSection === 'history' ? 'active' : ''} onClick={() => setActiveSection('history')}>History</button>
    </div>

   <div className="editor-wrapper">
    <div className="editor-page">
      {activeSection === 'architecture' && (
        <div 
          ref={architectureEditorRef}
          onMouseUp={handleTextSelection}
          onKeyUp={handleTextSelection}
          className="editor-content architecture-section"
          contentEditable={userCanEditSection('architecture',user.id)}
          onInput={(e) => handleSectionContentChange('architecture', e)}
          style={{
            fontFamily,
            direction: "ltr",
            textAlign: "left",
            unicodeBidi: "isolate",
            borderTop: "4px solid #4CAF50" // Green for architecture
          }}
          dir="ltr"
        >
          {/* Architecture content goes here */}
          {documentSections.architecture || 'Architecture section...'}
        </div>
      )}

      {activeSection === 'archaeology' && (
        <div 
          ref={archaeologyEditorRef}
          onMouseUp={handleTextSelection}
          onKeyUp={handleTextSelection}
          className="editor-content archaeology-section"
          contentEditable={userCanEditSection('archaeology',localUserId)}
          onInput={(e) => handleSectionContentChange('archaeology', e)}
          style={{
            fontFamily,
            direction: "ltr",
            textAlign: "left",
            unicodeBidi: "isolate",
            borderTop: "4px solid #2196F3" // Blue for archaeology
          }}
          dir="ltr"
        >
          {/* Archaeology content goes here */}
          {documentSections.archaeology || 'Archaeology section...'}
        </div>
      )}

      {activeSection === 'history' && (
        <div 
          ref={historyEditorRef}
          onMouseUp={handleTextSelection}
          onKeyUp={handleTextSelection}
          className="editor-content history-section"
          contentEditable={userCanEditSection('history',localUserId)}
          onInput={(e) => handleSectionContentChange('history', e)}
          style={{
            fontFamily,
            direction: "ltr",
            textAlign: "left",
            unicodeBidi: "isolate",
            borderTop: "4px solid #F44336" // Red for history
          }}
          dir="ltr"
        >
          {/* History content goes here */}
          {documentSections.history || 'History section...'}
        </div>
      )}
    </div>
  </div>
  
  <ActiveUsersList activeUsers={activeUsers} />
   
   </div>