import React, { useState } from 'react';
import projectService from '../../services/api/projectService';

const MembersPanel = ({ project, onProjectChanged }) => {
  const [error, setError] = useState(null);

  if (!project) return <div className="card"><div className="card-body">Open a project to view members</div></div>;

  const removeMember = async (memberDto) => {
    if (!confirm(`Remove ${memberDto.userName}?`)) return;
    try {
      // recommended endpoint: DELETE /api/Project/Member/{projectId}/{memberId}
      await projectService.removeMember(project.id, memberDto.id);
      onProjectChanged();
    } catch (err) {
      setError(err.message || 'Remove failed');
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h6>Members</h6>
        <ul className="list-group list-group-flush mb-2">
          {project.members.length === 0 && <li className="list-group-item">No members</li>}
          {project.members.map(m => (
            <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>{m.userName}</div>
              <div>
                <button className="btn btn-sm btn-danger" onClick={() => removeMember(m)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
        {error && <div className="alert alert-danger mt-auto">{error}</div>}
      </div>
    </div>
  );
};

export default MembersPanel;