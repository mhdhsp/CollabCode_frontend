import api from "./api";

export const RoomDetails = async () => {
  const response = await api.get("/api/Room/{id}/Details");
  return response.data;
};
