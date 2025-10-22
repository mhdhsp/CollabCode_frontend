import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { JoinRoom } from "../Services/RoomSerive";

export default function LeftSidebar({
  ownedRooms = [],
  joinedRooms = [],
  onSelectRoom,
<<<<<<< HEAD
}) {
  const [loading, setLoading] = useState(false);
 
  

  

=======
  onCreateRoom,
  onJoinRoom,
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomName: "",
    isPublic: true,
    language: "",
    passWordHash: "",
  });
  const [joinData, setJoinData] = useState({
    joinCode: "",
    password: "",
  });
  const [joinError, setJoinError] = useState("");

  // ✅ Create Room
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onCreateRoom(newRoom);
    setLoading(false);
    setShowCreateModal(false);
    setNewRoom({ roomName: "", isPublic: true, language: "", passWordHash: "" });
  };

  // ✅ Join Room
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setJoinError("");

    try {
      await onJoinRoom(joinData);
      setShowJoinModal(false);
      setJoinData({ joinCode: "", password: "" });
    } catch (err) {
      setJoinError(err.response?.data?.message || "Failed to join room");
    }
    setLoading(false);
  };
>>>>>>> 55f74bef50cff890ea1b88672f55ea707ec717cd

  return (
    <div className="bg-dark text-white p-3 d-flex flex-column h-100">
      <h5 className="text-center mb-3">Your Rooms</h5>

      <div className="d-flex justify-content-between mb-3">
<<<<<<< HEAD
        <Button variant="primary"  disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
        <Button variant="outline-light" >
=======
        <Button variant="primary" onClick={() => setShowCreateModal(true)} disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
        <Button variant="outline-light" onClick={() => setShowJoinModal(true)}>
>>>>>>> 55f74bef50cff890ea1b88672f55ea707ec717cd
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

<<<<<<< HEAD
      

     
=======
      {/* Create Room Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered contentClassName="bg-dark text-white">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Create New Room</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Room Name</Form.Label>
              <Form.Control
                type="text"
                name="roomName"
                value={newRoom.roomName}
                onChange={(e) => setNewRoom({ ...newRoom, roomName: e.target.value })}
                required
                className="bg-secondary text-white border-0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Public Room"
                name="isPublic"
                checked={newRoom.isPublic}
                onChange={(e) => setNewRoom({ ...newRoom, isPublic: e.target.checked })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Select
                name="language"
                value={newRoom.language}
                onChange={(e) => setNewRoom({ ...newRoom, language: e.target.value })}
                className="bg-secondary text-white border-0"
              >
                <option value="">Select Language</option>
                <option value="JavaScript">JavaScript</option>
                <option value="C#">C#</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
              </Form.Select>
            </Form.Group>

            {!newRoom.isPublic && (
              <Form.Group className="mb-3">
                <Form.Label>Password (Optional)</Form.Label>
                <Form.Control
                  type="password"
                  name="passWordHash"
                  value={newRoom.passWordHash}
                  onChange={(e) => setNewRoom({ ...newRoom, passWordHash: e.target.value })}
                  className="bg-secondary text-white border-0"
                />
              </Form.Group>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Join Room Modal */}
      <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)} centered contentClassName="bg-dark text-white">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Join Room</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleJoinSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Join Code</Form.Label>
              <Form.Control
                type="text"
                name="joinCode"
                value={joinData.joinCode}
                onChange={(e) => setJoinData({ ...joinData, joinCode: e.target.value })}
                required
                className="bg-secondary text-white border-0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={joinData.password}
                onChange={(e) => setJoinData({ ...joinData, password: e.target.value })}
                placeholder="Enter password"
                className="bg-secondary text-white border-0"
              />
            </Form.Group>

            {joinError && <p className="text-danger">{joinError}</p>}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowJoinModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Joining..." : "Join"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
>>>>>>> 55f74bef50cff890ea1b88672f55ea707ec717cd
    </div>
  );
}
