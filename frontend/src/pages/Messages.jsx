import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";

const Messages = () => {
  const { id } = useParams(); // 👈 chat partner id
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  /* -----------------------------
     FETCH CHAT
  ------------------------------ */
  useEffect(() => {
    if (!id) return;
    fetchMessages();
  }, [id]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await axios.get(
        `http://localhost:5000/api/messages/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     SEND MESSAGE
  ------------------------------ */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!id) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/messages/send",
        {
          receiverId: id,
          text: newMessage.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err.response?.data || err);
    }
  };

  /* -----------------------------
     AUTO SCROLL
  ------------------------------ */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`min-h-screen flex justify-center p-6 ${
        darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-lg flex flex-col ${
          darkMode ? "bg-slate-800" : "bg-white"
        }`}
      >
        {/* HEADER */}
        <div
          className={`p-5 border-b font-semibold text-lg ${
            darkMode ? "border-slate-700" : "border-gray-200"
          }`}
        >
          Messages
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading && <p className="text-center">Loading messages...</p>}

          {!loading && messages.length === 0 && (
            <p className="text-gray-500 text-center">
              No messages yet. Say hi 👋
            </p>
          )}

          {messages.map((msg) => {
            const isMe = msg.sender?._id === user?._id;

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                    isMe
                      ? "bg-teal-500 text-white"
                      : darkMode
                      ? "bg-slate-700 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div
          className={`p-4 border-t flex gap-3 ${
            darkMode ? "border-slate-700" : "border-gray-200"
          }`}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 px-4 py-2 rounded-lg outline-none ${
              darkMode
                ? "bg-slate-700 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;