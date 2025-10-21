import React from "react";

export default function EditorSection({ code }) {
  console.log("from editor", code);

  return (
    <div className="bg-secondary d-flex flex-column justify-content-center align-items-center text-white h-100 p-2">
      {code ? (
        <div className="w-100 h-100">
          <div
            className="bg-dark h-100 w-100 rounded p-3"
            id="monaco-editor"
            style={{ minHeight: "500px", overflowY: "auto" }}
          >
            <pre className="text-light m-0">{code}</pre>
          </div>
        </div>
      ) : (
        <p className="lead text-light text-center mt-5">
          Select a room to start coding 👨‍💻
        </p>
      )}
    </div>
  );
}
