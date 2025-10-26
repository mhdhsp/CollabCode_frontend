// src/components/project/ProjectFilesSection.jsx
import React, { useState } from 'react';
import fileService from '../../services/api/fileService';

const ProjectFilesSection = ({ project, activeFile, onFileSelect, onProjectUpdate, isOwner }) => {
  const [creating, setCreating] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAccessControl, setShowAccessControl] = useState(null);
  const [fileAccessList, setFileAccessList] = useState({});

  const handleCreateFile = async (e) => {
    e.preventDefault();
    if (!isOwner) {
      setError('Only project owners can create files');
      return;
    }

    setError(null);
    setCreating(true);
    try {
      await fileService.createFile({ fileName, projectId: project.id });
      setFileName('');
      setShowCreateForm(false);
      onProjectUpdate();
    } catch (err) {
      setError(err.message || 'Failed to create file');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!isOwner) {
      setError('Only project owners can delete files');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await fileService.deleteFile(fileId);
      onProjectUpdate();
    } catch (err) {
      setError(err.message || 'Failed to delete file');
    }
  };

  const handleAssignFile = async (fileId) => {
    if (!isOwner) {
      setError('Only project owners can assign files');
      return;
    }

    const userId = parseInt(window.prompt('Enter user ID to assign this file to:'), 10);
    if (!userId) return;
    
    try {
      await fileService.assign({ fileId, targetUserId: userId });
      onProjectUpdate();
    } catch (err) {
      setError(err.message || 'Failed to assign file');
    }
  };

  const handleUnassignFile = async (fileId) => {
    if (!isOwner) {
      setError('Only project owners can unassign files');
      return;
    }

    try {
      await fileService.unassign(fileId);
      onProjectUpdate();
    } catch (err) {
      setError(err.message || 'Failed to unassign file');
    }
  };

  const handleRenameFile = async (fileId, currentName) => {
    if (!isOwner) {
      setError('Only project owners can rename files');
      return;
    }

    const newName = window.prompt('Enter new file name:', currentName);
    if (!newName || newName.trim() === '') return;
    
    try {
      await fileService.updateFile({
        id: fileId,
        fileName: newName.trim(),
        content: project.files.find(f => f.id === fileId)?.content || '',
        projectId: project.id,
      });
      onProjectUpdate();
    } catch (err) {
      setError(err.message || 'Failed to rename file');
    }
  };

  const handleSetFileAccess = async (fileId, accessLevel) => {
    if (!isOwner) {
      setError('Only project owners can set file access');
      return;
    }

    try {
      await fileService.setFileAccess({ fileId, accessLevel });
      onProjectUpdate();
    } catch (err) {
      setError(err.message || 'Failed to set file access');
    }
  };

  const handleGrantFileAccess = async (fileId) => {
    if (!isOwner) {
      setError('Only project owners can grant file access');
      return;
    }

    const userId = parseInt(window.prompt('Enter user ID to grant access to:'), 10);
    if (!userId) return;
    
    try {
      await fileService.grantFileAccess({ fileId, userId });
      onProjectUpdate();
    } catch (err) {
      setError(err.message || 'Failed to grant file access');
    }
  };

  const handleRevokeFileAccess = async (fileId, userId) => {
    if (!isOwner) {
      setError('Only project owners can revoke file access');
      return;
    }

    if (!window.confirm('Are you sure you want to revoke access for this user?')) return;
    
    try {
      await fileService.revokeFileAccess({ fileId, userId });
      onProjectUpdate();
    } catch (err) {
      setError(err.message || 'Failed to revoke file access');
    }
  };

  const loadFileAccessList = async (fileId) => {
    try {
      const accessList = await fileService.getFileAccessList(fileId);
      setFileAccessList(prev => ({ ...prev, [fileId]: accessList }));
    } catch (err) {
      setError(err.message || 'Failed to load file access list');
    }
  };

  const getFileAccessIcon = (file) => {
    if (file.accessLevel === 'private') return '🔒';
    if (file.accessLevel === 'restricted') return '👥';
    return '🌐';
  };

  const getFileAccessTooltip = (file) => {
    if (file.accessLevel === 'private') return 'Private - Owner only';
    if (file.accessLevel === 'restricted') return 'Restricted - Specific users';
    return 'Public - All project members';
  };

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          <i className="bi bi-files"></i> Files
          <span className="badge bg-primary ms-1">{project.files?.length || 0}</span>
        </h6>
        {isOwner && (
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
            title="Create new file"
          >
            <i className="bi bi-plus"></i>
          </button>
        )}
      </div>
      <div className="card-body d-flex flex-column p-2">
        {/* Create File Form */}
        {isOwner && showCreateForm && (
          <div className="mb-2">
            <form onSubmit={handleCreateFile}>
              <div className="input-group input-group-sm">
                <input 
                  className="form-control" 
                  placeholder="File name" 
                  value={fileName} 
                  onChange={(e) => setFileName(e.target.value)} 
                  required 
                />
                <button 
                  className="btn btn-outline-success" 
                  type="submit" 
                  disabled={creating}
                >
                  {creating ? '...' : <i className="bi bi-check"></i>}
                </button>
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFileName('');
                  }}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* File List */}
        <div className="flex-grow-1" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {project.files?.length === 0 ? (
            <div className="text-center text-muted py-3">
              <i className="bi bi-file-earmark fs-4"></i>
              <p className="mt-2 small">No files yet</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {project.files.map(file => (
                <div 
                  key={file.id} 
                  className={`list-group-item list-group-item-action p-2 ${
                    activeFile?.id === file.id ? 'active' : ''
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onFileSelect(file)}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center">
                        <span className="me-1" title={getFileAccessTooltip(file)}>
                          {getFileAccessIcon(file)}
                        </span>
                        <i className="bi bi-file-earmark-text me-1"></i>
                        <small className="fw-bold">{file.fileName}</small>
                        {file.assignedTo && (
                          <span className="badge bg-warning ms-1" style={{ fontSize: '0.6rem' }}>A</span>
                        )}
                      </div>
                      <small className="text-muted d-block">
                        {file.assignedTo ? `User ${file.assignedTo}` : 'Unassigned'}
                        {file.accessLevel && ` • ${file.accessLevel}`}
                      </small>
                    </div>
                    {isOwner && (
                      <div className="btn-group-vertical" role="group">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignFile(file.id);
                          }}
                          title="Assign file"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                        >
                          <i className="bi bi-person-plus"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-warning"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnassignFile(file.id);
                          }}
                          title="Unassign file"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                        >
                          <i className="bi bi-person-dash"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-info"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameFile(file.id, file.fileName);
                          }}
                          title="Rename file"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAccessControl(showAccessControl === file.id ? null : file.id);
                            if (showAccessControl !== file.id) {
                              loadFileAccessList(file.id);
                            }
                          }}
                          title="File access control"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                        >
                          <i className="bi bi-shield-lock"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.id);
                          }}
                          title="Delete file"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* File Access Control Panel */}
                  {isOwner && showAccessControl === file.id && (
                    <div className="mt-2 p-2 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="fw-bold">Access Control</small>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setShowAccessControl(null)}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                      
                      {/* Access Level Controls */}
                      <div className="mb-2">
                        <small className="text-muted">Access Level:</small>
                        <div className="btn-group w-100" role="group">
                          <button 
                            className={`btn btn-sm ${file.accessLevel === 'public' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => handleSetFileAccess(file.id, 'public')}
                          >
                            🌐 Public
                          </button>
                          <button 
                            className={`btn btn-sm ${file.accessLevel === 'restricted' ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => handleSetFileAccess(file.id, 'restricted')}
                          >
                            👥 Restricted
                          </button>
                          <button 
                            className={`btn btn-sm ${file.accessLevel === 'private' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => handleSetFileAccess(file.id, 'private')}
                          >
                            🔒 Private
                          </button>
                        </div>
                      </div>

                      {/* User Access Management */}
                      {file.accessLevel === 'restricted' && (
                        <div>
                          <div className="d-flex gap-1 mb-1">
                            <button 
                              className="btn btn-sm btn-outline-primary flex-grow-1"
                              onClick={() => handleGrantFileAccess(file.id)}
                            >
                              <i className="bi bi-person-plus"></i> Grant Access
                            </button>
                          </div>
                          
                          {/* Access List */}
                          {fileAccessList[file.id] && (
                            <div className="small">
                              <div className="text-muted">Users with access:</div>
                              {fileAccessList[file.id].map(user => (
                                <div key={user.id} className="d-flex justify-content-between align-items-center">
                                  <span>{user.userName}</span>
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleRevokeFileAccess(file.id, user.id)}
                                    style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem' }}
                                  >
                                    <i className="bi bi-x"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger small mb-2">{error}</div>
        )}

        {/* Owner Info */}
        {isOwner && (
          <div className="text-muted small mt-2">
            <i className="bi bi-info-circle"></i> Owner controls available
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectFilesSection;