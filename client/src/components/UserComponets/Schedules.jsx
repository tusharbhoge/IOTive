import React, { useState } from "react";

const Schedules = () => {
  const [device, setDevice] = useState("");
  const [date, setDate] = useState(""); // New state for date
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [schedules, setSchedules] = useState([]);


  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (device && date && startTime && endTime) {
      setSchedules([
        ...schedules,
        { id: Date.now(), device, date, startTime, endTime },
      ]);
      setDevice("");
      setDate("");
      setStartTime("");
      setEndTime("");
    }
  };

  // Handle schedule deletion
  const handleDelete = (id) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  return (
    <div className="text-lg flex flex-col h-screen bg-white">
      {/* Top Bar */}
      <div className=" text-white text-center mt-3 py-2">
        <h1 className="text-xl font-semibold">Schedules</h1>
      </div>

      <div className="flex flex-col items-center p-4">
        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full rounded-lg shadow-lg border-[1px] p-4 flex flex-col gap-4"
        >
          {/* Select Device */}
          <div>
            <label
              htmlFor="device"
              className="block text-gray-600 text-lg font-semibold mb-1"
            >
              Select Device
            </label>
            <select
              id="device"
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">-- Choose a device --</option>
              <option value="Hall AC">Hall AC</option>
              <option value="Bedroom Light">Bedroom Light</option>
              <option value="Water Heater">Water Heater</option>
            </select>
          </div>

          {/* Select Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-gray-600 font-semibold mb-1"
            >
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Start Time */}
          <div>
            <label
              htmlFor="start-time"
              className="block text-gray-600 font-semibold mb-1"
            >
              Start Time
            </label>
            <input
              type="time"
              id="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* End Time */}
          <div>
            <label
              htmlFor="end-time"
              className="block text-gray-600 font-semibold mb-1"
            >
              End Time
            </label>
            <input
              type="time"
              id="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white rounded-lg py-2 font-semibold hover:bg-green-700"
          >
            Submit
          </button>
        </form>

        {/* Form */}

        {/* Scheduled Appliances */}
        <div className="w-full bg-white rounded-lg shadow-md p-4 mt-4">
          <h3 className="text-green-600 font-semibold mb-2">
            Scheduled Appliances
          </h3>
          <ul className="text-gray-600">
            {schedules.length === 0 ? (
              <li>No appliances scheduled yet.</li>
            ) : (
              schedules.map((schedule) => (
                <li
                  key={schedule.id}
                  className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2"
                >
                  <div>
                    <span className="font-semibold">{schedule.device}</span> -{" "}
                    {formatDate(schedule.date)} from {schedule.startTime} to{" "}
                    {schedule.endTime}
                  </div>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="text-gray-600 text-sm font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
