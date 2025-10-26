import axiosInstance from './axiosInstance';

const fileService = {
  createFile: async (payload) => {
    const res = await axiosInstance.post('/api/File/create', payload);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  deleteFile: async (fileId) => {
    const res = await axiosInstance.delete(`/api/File/Delete/${fileId}`);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  updateFile: async (payload) => {
    const res = await axiosInstance.put('/api/File/Update', payload);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  assign: async (payload) => {
    // your FileService has Assign and UnAssign methods but no controller endpoints shown
    const res = await axiosInstance.post('/api/File/Assign', payload);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  unassign: async (fileId) => {
    const res = await axiosInstance.post(`/api/File/UnAssign/${fileId}`);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  // File Access Control Methods
  setFileAccess: async (payload) => {
    // Set file access level (public, private, restricted)
    const res = await axiosInstance.put('/api/File/Access', payload);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  grantFileAccess: async (payload) => {
    // Grant specific user access to a file
    const res = await axiosInstance.post('/api/File/GrantAccess', payload);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  revokeFileAccess: async (payload) => {
    // Revoke specific user access to a file
    const res = await axiosInstance.post('/api/File/RevokeAccess', payload);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  getFileAccessList: async (fileId) => {
    // Get list of users who have access to a file
    const res = await axiosInstance.get(`/api/File/Access/${fileId}`);
    return res.data.data ?? res.data.Data ?? res.data;
  }
};

export default fileService;