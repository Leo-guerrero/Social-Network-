// Messages.tsx
import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const BackendURL = import.meta.env.VITE_API_URL;

const Messages: React.FC = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
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
  }, [currentUser?.id]);

  // Currently active conversation object
  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  const activeOtherUser = useMemo(() => {
    if (!activeConversation) return null;
    const otherParticipant = activeConversation.participants?.find(
      (p: any) => p.userId !== currentUser.id
    );
    return otherParticipant?.user || null;
  }, [activeConversation, currentUser.id]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;

    fetch(`${BackendURL}/messages/${selectedConversationId}`)
      .then((res) => res.json())
      .then(setMessages)
      .catch(console.error);
  }, [selectedConversationId]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    const res = await fetch(`${BackendURL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: selectedConversationId,
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
    <div className="flex h-screen w-full bg-black text-zinc-100">
      {/* Centered content wrapper */}
      <div className="max-w-6xl mx-auto flex flex-col w-full px-4 py-6 gap-4">
        {/* Top header */}
        <header className="flex items-center gap-4 mb-2">
          <Link to="/MainFeed" className="text-zinc-400 hover:text-zinc-200">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h1
            className="text-xl md:text-2xl"
            style={{ fontFamily: "Roboot-Medium" }}
          >
            Messages
          </h1>
        </header>

        {/* Main 2-column layout */}
        <div className="flex flex-1 border border-gray-700 rounded-2xl overflow-hidden bg-zinc-950">
          {/* Column 1: Conversations list */}
          <aside className="w-1/3 min-w-[220px] border-r border-zinc-800 flex flex-col">
            {/* Conversations header */}
            <div className="px-4 py-3 border-b border-zinc-800">
              <p
                className="text-sm text-zinc-400"
                style={{ fontFamily: "Roboot-light" }}
              >
                All conversations
              </p>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 && (
                <div className="h-full flex items-center justify-center text-xs text-zinc-500 px-4 text-center">
                  No conversations yet. Start messaging from profiles or posts.
                </div>
              )}

              {conversations.map((c) => {
                const otherParticipant = c.participants?.find(
                  (p: any) => p.userId !== currentUser.id
                );
                const other = otherParticipant?.user;

                const lastMessage =
                  c.messages?.[c.messages.length - 1]?.content ||
                  c.messages?.[0]?.content ||
                  "No messages yet";

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConversationId(c.id)}
                    className={`w-full text-left px-4 py-3 flex gap-3 items-center hover:bg-zinc-900 focus:outline-none ${
                      selectedConversationId === c.id ? "bg-zinc-900" : ""
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={other?.profileURL}
                        className="w-10 h-10 rounded-full object-cover bg-zinc-800"
                        alt={other?.name || "User"}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium text-zinc-100 truncate"
                        style={{ fontFamily: "Roboot-Medium" }}
                      >
                        {other?.name || "Unknown user"}
                      </div>
                      <div
                        className="text-xs text-zinc-500 truncate"
                        style={{ fontFamily: "Roboot-light" }}
                      >
                        {lastMessage}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Column 2: Chat window */}
          <section className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-3">
              {activeOtherUser ? (
                <>
                  <img
                    src={activeOtherUser.profileURL}
                    className="w-9 h-9 rounded-full object-cover bg-zinc-800"
                    alt={activeOtherUser.name}
                  />
                  <div>
                    <div
                      className="text-sm text-zinc-100"
                      style={{ fontFamily: "Roboot-Medium" }}
                    >
                      {activeOtherUser.name}
                    </div>
                    <div
                      className="text-xs text-zinc-500"
                      style={{ fontFamily: "Roboot-light" }}
                    >
                      Direct messages
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="text-sm text-zinc-500"
                  style={{ fontFamily: "Roboot-light" }}
                >
                  Select a conversation to view messages
                </div>
              )}
            </div>

            {/* Messages list or empty state */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {selectedConversationId && messages.length === 0 && (
                <div
                  className="h-full flex items-center justify-center text-xs text-zinc-500"
                  style={{ fontFamily: "Roboot-light" }}
                >
                  No messages in this conversation yet. Say hi 👋
                </div>
              )}

              {selectedConversationId &&
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.senderId === currentUser.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-2xl max-w-xs text-sm break-words ${
                        m.senderId === currentUser.id
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-800 text-zinc-100"
                      }`}
                      style={{ fontFamily: "Roboot-light" }}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

              {!selectedConversationId && (
                <div
                  className="h-full flex items-center justify-center text-sm text-zinc-500 text-center px-6"
                  style={{ fontFamily: "Roboot-light" }}
                >
                  Choose a conversation from the left to start messaging.
                </div>
              )}
            </div>

            {/* Input bar (only when a conversation is selected) */}
            <div className="px-4 py-3 border-t border-zinc-800">
              {selectedConversationId ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-zinc-900 text-zinc-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Type a message..."
                    style={{ fontFamily: "Roboot-light" }}
                  />
                  <button
                    onClick={sendMessage}
                    className="rounded-xl px-4 py-2 bg-purple-500 hover:bg-purple-400 text-sm text-white hover:text-black disabled:opacity-50 disabled:pointer-events-none"
                    disabled={!newMessage.trim()}
                    style={{ fontFamily: "Roboot-light" }}
                  >
                    Send
                  </button>
                </div>
              ) : (
                <div
                  className="text-xs text-zinc-500 text-center"
                  style={{ fontFamily: "Roboot-light" }}
                >
                  Select a conversation to start chatting.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Messages;
