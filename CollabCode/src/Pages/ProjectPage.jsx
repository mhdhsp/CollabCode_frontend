// src/pages/ProjectPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectFilesSection from '../components/project/ProjectFilesSection';
import ProjectEditorSection from '../components/project/ProjectEditorSection';
import ProjectMembersSection from '../components/project/ProjectMembersSection';
import projectService from '../services/api/projectService';
import { useAuth } from '../contexts/AuthContext';

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFile, setActiveFile] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await projectService.enterProject(projectId);
      setProject({ ...res, id: projectId });
      // Set first file as active if available
      if (res.files && res.files.length > 0) {
        setActiveFile(res.files[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setActiveFile(file);
  };

  const handleProjectUpdate = () => {
    fetchProject();
  };

  const handleBackToProjects = () => {
    navigate('/projects');
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          <h4>Error Loading Project</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleBackToProjects}>
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning">
          <h4>Project Not Found</h4>
          <p>The project you're looking for doesn't exist or you don't have access to it.</p>
          <button className="btn btn-primary" onClick={handleBackToProjects}>
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const isOwner = project.ownerId === user?.id;

  return (
    <div className="container-fluid py-4">
      {/* Project Header */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">{project.projectName || 'Untitled Project'}</h2>
              <small className="text-muted">
                {isOwner ? 'Owner' : 'Member'} • {project.members?.length || 0} members
              </small>
            </div>
            <div>
              <button className="btn btn-outline-secondary me-2" onClick={handleBackToProjects}>
                <i className="bi bi-arrow-left"></i> Back to Projects
              </button>
              {isOwner && (
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                      projectService.destroyProject(projectId).then(() => {
                        navigate('/projects');
                      }).catch(err => {
                        setError(err.message || 'Failed to delete project');
                      });
                    }
                  }}
                >
                  <i className="bi bi-trash"></i> Delete Project
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="row g-3">
        {/* Project Files Section - Smaller */}
        <div className="col-lg-2 col-md-12">
          <ProjectFilesSection
            project={project}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
            onProjectUpdate={handleProjectUpdate}
            isOwner={isOwner}
          />
        </div>

        {/* Editor Section - Maximum space */}
        <div className="col-lg-7 col-md-12">
          <ProjectEditorSection
            project={project}
            activeFile={activeFile}
            onProjectUpdate={handleProjectUpdate}
            currentUserId={user?.id}
          />
        </div>

        {/* Members Section - Smaller */}
        <div className="col-lg-3 col-md-12">
          <ProjectMembersSection
            project={project}
            onProjectUpdate={handleProjectUpdate}
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
