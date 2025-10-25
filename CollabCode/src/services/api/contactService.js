// src/services/api/contactService.js
import axiosInstance from './axiosInstance';

const contactService = {
  sendContact: async ({ name, email, message }) => {
    try {
      const res = await axiosInstance.post('/api/contact', {
        name,
        email,
        message,
      });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Contact error';
      throw new Error(msg);
    }
  },
};

export default contactService;