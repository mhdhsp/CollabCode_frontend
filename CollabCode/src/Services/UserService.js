import api from "./api";

export const UserRooms = async () => {
  const response = await api.get("/api/User/rooms");
  return response.data;
};
