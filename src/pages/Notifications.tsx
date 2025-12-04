import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link} from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const BackendURL = import.meta.env.VITE_API_URL;

const Notifications: React.FC = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser?.id) return;

    fetch(`${BackendURL}/notifications/${currentUser.id}`)
      .then((res) => res.json())
      .then(setNotifications)
      .catch(console.error);
  }, []);

  const markAsRead = async (id: number) => {
    await fetch(`${BackendURL}/notifications/read/${id}`, { method: "PUT" });

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <div style={{ fontFamily: 'Roboot-bold' }} className="flex flex-row items-center space-x-6 text-2xl">
        <Link to="/MainFeed"><FontAwesomeIcon icon={faArrowLeft} /></Link>
      </div>
      <h2 className="font-bold text-lg mb-6">Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications yet</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`flex items-center gap-3 p-3 border-b border-gray-800 cursor-pointer transition ${n.isRead ? "text-gray-500" : "text-white"
              }`}
          >
            {/* Avatar */}
            <img
              src={n.sender?.profileURL || "/default-avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* Text */}
            <div>
              <span className="font-semibold">
                {n.sender ? n.sender.name : "System"}
              </span>{" "}
              {n.type === "message" && "sent you a message"}
              {n.type === "follow" && "started following you"}
              {n.type === "like" && "liked your post"}
              {n.type === "reply" && "replied to your post"}

              {/* Message preview */}
              {n.message && (
                <p className="text-sm text-gray-400 mt-1">{n.message}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
