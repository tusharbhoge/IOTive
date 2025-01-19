import React, { useState, useEffect } from "react";
import AirIcon from "@mui/icons-material/Air";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { app } from "../db/firebase";

// Initialize the Firebase Database
const database = getDatabase(app);

const ControlPanelComponents = () => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const ledRef = ref(database, "appliances/red_led1");
    onValue(ledRef, (snapshot) => {
      const ledState = snapshot.val();
      setIsOn(ledState === true); 
    });
  }, []);

  const handleToggle = () => {
    const newState = !isOn; // Toggle state
    set(ref(database, "appliances/red_led1"), newState) // Update Firebase with boolean value
      .then(() => {
        setIsOn(newState); // Update local state
      })
      .catch((error) => {
        console.error("Error updating LED state:", error);
      });
  };

  return (
    <div className="w-full h-[50px] flex items-center justify-between shadow-lg border-[1px] border-neutral-200 bg-white rounded-md shadow-neutral-300 cursor-pointer hover:bg-gray-100 transition-all">
      {/* Icon Section */}
      <div className="w-14 h-auto flex items-center justify-center">
        <AirIcon style={{ width: "30px", height: "30px" }} />
      </div>

      {/* Description Section */}
      <h2 className="text-lg font-semibold w-[180px] px-2">Hall AC</h2>
      <h2 className="text-base font-medium w-20 text-center">6000 W</h2>

      {/* Toggle Section */}
      <div
        onClick={handleToggle}
        className="cursor-pointer flex w-[80px] justify-center items-center"
      >
        {isOn ? (
          <ToggleOnIcon
            style={{ fontSize: "50px", fill: "green", cursor: "pointer" }}
          />
        ) : (
          <ToggleOffOutlinedIcon
            style={{
              fontSize: "45px",
              fill: "green",
              cursor: "pointer",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ControlPanelComponents;
