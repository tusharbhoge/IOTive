import React, { useState } from "react";

const Report = () => {
  const [view, setView] = useState("weekly");
  const [selectedTime, setSelectedTime] = useState("");

  // Mock data for each timeframe
  const reports = {
    weekly: {
      options: ["Week 1", "Week 2", "Week 3", "Week 4"],
      description:
        "You consumed 100 units of energy, costing approximately ₹700. Fans were the most used device, accounting for 40% of the total energy consumption.",
      advice:
        "To optimize usage, consider reducing fan runtime and turning off idle appliances. Stay energy-efficient to lower costs and save power!",
    },
    monthly: {
      options: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      description:
        "You consumed 400 units of energy, costing approximately ₹2800. ACs were the most used device, accounting for 50% of the total energy consumption.",
      advice:
        "Consider using energy-saving modes on your AC and ensuring proper insulation to reduce consumption.",
    },
    yearly: {
      options: ["2025", "2024", "2023", "2022", "2021", "2020"],
      description:
        "You consumed 4800 units of energy, costing approximately ₹33,600. Refrigerators were the most used device, accounting for 30% of the total energy consumption.",
      advice:
        "Upgrading to a 5-star energy-efficient refrigerator can significantly reduce costs in the long run.",
    },
  };

  const handleTimeSelect = (event) => {
    setSelectedTime(event.target.value);
  };

  return (
    <div className="flex flex-col items-center py-6 h-screen bg-white ">
      <div className=" text-white text-lg text-center mt-3 py-2 mb-5">
        <h1 className="text-xl font-semibold">Report</h1>
      </div>
      <div className="w-[90%] p-6 text-lg shadow-lg border-[1px] border-neutral-200 shadow-neutral-300 rounded-lg">
        {/* Toggle Buttons */}
        <div className="flex justify-around mb-6">
          {["weekly", "monthly", "yearly"].map((option) => (
            <button
              key={option}
              className={`px-4 py-2 font-medium rounded transition-colors duration-200 ${
                view === option
                  ? " bg-gray-200 shadow-gray-300 border-2  shadow-lg" // Active Button Style
                  : "bg-gray-200 text-gray-700 border border-gray-300 hover:text-white" // Inactive Button Style with Hover
              }`}
              onClick={() => {
                setView(option);
                setSelectedTime(""); // Reset selection when switching views
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* Dropdown Selector */}
        <div className="mb-4">
          <label
            htmlFor="time-select"
            className="block text-gray-700 font-medium mb-2"
          >
            Select{" "}
            {view === "weekly" ? "Week" : view === "monthly" ? "Month" : "Year"}
            :
          </label>
          <select
            id="time-select"
            className="w-full px-3 py-2 border rounded text-gray-700"
            value={selectedTime}
            onChange={handleTimeSelect}
          >
            <option value="" disabled>
              -- Choose an option --
            </option>
            {reports[view].options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Report Display */}
        {selectedTime && (
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-gray-700 mb-3">
              <b>{selectedTime}:</b> {reports[view].description}
            </p>
            <p className="text-gray-700 font-semibold">
              {reports[view].advice}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
