import React, { useEffect, useState } from 'react';
import ProjectPanel from '../components/dashboard/ProjectPanel';
import FilesPanel from '../components/dashboard/FilesPanel';
import EditorPanel from '../components/dashboard/EditorPanel';
import MembersPanel from '../components/dashboard/MembersPanel';
import projectService from '../services/api/projectService';
import userService from '../services/api/userService';
import { useSelector } from 'react-redux';

// Dashboard layout: left (projects), mid-left (files), mid-right editor, right members
const Dashboard = () => {
  const [userProjects, setUserProjects] = useState(null);
  const [activeProject, setActiveProject] = useState(null); // ProjectResDto from Enter endpoint
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState(null);

  const auth = useSelector((s) => s.auth);
  const userId = auth?.user?.id ?? null;

  useEffect(() => {
    fetchUserProjects();
  }, []);

  const fetchUserProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await userService.getUserRooms();
      setUserProjects(res);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const enterProject = async (projectId) => {
    try {
      const res = await projectService.enterProject(projectId);
      setActiveProject({ ...res, id: projectId });
    } catch (err) {
      setError(err.message || 'Failed to open project');
    }
  };

  // after create/join, refresh project list
  const onProjectsChanged = () => fetchUserProjects();

  return (
    <div className="container-fluid py-4">
      <div className="row g-3">
        <div className="col-12">
          <h3>Dashboard</h3>
        </div>

        <div className="col-lg-3 col-md-12">
          <ProjectPanel
            projects={userProjects}
            loading={loadingProjects}
            onEnter={enterProject}
            onProjectsChanged={onProjectsChanged}
            activeProjectId={activeProject?.id}
          />
        </div>

        <div className="col-lg-2 col-md-12">
          <FilesPanel
            project={activeProject}
            onFileOpen={(file) => { /* EditorPanel will be informed via lifting state below */ }}
            onProjectChanged={() => enterProject(activeProject?.id)}
          />
        </div>

        <div className="col-lg-4 col-md-12">
          <EditorPanel
            project={activeProject}
            onProjectUpdated={() => enterProject(activeProject?.id)}
          />
        </div>

        <div className="col-lg-3 col-md-12">
          <MembersPanel
            project={activeProject}
            onProjectChanged={() => enterProject(activeProject?.id)}
          />
        </div>
      </div>
      {error && <div className="mt-3 alert alert-danger">{error}</div>}
    </div>
  );
};

export default Dashboard;