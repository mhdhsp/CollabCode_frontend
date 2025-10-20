import React from "react";

export default function RightSidebar({ users = [], isOwner = false }) {
  return (
    <div className="bg-dark text-white p-3 d-flex flex-column h-100">
      <h5 className="text-center mb-3">Users</h5>

      <ul className="list-group list-group-flush flex-grow-1 overflow-auto mb-3">
        {users.length > 0 ? (
          users.map((user, index) => (
            <li
              key={index}
              className="list-group-item bg-dark text-white border-0 py-1 px-2"
            >
              👤 {user.userName}
            </li>
          ))
        ) : (
          <p className="text-muted text-center">No users in this room</p>
        )}
      </ul>

      {isOwner && (
        <div>
          <button className="btn btn-warning w-100 mb-2">Manage Room</button>
          <button className="btn btn-danger w-100">Manage Members</button>
        </div>
      )}
    </div>
  );
}
