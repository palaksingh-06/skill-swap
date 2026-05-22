

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StreamChat } from "stream-chat";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatListPage = () => {
  const { user: authUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const [channels, setChannels] = useState([]);
  const [userProfiles, setUserProfiles] = useState({}); // { userId: { name, avatar } }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return;

    let client;

    const loadChats = async () => {
      try {
        const authToken = localStorage.getItem("token");

        const { data } = await axios.get(
          "https://skill-swap-zkfd.onrender.com/api/chat/token",
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        client = StreamChat.getInstance(STREAM_API_KEY);

        if (!client.userID) {
          await client.connectUser(
            { id: authUser._id, name: authUser.name },
            data.token
          );
        }

        const filter = {
          type: "messaging",
          members: { $in: [authUser._id] },
        };
        const sort = { last_message_at: -1 };

        const userChannels = await client.queryChannels(filter, sort, {
          watch: true,
          state: true,
        });

        setChannels(userChannels);

        // Collect all unique other-member IDs
        const otherIds = userChannels
          .map((ch) => {
            const members = Object.values(ch.state.members);
            const other = members.find((m) => m.user.id !== authUser._id);
            return other?.user?.id || null;
          })
          .filter(Boolean)
          .filter((id, idx, arr) => arr.indexOf(id) === idx); // unique

        // Fetch all profiles in parallel using the same endpoint as PublicProfile
        const profileResults = await Promise.allSettled(
          otherIds.map((id) =>
            axios
              .get(`https://skill-swap-zkfd.onrender.com/api/user/public/profile/${id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
              })
              .then((res) => {
                const u = res.data.user || res.data;
                return { id, name: u.name, avatar: u.avatar || null };
              })
          )
        );

        const profiles = {};
        profileResults.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            const { id, name, avatar } = result.value;
            profiles[id] = { name, avatar };
          }
        });

        setUserProfiles(profiles);
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadChats();

    return () => {
      if (client) client.disconnectUser();
    };
  }, [authUser]);

  const getOtherMember = (channel) => {
    const members = Object.values(channel.state.members);
    return members.find((m) => m.user.id !== authUser._id) || null;
  };

  const getLastMessage = (channel) => {
    const messages = channel.state.messages;
    if (!messages.length) return "No messages yet";
    const last = messages[messages.length - 1];
    if (last.attachments?.length) {
      const att = last.attachments[0];
      if (att.type === "image") return "📷 Image";
      if (att.type === "audio") return "🎙️ Voice message";
      return "📎 " + (att.title || "Attachment");
    }
    return last.text || "Attachment";
  };

  const getUnreadCount = (channel) => {
    return channel.countUnread?.() || 0;
  };

  const formatTime = (channel) => {
    const messages = channel.state.messages;
    if (!messages.length) return "";
    const last = messages[messages.length - 1];
    const date = new Date(last.created_at);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          gap: "16px",
          fontFamily: "'DM Sans', sans-serif",
          background: darkMode ? "#0f172a" : "#f0fdfa",
        }}
      >
        <div
          style={{
            width: "48px", height: "48px",
            border: "3px solid #ccfbf1",
            borderTop: "3px solid #0d9488",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "#0d9488", fontWeight: 500, margin: 0 }}>
          Loading conversations…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        background: darkMode ? "#0f172a" : "#f8fffe",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .chat-row:hover { transform: translateY(-1px); }
      `}</style>

      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: 0,
              color: darkMode ? "#f0fdfa" : "#134e4a",
            }}
          >
            Messages
          </h1>
          <p style={{ margin: "4px 0 0", color: darkMode ? "#5eead4" : "#0d9488", fontSize: "14px" }}>
            {channels.length} conversation{channels.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Empty state */}
        {channels.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              marginTop: "80px",
              color: darkMode ? "#5eead4" : "#0d9488",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
            <p style={{ fontWeight: 600, fontSize: "18px", margin: 0 }}>No conversations yet</p>
            <p style={{ fontSize: "14px", marginTop: "8px", opacity: 0.7 }}>
              Start chatting from Browse Skills!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {channels.map((channel) => {
              const other = getOtherMember(channel);
              const otherId = other?.user?.id;
              const profile = userProfiles[otherId];

              // Prefer fetched profile name/avatar, fall back to Stream's user data
              const displayName = profile?.name || other?.user?.name || "Unknown";
              const avatarUrl = profile?.avatar || other?.user?.image || null;

              const lastMsg = getLastMessage(channel);
              const unread = getUnreadCount(channel);
              const time = formatTime(channel);

              const avatarSrc = avatarUrl
                ? avatarUrl
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0d9488&color=fff&size=128`;

              return (
                <div
                  key={channel.id}
                  className="chat-row"
                  onClick={() => navigate(`/chat/${otherId}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 16px",
                    borderRadius: "16px",
                    cursor: "pointer",
                    background: darkMode ? "#1e293b" : "#ffffff",
                    border: `1px solid ${darkMode ? "#334155" : "#e2f8f5"}`,
                    boxShadow: darkMode
                      ? "0 2px 8px rgba(0,0,0,0.3)"
                      : "0 2px 12px rgba(13,148,136,0.07)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = darkMode
                      ? "0 4px 16px rgba(0,0,0,0.4)"
                      : "0 6px 20px rgba(13,148,136,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = darkMode
                      ? "0 2px 8px rgba(0,0,0,0.3)"
                      : "0 2px 12px rgba(13,148,136,0.07)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Avatar */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #5eead4",
                      }}
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0d9488&color=fff&size=128`;
                      }}
                    />
                    {/* Online dot — uses Stream presence */}
                    {other?.user?.online && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "2px", right: "2px",
                          width: "11px", height: "11px",
                          background: "#4ade80",
                          borderRadius: "50%",
                          border: `2px solid ${darkMode ? "#1e293b" : "#ffffff"}`,
                        }}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: unread > 0 ? 700 : 600,
                          fontSize: "15px",
                          color: darkMode ? "#f0fdfa" : "#134e4a",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {displayName}
                      </p>
                      <span
                        style={{
                          fontSize: "11px",
                          color: darkMode ? "#5eead4" : "#94a3b8",
                          flexShrink: 0,
                          marginLeft: "8px",
                        }}
                      >
                        {time}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "3px" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: unread > 0
                            ? (darkMode ? "#5eead4" : "#0d9488")
                            : (darkMode ? "#94a3b8" : "#64748b"),
                          fontWeight: unread > 0 ? 600 : 400,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "80%",
                        }}
                      >
                        {lastMsg}
                      </p>
                      {/* Unread badge */}
                      {unread > 0 && (
                        <span
                          style={{
                            background: "#0d9488",
                            color: "#fff",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 7px",
                            flexShrink: 0,
                            marginLeft: "8px",
                          }}
                        >
                          {unread > 99 ? "99+" : unread}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    style={{ flexShrink: 0, opacity: 0.4 }}
                  >
                    <path d="M9 18l6-6-6-6" stroke={darkMode ? "#5eead4" : "#134e4a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListPage;