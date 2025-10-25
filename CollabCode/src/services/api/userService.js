import axiosInstance from './axiosInstance';

const userService = {
  getUserRooms: async () => {
    const res = await axiosInstance.get('/api/User/Rooms');
    return res.data ?? res.data.Data ?? res.data.data;
  },
};

export default userService;