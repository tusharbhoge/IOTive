import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


const Analytics = () => {
  const [view, setView] = useState("weekly"); // Current timeframe (weekly, monthly, yearly)
  
  const [selectedAppliance, setSelectedAppliance] = useState(""); // Current selected appliance


  const reports = {
    weekly: {
      options: ["Week 1", "Week 2", "Week 3", "Week 4"],
      appliances: {
        Fan: [40, 35, 30, 25],
        AC: [30, 25, 20, 15],
        Refrigerator: [15, 20, 25, 30],
      },
    },
    monthly: {
      options: ["January", "February", "March", "April", "May"],
      appliances: {
        Fan: [200, 250, 300, 400, 350],
        AC: [300, 400, 500, 600, 550],
        Refrigerator: [150, 200, 250, 300, 350],
      },
    },
    yearly: {
      options: ["2023", "2022", "2021", "2020"],
      appliances: {
        Fan: [1200, 1300, 1400, 1500],
        AC: [2000, 2100, 2200, 2300],
        Refrigerator: [800, 900, 1000, 1100],
      },
    },
  };

  

  const handleApplianceSelect = (event) => {
    setSelectedAppliance(event.target.value);
  };

  const generateChartData = () => {
    const data = reports[view].appliances[selectedAppliance];
    const labels = reports[view].options;

    return {
      labels: labels,
      datasets: [
        {
          label: `${selectedAppliance} Energy Consumption`,
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  

  return (
    <div className="flex flex-col items-center h-screen bg-white">
      <div className=" text-white text-center mt-5 py-2">
        <h1 className="text-xl font-semibold">Analytics</h1>
      </div>
      <div className="w-[90%] max-w-md p-6 text-lg mt-3 bg-white border-[1px] shadow-lg rounded-lg">

        {/* Toggle Buttons */}
        <div className="flex justify-around mb-6 text-lg">
          {["weekly", "monthly", "yearly"].map((option) => (
            <button
              key={option}
              className={`px-4 py-2 font-medium rounded ${
                view === option
                  ?" bg-gray-200 shadow-gray-300 border-2  shadow-lg" 
                  : "bg-gray-200 text-gray-700 border border-gray-300 hover:text-white"
              } transition-colors duration-200`}
              onClick={() => {
                setView(option);
                setSelectedAppliance(""); // Reset appliance selection
              }}
            >
               {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* Dropdown Selector for Appliance */}
        <div className="mb-4">
          <label
            htmlFor="appliance-select"
            className="block text-gray-700 font-medium mb-2"
          >
            Select Appliance:
          </label>
          <select
            id="appliance-select"
            className="w-full px-3 py-2 border rounded text-gray-700"
            value={selectedAppliance}
            onChange={handleApplianceSelect}
          >
            <option value="" disabled>
              -- Choose an appliance --
            </option>
            {Object.keys(reports[view].appliances).map((appliance, index) => (
              <option key={index} value={appliance}>
                {appliance}
              </option>
            ))}
          </select>
        </div>

        {/* Graph Display */}
        {selectedAppliance && (
          <div className="bg-gray-100 p-4 rounded">
            <Bar data={generateChartData()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
