import React from "react";

export default function EditorSection({ selectedRoom }) {
  return (
    <div className="bg-secondary d-flex flex-column justify-content-center align-items-center text-white h-100">
      {selectedRoom ? (
        <div className="w-100 h-100">
          {/* Monaco Editor will be mounted here */}
          <div
            className="bg-dark h-100 w-100 rounded p-2"
            id="monaco-editor"
            style={{ minHeight: "500px" }}
          >
            <p className="text-center mt-5 text-muted">Loading Editor for Room ID: {selectedRoom}</p>
          </div>
        </div>
      ) : (
        <p className="lead text-light">Select a room to start coding 👨‍💻</p>
      )}
    </div>
  );
}
