// Messages.tsx
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const BackendURL = import.meta.env.VITE_API_URL;

const Messages: React.FC = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch conversations for this user
  useEffect(() => {
    if (!currentUser?.id) return;

    fetch(`${BackendURL}/conversations/user/${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setConversations(data);
      })
      .catch(console.error);
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    fetch(`${BackendURL}/messages/${selectedConversation}`)
      .then((res) => res.json())
      .then(setMessages)
      .catch(console.error);
  }, [selectedConversation]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const res = await fetch(`${BackendURL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: selectedConversation,
        senderId: currentUser.id,
        content: newMessage,
      }),
    });

    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen text-white bg-black">
      {/* Sidebar: Conversations */}
      <aside className="w-1/4 border-r border-gray-700 p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Messages</h2>

        {conversations.map((c) => {
          // Find the OTHER user (not the current user)
          const otherParticipant = c.participants.find(
            (p: any) => p.userId !== currentUser.id
          );

          const other = otherParticipant?.user;

          return (
            <div
              key={c.id}
              onClick={() => setSelectedConversation(c.id)}
              className={`p-3 cursor-pointer rounded-lg hover:bg-gray-800 ${selectedConversation === c.id ? "bg-gray-800" : ""
                }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={other?.profileURL}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{other?.name || "Unknown"}</div>
                  <div className="text-gray-400 text-sm truncate">
                    {c.messages?.[0]?.content || "No messages yet"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </aside>


      {/* Right side: Chat Window */}
      <main className="flex-1 flex flex-col">
        <div style={{ fontFamily: 'Roboot-bold' }} className="flex flex-row items-center space-x-6 text-2xl">
          <Link to="/MainFeed"><FontAwesomeIcon icon={faArrowLeft} /></Link>
          {/* <p className="text-2xl" style={{ fontFamily: 'Roboot-bold' }}>Profile</p> */}
        </div>
        {selectedConversation ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.senderId === currentUser.id ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${m.senderId === currentUser.id ? "bg-purple-600" : "bg-gray-800"
                      }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-gray-700 flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-gray-900 text-white rounded-lg p-2 mr-2 focus:outline-none"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-400"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
