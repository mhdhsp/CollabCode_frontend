import axiosInstance from './axiosInstance';

const projectService = {
  createProject: async (payload) => {
    const res = await axiosInstance.post('/api/Project/Create', payload);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  joinProject: async (payload) => {
    const res = await axiosInstance.post('/api/Project/Join', payload);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  enterProject: async (projectId) => {
    const res = await axiosInstance.get(`/api/Project/Enter/${projectId}`);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  destroyProject: async (projectId) => {
    const res = await axiosInstance.delete(`/api/Project/destroy/${projectId}`);
    return res.data.data ?? res.data.Data ?? res.data;
  },
  removeMember: async (projectId, memberId) => {
    // Not present in your controller; recommended endpoint spec below
    const res = await axiosInstance.delete(`/api/Project/Member/${projectId}/${memberId}`);
    return res.data.data ?? res.data.Data ?? res.data;
  }
};

export default projectService;