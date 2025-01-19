import React, { useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      time: "10:30 AM",
      title: "Turn Off Fan",
      message: "Your fan is running since 12 hrs",
    },
  ]);

  // Function to delete a notification
  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Bar */}
      <div className="text-white text-center py-2 mt-5">
        <h1 className="text-xl font-semibold">Notifications</h1>
      </div>

      {/* Notification List */}
      <div className="flex flex-col items-center p-4 text-lg">
        <div className="w-full bg-white rounded-lg shadow-md border-[1px] p-4">
          {notifications.length === 0 ? (
            <p className="text-gray-600">No notifications available.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="border-b border-gray-200 pb-2 mb-2 flex justify-between items-start"
              >
                <div>
                  <p className="text-sm text-gray-500">{notification.time}</p>
                  <p className="font-semibold text-gray-800">
                    {notification.title}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-gray-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Notifications;
