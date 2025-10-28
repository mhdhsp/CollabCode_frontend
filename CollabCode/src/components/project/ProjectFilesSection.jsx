import React, { useState } from "react";
import fileService from "../../services/api/fileService";

const ProjectFilesSection = ({
  project,
  activeFile,
  onFileSelect,
  onProjectUpdate,
  isOwner,
}) => {
  console.log("ProjectFilesSection rendered", { project, activeFile, isOwner });
  const [creating, setCreating] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isShowAssign, setIsShowAssign] = useState(false);
  const [targetId, setTargetId] = useState();
  const [activeAssignFileId, setActiveAssignFileId] = useState(null);

  // const [showAccessControl, setShowAccessControl] = useState(null);
  // const [fileAccessList, setFileAccessList] = useState({});

  const handleCreateFile = async (e) => {
    console.log("handleCreateFile called", { fileName });
    e.preventDefault();
    if (!isOwner) {
      setError("Only project owners can create files");
      return;
    }

    setError(null);
    setCreating(true);
    try {
      console.log("Creating file...");
      await fileService.createFile({ fileName, projectId: project.id });
      console.log("File created successfully");
      setFileName("");
      setShowCreateForm(false);
      onProjectUpdate();
    } catch (err) {
      console.error("Error creating file", err);
      setError(err.message || "Failed to create file");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    console.log("handleDeleteFile called", { fileId });
    if (!isOwner) {
      setError("Only project owners can delete files");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await fileService.deleteFile(fileId);
      console.log("File deleted successfully", fileId);
      onProjectUpdate();
    } catch (err) {
      console.error("Error deleting file", err);
      setError(err.message || "Failed to delete file");
    }
  };

  const handleAssignFile = (fileId) => {
  console.log("handleAssignFile called", { fileId });
  if (!isOwner) {
    setError("Only project owners can assign files");
    return;
  }

  // Save the current fileId in state to use inside modal
  setActiveAssignFileId(fileId);
  setIsShowAssign(true);
};

  const handleUnassignFile = async (fileId) => {
  console.log("handleUnassignFile called", { fileId });
  if (!isOwner) {
    setError("Only project owners can unassign files");
    return;
  }

  // ✅ Ask for confirmation
  const confirmed = window.confirm("Are you sure you want to unassign this file?");
  if (!confirmed) return; // Exit if user clicks Cancel

  try {
    await fileService.unassign(fileId);
    console.log("File unassigned successfully", fileId);
    onProjectUpdate();
  } catch (err) {
    console.error("Error unassigning file", err);
    setError(err.message || "Failed to unassign file");
  }
};


  const handleRenameFile = async (fileId, currentName) => {
    console.log("handleRenameFile called", { fileId, currentName });
    if (!isOwner) {
      setError("Only project owners can rename files");
      return;
    }

    const newName = window.prompt("Enter new file name:", currentName);
    if (!newName || newName.trim() === "") return;

    try {
      await fileService.updateFile({
        id: fileId,
        fileName: newName.trim(),
        content: project.files.find((f) => f.id === fileId)?.content || "",
        projectId: project.id,
      });
      console.log("File renamed successfully", { fileId, newName });
      onProjectUpdate();
    } catch (err) {
      console.error("Error renaming file", err);
      setError(err.message || "Failed to rename file");
    }
  };

  // const handleSetFileAccess = async (fileId, accessLevel) => {
  //   console.log('handleSetFileAccess called', { fileId, accessLevel });
  //   if (!isOwner) {
  //     setError('Only project owners can set file access');
  //     return;
  //   }

  //   try {
  //     await fileService.setFileAccess({ fileId, accessLevel });
  //     console.log('File access set successfully', { fileId, accessLevel });
  //     onProjectUpdate();
  //   } catch (err) {
  //     console.error('Error setting file access', err);
  //     setError(err.message || 'Failed to set file access');
  //   }
  // };

  // const handleGrantFileAccess = async (fileId) => {
  //   console.log('handleGrantFileAccess called', { fileId });
  //   if (!isOwner) {
  //     setError('Only project owners can grant file access');
  //     return;
  //   }

  //   const userId = parseInt(window.prompt('Enter user ID to grant access to:'), 10);
  //   if (!userId) return;

  //   try {
  //     await fileService.grantFileAccess({ fileId, userId });
  //     console.log('File access granted', { fileId, userId });
  //     onProjectUpdate();
  //   } catch (err) {
  //     console.error('Error granting file access', err);
  //     setError(err.message || 'Failed to grant file access');
  //   }
  // };

  // const handleRevokeFileAccess = async (fileId, userId) => {
  //   console.log('handleRevokeFileAccess called', { fileId, userId });
  //   if (!isOwner) {
  //     setError('Only project owners can revoke file access');
  //     return;
  //   }

  //   if (!window.confirm('Are you sure you want to revoke access for this user?')) return;

  //   try {
  //     await fileService.revokeFileAccess({ fileId, userId });
  //     console.log('File access revoked', { fileId, userId });
  //     onProjectUpdate();
  //   } catch (err) {
  //     console.error('Error revoking file access', err);
  //     setError(err.message || 'Failed to revoke file access');
  //   }
  // };

  // const loadFileAccessList = async (fileId) => {
  //   console.log('loadFileAccessList called', { fileId });
  //   try {
  //     const accessList = await fileService.getFileAccessList(fileId);
  //     console.log('File access list loaded', accessList);
  //     setFileAccessList(prev => ({ ...prev, [fileId]: accessList }));
  //   } catch (err) {
  //     console.error('Error loading file access list', err);
  //     setError(err.message || 'Failed to load file access list');
  //   }
  // };

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          <i className="bi bi-files me-1"></i>Files
          <span className="badge bg-primary ms-2">
            {project.files?.length || 0}
          </span>
        </h6>
        {isOwner && (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
            title="Create new file"
          >
            <i className="bi bi-plus fs-5"></i>
          </button>
        )}
      </div>
      <div className="card-body d-flex flex-column p-3">
        {isOwner && showCreateForm && (
          <div className="mb-3">
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
                  {creating ? "..." : <i className="bi bi-check fs-5"></i>}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFileName("");
                  }}
                >
                  <i className="bi bi-x fs-5"></i>
                </button>
              </div>
            </form>
          </div>
        )}
        <div
          className="flex-grow-1"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {project.files?.length === 0 ? (
            <div className="text-center text-muted py-3">
              <i className="bi bi-file-earmark fs-4"></i>
              <p className="mt-2 small">No files yet</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {project.files.map((file) => (
                <div
                  key={file.id}
                  className={`list-group-item list-group-item-action p-2 ${
                    activeFile?.id === file.id ? "active" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    console.log("File selected", file);
                    onFileSelect(file);
                  }}
                >
                  <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center">
                        {/* <i className="bi bi-file-earmark-text me-2"></i> */}
                        <small className="fw-bold">{file.fileName}</small>
                      </div>
                      <small
                        className="text-muted d-block"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {file.assignedTo
                          ? `User ${file.assignedTo}`
                          : "Unassigned"}
                        {/* {file.accessLevel && ` • ${file.accessLevel}`} */}
                      </small>
                    </div>

                    {isOwner && (
                      <div className="btn-group gap-2" role="group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignFile(file.id);
                          }}
                          title="Assign file"
                          style={{
                            fontSize: "0.8rem",
                            padding: "0.3rem 0.6rem",
                          }}
                        >
                          <i className="bi bi-person-plus fs-6"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnassignFile(file.id);
                          }}
                          title="Unassign file"
                          style={{
                            fontSize: "0.8rem",
                            padding: "0.3rem 0.6rem",
                          }}
                        >
                          <i className="bi bi-person-dash fs-6"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameFile(file.id, file.fileName);
                          }}
                          title="Rename file"
                          style={{
                            fontSize: "0.8rem",
                            padding: "0.3rem 0.6rem",
                          }}
                        >
                          <i className="bi bi-pencil fs-6"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.id);
                          }}
                          title="Delete file"
                          style={{
                            fontSize: "0.8rem",
                            padding: "0.3rem 0.6rem",
                          }}
                        >
                          <i className="bi bi-trash fs-6"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {error && (
          <div
            className="alert alert-danger small mb-2"
            style={{ fontSize: "0.9rem" }}
          >
            {error}
          </div>
        )}
        {isOwner && (
          <div className="text-muted small mt-2" style={{ fontSize: "0.9rem" }}>
            <i className="bi bi-info-circle me-1"></i> Owner controls available
          </div>
        )}

        {isShowAssign && (
          <div
            className="modal fade show"
            id="memberModal"
            tabIndex="-1"
            aria-labelledby="memberModalLabel"
            aria-modal="true"
            role="dialog"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title" id="memberModalLabel">
                    Select a Member
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setIsShowAssign(false)}
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body p-0">
                  <ul className="list-group list-group-flush">
                    {project.members && project.members.length > 0 ? (
                      project.members.map((item) => (
                        <li
                          key={item.id}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => setTargetId(item.id)}
                        >
                          <span className="fw-semibold">
                            <i className="bi bi-person me-2 text-primary"></i>
                            {item.userName}
                          </span>
                       <button
  className="btn btn-sm btn-outline-success"
  onClick={async (e) => {
    e.stopPropagation();
    try {
      await fileService.assign({
        fileId: activeAssignFileId,
        targetUserId: item.id,
      });
      console.log("File assigned successfully", {
        fileId: activeAssignFileId,
        targetUserId: item.id,
      });
      onProjectUpdate();
    } catch (err) {
      console.error("Error assigning file", err);
      setError(err.message || "Failed to assign file");
    } finally {
      setIsShowAssign(false);
      setTargetId("");
      setActiveAssignFileId(null);
    }
  }}
>
  Assign
</button>

                        </li>
                      ))
                    ) : (
                      <li className="list-group-item text-muted text-center py-3">
                        No members found
                      </li>
                    )}
                  </ul>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsShowAssign(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectFilesSection;
