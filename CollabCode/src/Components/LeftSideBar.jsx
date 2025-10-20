import React from "react";

export default function LeftSidebar({ ownedRooms = [], joinedRooms = [], onSelectRoom }) {
  return (
    <div className="bg-dark text-white p-3 d-flex flex-column h-100">
      <h5 className="text-center mb-3">Your Rooms</h5>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-sm btn-primary w-50 me-2">Create</button>
        <button className="btn btn-sm btn-outline-light w-50">Join</button>
      </div>

      <div className="overflow-auto flex-grow-1">
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
    </div>
  );
}
