import React, { useState } from 'react';
import projectService from '../../services/api/projectService';

const ProjectMembersSection = ({ project, onProjectUpdate, isOwner }) => {
  const [error, setError] = useState(null);
  const [showJoinCode, setShowJoinCode] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [password, setPassword] = useState('');
  console.log("ProjectMembersSection render", { project, isOwner });

  const handleRemoveMember = async (memberId) => {
    console.log("handleRemoveMember called", memberId);
    if (!isOwner) {
      setError('Only project owners can remove members');
      return;
    }

    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      console.log("Removing member...");
      await projectService.removeMember(project.id, memberId);
      console.log("Member removed successfully");
      onProjectUpdate();
    } catch (err) {
      console.error("Error removing member", err);
      setError(err.message || 'Failed to remove member');
    }
  };

  const handleLeaveProject = async () => {
    console.log("handleLeaveProject called");
    if (isOwner) {
      setError('Project owners cannot leave their own project');
      return;
    }

    if (!window.confirm('Are you sure you want to leave this project?')) return;
    try {
      console.log("Leaving project...");
      await projectService.leaveProject(project.id);
      console.log("Left project successfully");
      window.location.href = '/projects';
    } catch (err) {
      console.error("Error leaving project", err);
      setError(err.message || 'Failed to leave project');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    console.log("handleAddMember called", { joinCode, password });
    if (!isOwner) {
      setError('Only project owners can add members');
      return;
    }

    try {
      console.log("Adding member...");
      await projectService.joinProject({ joinCode, password });
      console.log("Member added successfully");
      setJoinCode('');
      setPassword('');
      setShowAddMember(false);
      onProjectUpdate();
    } catch (err) {
      console.error("Error adding member", err);
      setError(err.message || 'Failed to add member');
    }
  };

  const copyJoinCode = () => {
    console.log("copyJoinCode called", project.joinCode);
    navigator.clipboard.writeText(project.joinCode);
    setShowJoinCode(true);
    setTimeout(() => setShowJoinCode(false), 2000);
  };

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          <i className="bi bi-people"></i> Members
          <span className="badge bg-primary ms-1">{project.members?.length || 0}</span>
        </h6>
        {isOwner && (
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => { console.log("Toggle showAddMember"); setShowAddMember(!showAddMember); }}
            title="Add member"
          >
            <i className="bi bi-person-plus"></i>
          </button>
        )}
      </div>
      <div className="card-body d-flex flex-column p-2">
        {isOwner && (
          <div className="mb-2">
            <label className="form-label small">Join Code</label>
            <div className="input-group input-group-sm">
              <input 
                type="text" 
                className="form-control" 
                value={project.joinCode || ''} 
                readOnly 
              />
              <button 
                className="btn btn-outline-secondary" 
                onClick={copyJoinCode}
                title="Copy join code"
              >
                <i className="bi bi-copy"></i>
              </button>
            </div>
            {showJoinCode && (
              <small className="text-success">
                <i className="bi bi-check-circle"></i> Copied!
              </small>
            )}
          </div>
        )}

        {isOwner && showAddMember && (
          <div className="mb-2">
            <form onSubmit={handleAddMember}>
              <div className="mb-1">
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Join code" 
                  value={joinCode} 
                  onChange={(e) => setJoinCode(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-1">
                <input 
                  type="password" 
                  className="form-control form-control-sm" 
                  placeholder="Password (if private)" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <div className="d-flex gap-1">
                <button 
                  className="btn btn-sm btn-outline-success flex-grow-1" 
                  type="submit"
                >
                  <i className="bi bi-check"></i>
                </button>
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  type="button"
                  onClick={() => {
                    console.log("Cancel add member");
                    setShowAddMember(false);
                    setJoinCode('');
                    setPassword('');
                  }}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex-grow-1" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {project.members?.length === 0 ? (
            <div className="text-center text-muted py-3">
              <i className="bi bi-person-x fs-4"></i>
              <p className="mt-2 small">No members yet</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {project.members?.map((member) => (
                <div key={member.id} className="list-group-item p-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-person-circle me-1"></i>
                      <div>
                        <small className="fw-bold">{member.userName}</small>
                        {member.id === project.ownerId && (
                          <small className="text-primary d-block">
                            <i className="bi bi-crown"></i> Owner
                          </small>
                        )}
                      </div>
                    </div>
                    <div>
                      {isOwner && member.id !== project.ownerId && (
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveMember(member.id)}
                          title="Remove member"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                        >
                          <i className="bi bi-person-dash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-danger small mb-2">{error}</div>
        )}

        {!isOwner && (
          <div className="mt-2">
            <button 
              className="btn btn-outline-warning btn-sm w-100"
              onClick={handleLeaveProject}
            >
              <i className="bi bi-box-arrow-right"></i> Leave Project
            </button>
          </div>
        )}

        {isOwner && (
          <div className="text-muted small mt-2">
            <i className="bi bi-info-circle"></i> Owner controls available
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMembersSection;
