import React, { useState, useEffect } from "react";
import LeftSidebar from "../Components/LeftSideBar";
import { UserRooms } from "../Services/UserService";
import MainSection from "../Components/MainSection";
import { CreateNewRoom, JoinRoom } from "../Services/RoomSerive";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch all user rooms (owned + joined)
  const fetchUserRooms = async () => {
    try {
      const data = await UserRooms();
      setUserData(data);
      console.log("User Rooms:", data);
    } catch (err) {
      console.error("Failed to fetch user rooms:", err);
    }
  };

  // Fetch rooms when the component mounts or when a room is created/selected
  useEffect(() => {
    fetchUserRooms();
  }, [selectedRoom]);

  // Handle room creation
  const handleCreateRoom = async (roomData) => {
    try {
      console.log("Creating Room:", roomData);
      const response = await CreateNewRoom(roomData);

      if (response?.data) {
        alert("✅ Room created successfully!");
        await fetchUserRooms(); // refresh sidebar with latest rooms
      } else {
        alert("⚠️ Room creation failed.");
      }
    } catch (err) {
      console.error("Room creation error:", err);
      alert("❌ Error creating room.");
    }
  };

  const handleJoinRoom = async (data) => {
      setLoading(true);
      try {
          const res=JoinRoom(data);
  
        
        setShowJoinModal(false);
        setJoinData({ joinCode: "", password: "", isPrivate: false });
      } catch (err) {
        setJoinError(err.response?.data?.message || "Failed to join room");
      }
      setLoading(false);
    };

  return (
    <div className="container-fluid vh-100 bg-dark text-white p-0">
      <div className="row h-100 g-0">
        {/* Left Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 border-end border-secondary">
          {userData ? (
            <LeftSidebar
              ownedRooms={userData.ownedRooms}
              joinedRooms={userData.joinedRooms}
              onSelectRoom={(room) => setSelectedRoom(room)}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
            />
          ) : (
            <div className="text-center mt-5 text-secondary">Loading...</div>
          )}
        </div>

        {/* Main Section */}
        <div className="col-12 col-md-9 col-lg-10">
          {selectedRoom ? (
            <MainSection selectedRoom={selectedRoom} />
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100 text-secondary">
              Select a room to start coding
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
