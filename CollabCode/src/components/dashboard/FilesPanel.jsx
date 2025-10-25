import React, { useState } from 'react';
import fileService from '../../services/api/fileService';

const FilesPanel = ({ project, onProjectChanged }) => {
  const [creating, setCreating] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);

  if (!project) {
    return <div className="card"><div className="card-body">Open a project to view files</div></div>;
  }

  const handleCreateFile = async (e) => {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      await fileService.createFile({ fileName, projectId: project.id });
      setFileName('');
      onProjectChanged();
    } catch (err) {
      setError(err.message || 'Create failed');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h6>Files</h6>
        <ul className="list-group list-group-flush mb-2">
          {project.files.length === 0 && <li className="list-group-item">No files</li>}
          {project.files.map(f => (
            <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div><strong>{f.fileName}</strong></div>
                <small className="text-muted">Assigned to: {f.assignedTo ?? 'unassigned'}</small>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleCreateFile}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="input-group">
            <input className="form-control" placeholder="new filename" value={fileName} onChange={(e)=>setFileName(e.target.value)} required />
            <button className="btn btn-outline-primary" type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilesPanel;