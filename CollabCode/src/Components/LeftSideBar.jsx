import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { JoinRoom } from "../Services/RoomSerive";

export default function LeftSidebar({
  ownedRooms = [],
  joinedRooms = [],
  onSelectRoom,
}) {
  const [loading, setLoading] = useState(false);
 
  

  


  return (
    <div className="bg-dark text-white p-3 d-flex flex-column h-100">
      <h5 className="text-center mb-3">Your Rooms</h5>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary"  disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
        <Button variant="outline-light" >
          Join
        </Button>
      </div>

      {/* Owned Rooms */}
      <h6 className="mt-3 text-info">Owned Rooms</h6>
      <ul className="list-group list-group-flush mb-3">
        {ownedRooms.map((room) => (
          <li
            key={room.id}
            className="list-group-item bg-dark text-white border-0 py-1 px-2 rounded hover-room"
            style={{ cursor: "pointer" }}
            onClick={() => onSelectRoom(room.id)}
          >
            {room.roomName} <small className="text-secondary">#{room.joinCode}</small>
          </li>
        ))}
      </ul>

      {/* Joined Rooms */}
      <h6 className="mt-3 text-info">Joined Rooms</h6>
      <ul className="list-group list-group-flush">
        {joinedRooms.map((room, index) => (
          <li
            key={index}
            className="list-group-item bg-dark text-white border-0 py-1 px-2 rounded hover-room"
            style={{ cursor: "pointer" }}
            onClick={() => onSelectRoom(room.id)}
          >
            {room.roomName}
          </li>
        ))}
      </ul>

      

     
    </div>
  );
}
