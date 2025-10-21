import api from "./api";

export const RoomDetails = async (id) => {
  const response = await api.get(`/api/Room/Enter/${id}`);
  return response.data;
};

export const CreateNewRoom=async (room)=>{
  const res=await api.post("api/Room/NewRoom",room);
  return res.data;
}

export const JoinRoom=async (room)=>{
  const res=await api.post(`api/Room/JoinRoom`,room);
  return res.data;
}

