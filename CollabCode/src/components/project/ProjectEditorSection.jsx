// src/components/project/ProjectEditorSection.jsx
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import fileService from '../../services/api/fileService';

const ProjectEditorSection = ({ project, activeFile, onProjectUpdate, currentUserId }) => {
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  React.useEffect(() => {
    if (activeFile) {
      setContent(activeFile.content || '');
    } else {
      setContent('');
    }
  }, [activeFile]);

  const canEdit = (file) => {
    if (!file) return false;
    
    // Owner can always edit
    if (project.ownerId === currentUserId) return true;
    
    // Check if file is assigned to current user
    if (file.assignedTo !== null && Number(file.assignedTo) === Number(currentUserId)) {
      // Check file access level
      if (file.accessLevel === 'private') return false; // Only owner can edit private files
      if (file.accessLevel === 'restricted') {
        // Check if user has explicit access (this would need backend validation)
        return true; // For now, assume assigned users can edit restricted files
      }
      return true; // Public files can be edited by assigned users
    }
    
    return false;
  };

  const canView = (file) => {
    if (!file) return false;
    
    // Owner can always view
    if (project.ownerId === currentUserId) return true;
    
    // Check file access level
    if (file.accessLevel === 'private') return false; // Only owner can view private files
    if (file.accessLevel === 'restricted') {
      // Check if user has explicit access (this would need backend validation)
      return true; // For now, assume project members can view restricted files
    }
    
    return true; // Public files can be viewed by all project members
  };

  const handleSave = async () => {
    if (!activeFile) return;
    setStatusMsg(null);
    setEditing(true);
    try {
      await fileService.updateFile({
        id: activeFile.id,
        fileName: activeFile.fileName,
        content,
        projectId: project.id,
      });
      setStatusMsg('Saved successfully');
      onProjectUpdate();
    } catch (err) {
      setStatusMsg(err?.message || 'Save failed');
    } finally {
      setEditing(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleRename = async () => {
    if (!activeFile) return;
    const newName = window.prompt('New filename', activeFile.fileName);
    if (!newName || newName.trim() === '') return;
    try {
      await fileService.updateFile({
        id: activeFile.id,
        fileName: newName.trim(),
        content,
        projectId: project.id,
      });
      onProjectUpdate();
    } catch (err) {
      setStatusMsg(err?.message || 'Rename failed');
    }
  };

  if (!project) {
    return (
      <div className="card h-100">
        <div className="card-body d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <i className="bi bi-file-earmark-x fs-1"></i>
            <p className="mt-2">No project selected</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-code-square"></i> Code Editor
          </h5>
          <div>
            {activeFile && (
              <>
                <button 
                  className="btn btn-sm btn-outline-secondary me-1" 
                  onClick={handleRename}
                >
                  <i className="bi bi-pencil"></i> Rename
                </button>
                <button 
                  className="btn btn-sm btn-success" 
                  disabled={!activeFile || editing || !canEdit(activeFile)} 
                  onClick={handleSave}
                >
                  {editing ? 'Saving...' : 'Save'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="card-body d-flex flex-column">
        {/* File Info */}
        {activeFile && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">{activeFile.fileName}</h6>
                <small className="text-muted">
                  {canEdit(activeFile) ? (
                    <span className="text-success">
                      <i className="bi bi-check-circle"></i> You can edit this file
                    </span>
                  ) : !canView(activeFile) ? (
                    <span className="text-danger">
                      <i className="bi bi-lock"></i> Access denied - Private file
                    </span>
                  ) : activeFile.assignedTo ? (
                    <span className="text-warning">
                      <i className="bi bi-lock"></i> Assigned to user {activeFile.assignedTo}
                    </span>
                  ) : (
                    <span className="text-info">
                      <i className="bi bi-unlock"></i> Unassigned - anyone can edit
                    </span>
                  )}
                </small>
                {activeFile.accessLevel && (
                  <small className="text-muted d-block">
                    Access Level: {activeFile.accessLevel}
                  </small>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-grow-1" style={{ minHeight: 500 }}>
          {activeFile ? (
            !canView(activeFile) ? (
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className="text-center text-danger">
                  <i className="bi bi-shield-lock fs-1"></i>
                  <p className="mt-2">Access Denied</p>
                  <small>This file is private and only accessible to the project owner.</small>
                </div>
              </div>
            ) : (
              <Editor
                height="70vh"
                defaultLanguage="javascript"
                value={content}
                onChange={(value) => setContent(value ?? '')}
                options={{ 
                  readOnly: !canEdit(activeFile), 
                  automaticLayout: true,
                  minimap: { enabled: true },
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnlyMessage: { value: 'This file is assigned to another user or you do not have edit access' },
                  fontSize: 14,
                  tabSize: 2,
                  insertSpaces: true,
                  renderWhitespace: 'selection',
                  cursorBlinking: 'blink',
                  cursorStyle: 'line',
                  smoothScrolling: true,
                  scrollBeyondLastLine: false
                }}
              />
            )
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center text-muted">
                <i className="bi bi-file-earmark-text fs-1"></i>
                <p className="mt-2">Select a file to start editing</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className="mt-2">
            <div className={`alert ${statusMsg.includes('success') ? 'alert-success' : 'alert-danger'} mb-0`}>
              {statusMsg}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!activeFile && (
          <div className="mt-3 text-muted small">
            <i className="bi bi-info-circle"></i> Select a file from the left panel to start editing
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectEditorSection;
