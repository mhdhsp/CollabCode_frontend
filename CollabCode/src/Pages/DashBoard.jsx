import React, { useState, useEffect } from "react";
import LeftSidebar from "../Components/LeftSideBar";
import { UserRooms } from "../Services/UserService";
import MainSection from "../Components/MainSection";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await UserRooms(); 
        setUserData(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch user rooms:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container-fluid vh-100 bg-dark text-white p-0">
      <div className="row h-100 g-0">
        {/* Left Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 border-end border-secondary">
          {userData && (
            <LeftSidebar
              ownedRooms={userData.ownedRooms}
              joinedRooms={userData.joinedRooms}
              onSelectRoom={(room) => setSelectedRoom(room)}
            />
          )}
        </div>

        {/* Main Section */}
        <div className="col-12 col-md-9 col-lg-10">
          {selectedRoom ? (
            <MainSection selectedRoom={selectedRoom.id} />
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
