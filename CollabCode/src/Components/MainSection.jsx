import React, { useEffect, useState } from "react";
import EditorSection from "./EditorSection";
import RightSidebar from "./RightSidebar";
import { RoomDetails } from "../Services/RoomSerive";

function MainSection({ selectedRoom }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedRoom) return;
      try {
        console.log("Fetching room:", selectedRoom);
        const res = await RoomDetails(selectedRoom);
        console.log("Room data:", res);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching room:", err);
      }
    };
    fetchData();
  }, [selectedRoom]);

  return (
    <div className="d-flex flex-column flex-md-row h-100">
      <div className="flex-grow-1 border-end border-secondary">
        <EditorSection code={data.currentCode} />
      </div>

      <div className="d-none d-md-block" style={{ width: "300px" }}>
        <RightSidebar members={data.members || []} isOwner={data.isOwner} />
      </div>
    </div>
  );
}

export default MainSection;
