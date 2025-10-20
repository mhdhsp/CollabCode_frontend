import React from "react";
import { useNavigate } from "react-router-dom";
import "animate.css"; // for animations

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column vh-100 bg-dark text-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">CodeEditor</span>
          <div>
            <button
              className="btn btn-outline-light me-2"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="d-flex flex-grow-1 justify-content-center align-items-center px-3">
        <div className="text-center">
          <h1 className="mb-4 animate__animated animate__fadeInDown">
            Welcome to <span className="text-info">CodeEditor</span>
          </h1>
          <p className="mb-5 lead animate__animated animate__fadeInUp">
            CodeEditor is an online collaborative coding platform where you can create
            coding rooms, join with friends, and write code together in real-time.
            Perfect for learning, practicing, and pair programming.
          </p>

          {/* Action Buttons */}
          <div className="d-flex justify-content-center gap-3 animate__animated animate__fadeInUp animate__delay-1s">
            <button
              className="btn btn-primary btn-lg px-5 py-3"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-success btn-lg px-5 py-3"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
