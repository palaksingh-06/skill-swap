import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StreamChat } from "stream-chat";

import {
  Chat,
  Channel,
  Window,
  MessageList,
  Thread,
  useChannelStateContext,
} from "stream-chat-react";

import "stream-chat-react/dist/css/v2/index.css";

import EmojiPicker from "emoji-picker-react";
import { AuthContext } from "../context/AuthContext";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

/* =========================
   THEME
========================= */

const buildTheme = () => `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --str-chat-primary-color: #ffffff;
  --str-chat-surface-color: transparent;
  --str-chat-text-color: #ffffff;
  --str-chat-font-family: 'Inter', sans-serif;
}

.str-chat,
.str-chat__container,
.str-chat__channel,
.str-chat__main-panel {
  background: linear-gradient(135deg, #CFEDE6, #A9DED4) !important;
  font-family: 'Inter', sans-serif !important;
}

.str-chat__list {
  background: transparent !important;
  padding: 20px !important;
}

.str-chat__message--me .str-chat__message-bubble {
  background: #ffffff !important;
  color: #0f2421 !important;
  border-radius: 18px 18px 6px 18px !important;
  box-shadow: 0 6px 18px rgba(0,0,0,0.10) !important;
}

.str-chat__message:not(.str-chat__message--me)
.str-chat__message-bubble {
  background: rgba(255,255,255,0.5) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.6) !important;
  border-radius: 18px 18px 18px 6px !important;
  color: #0f2421 !important;
}

.str-chat__avatar {
  display: none !important;
}

.str-chat__thread {
  background: rgba(255,255,255,0.35) !important;
  backdrop-filter: blur(10px);
}

.str-chat__date-separator-date {
  background: rgba(255,255,255,0.7) !important;
  padding: 4px 12px !important;
  border-radius: 999px !important;
  color: #0f2421 !important;
}

.str-chat__list::-webkit-scrollbar {
  width: 4px;
}

.str-chat__list::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
}
`;

/* =========================
   CUSTOM HEADER
========================= */

const CustomHeader = ({ targetUser, authUser, onBack }) => {
  const { channel } = useChannelStateContext();

  const [onlineIds, setOnlineIds] = useState(new Set());

  useEffect(() => {
    if (!channel) return;

    const refresh = () => {
      const ids = new Set();

      Object.values(channel.state?.members || {}).forEach((m) => {
        if (m.user?.online) {
          ids.add(m.user_id || m.user?.id);
        }
      });

      setOnlineIds(ids);
    };

    refresh();

    channel.on("user.presence.changed", refresh);
    channel.on("user.watching.start", refresh);
    channel.on("user.watching.stop", refresh);

    return () => {
      channel.off("user.presence.changed", refresh);
      channel.off("user.watching.start", refresh);
      channel.off("user.watching.stop", refresh);
    };
  }, [channel]);

  const targetId =
    targetUser?._id?.toString() ||
    targetUser?.id?.toString();

  const isOnline = onlineIds.has(targetId);

  const avatar = (u, fallback) => {
    const src = u?.avatar || u?.profilePic || u?.image;

    return (
      src ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fallback || "U"
      )}&background=1F8F7A&color=fff&size=128`
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 20px",
        background: "#ffffff",
        borderBottom: "1px solid rgba(31,143,122,0.15)",
      }}
    >
      <button
        onClick={onBack}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
        }}
      >
        ←
      </button>

      <img
        src={avatar(targetUser, targetUser?.name)}
        alt=""
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: "#0f2421" }}>
          {targetUser?.name || "Chat"}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: isOnline ? "#22c55e" : "#94a3b8",
          }}
        >
          {isOnline ? "Active now" : "Offline"}
        </div>
      </div>

      <img
        src={avatar(authUser, authUser?.name)}
        alt=""
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

/* =========================
   CUSTOM INPUT
========================= */

const CustomInput = ({ client }) => {
  const { channel } = useChannelStateContext();

  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);

  // Voice recording state
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // Attachment state
  const [attachments, setAttachments] = useState([]); // [{ file, previewURL }]
  const fileInputRef = useRef(null);

  const emojiRef = useRef(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Cleanup recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  /* ---------- VOICE ---------- */

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone permission is required for voice messages.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setAudioURL(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
  };

  const formatSeconds = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  /* ---------- ATTACHMENTS ---------- */

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      file,
      previewURL: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = "";
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- SEND ---------- */

  const handleSend = async () => {
    const trimmed = value.trim();
    const hasText = trimmed.length > 0;
    const hasAttachments = attachments.length > 0;
    const hasAudio = !!audioBlob;

    if (!hasText && !hasAttachments && !hasAudio) return;
    if (sending) return;

    if (!client || !client.userID || !channel) {
      console.warn("Client not ready, aborting send");
      return;
    }

    try {
      setSending(true);

      // Upload all files (attachments + optional voice blob)
      const uploadedAttachments = [];

      for (const { file } of attachments) {
        const res = await channel.sendFile(file);
        uploadedAttachments.push({
          type: file.type.startsWith("image/") ? "image" : "file",
          asset_url: res.file,
          title: file.name,
          mime_type: file.type,
          file_size: file.size,
        });
      }

      if (hasAudio) {
        const audioFile = new File(
          [audioBlob],
          `voice-${Date.now()}.webm`,
          { type: "audio/webm" }
        );
        const res = await channel.sendFile(audioFile);
        uploadedAttachments.push({
          type: "audio",
          asset_url: res.file,
          title: "Voice message",
          mime_type: "audio/webm",
        });
      }

      await channel.sendMessage({
        text: trimmed || undefined,
        attachments: uploadedAttachments,
      });

      setValue("");
      setAttachments([]);
      setAudioBlob(null);
      setAudioURL(null);
      setRecordingSeconds(0);
    } catch (err) {
      console.error("SEND ERROR:", err);
    } finally {
      setSending(false);
    }
  };

  const canSend =
    value.trim().length > 0 || attachments.length > 0 || !!audioBlob;

  return (
    <div
      style={{
        background: "#ffffff",
        borderTop: "1px solid rgba(31,143,122,0.12)",
        position: "relative",
      }}
    >
      {/* Emoji Picker */}
      {showEmoji && (
        <div
          ref={emojiRef}
          style={{
            position: "absolute",
            bottom: "70px",
            left: "12px",
            zIndex: 100,
          }}
        >
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setValue((prev) => prev + emojiData.emoji);
              setShowEmoji(false);
            }}
          />
        </div>
      )}

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "8px 16px 0",
            flexWrap: "wrap",
          }}
        >
          {attachments.map((att, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                background: "rgba(31,143,122,0.08)",
                borderRadius: "10px",
                padding: att.previewURL ? "0" : "8px 12px",
                fontSize: "12px",
                color: "#1F8F7A",
                fontWeight: 500,
                maxWidth: "120px",
                overflow: "hidden",
              }}
            >
              {att.previewURL ? (
                <img
                  src={att.previewURL}
                  alt=""
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    display: "block",
                  }}
                />
              ) : (
                <span
                  style={{
                    display: "block",
                    maxWidth: "90px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  📎 {att.file.name}
                </span>
              )}
              <button
                onClick={() => removeAttachment(i)}
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Voice preview (recorded but not yet sent) */}
      {audioURL && !recording && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 16px 0",
          }}
        >
          <audio controls src={audioURL} style={{ height: "32px", flex: 1 }} />
          <button
  onClick={cancelRecording}
  title="Discard voice message"
  style={{
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    border: "1px solid rgba(239,68,68,0.18)",
    background: "rgba(239,68,68,0.06)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
    flexShrink: 0,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background =
      "rgba(239,68,68,0.12)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background =
      "rgba(239,68,68,0.06)";
  }}
>
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M18 6L6 18"
      stroke="#ef4444"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6 6L18 18"
      stroke="#ef4444"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
</button>
        </div>
      )}

      {/* Main input row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
        }}
      >
        {/* Emoji */}
<button
  onClick={() => setShowEmoji((prev) => !prev)}
  title="Emoji"
  style={{
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    border: "1px solid rgba(31,143,122,0.12)",
    cursor: "pointer",
    background: "#f7fdfb",
    fontSize: "18px",
    flexShrink: 0,
    transition: "0.2s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#eef8f5";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#f7fdfb";
  }}
>
  😊
</button>

{/* Attachment */}
<button
  onClick={() => fileInputRef.current?.click()}
  title="Attach file"
  style={{
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    border: "1px solid rgba(31,143,122,0.12)",
    cursor: "pointer",
    background: "#f7fdfb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "0.2s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#eef8f5";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#f7fdfb";
  }}
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
      stroke="#1F8F7A"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>

<input
  ref={fileInputRef}
  type="file"
  multiple
  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
  onChange={handleFileChange}
  style={{ display: "none" }}
/>

{/* Text Input */}
{recording ? (
  <div
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 16px",
      borderRadius: "999px",
      background: "rgba(239,68,68,0.08)",
      border: "1px solid rgba(239,68,68,0.25)",
    }}
  >
    <span
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "#ef4444",
        animation: "pulse 1s infinite",
      }}
    />

    <span
      style={{
        fontSize: "13px",
        color: "#ef4444",
        fontWeight: 600,
      }}
    >
      Recording... {formatSeconds(recordingSeconds)}
    </span>
  </div>
) : (
  <input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }}
    placeholder="Type a message..."
    style={{
      flex: 1,
      padding: "12px 18px",
      borderRadius: "999px",
      border: "1px solid rgba(31,143,122,0.18)",
      outline: "none",
      fontSize: "14px",
      background: "#f7fdfb",
      color: "#0f2421",
    }}
  />
)}

{/* Voice Button */}
{!audioURL && (
  <button
    onClick={recording ? stopRecording : startRecording}
    title={recording ? "Stop recording" : "Voice message"}
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "14px",
      border: "1px solid rgba(31,143,122,0.12)",
      cursor: "pointer",
      background: recording
        ? "rgba(239,68,68,0.12)"
        : "#f7fdfb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = recording
        ? "rgba(239,68,68,0.18)"
        : "#eef8f5";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = recording
        ? "rgba(239,68,68,0.12)"
        : "#f7fdfb";
    }}
  >
    {recording ? (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="#ef4444"
      >
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    ) : (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z"
          stroke="#1F8F7A"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 10v1a7 7 0 01-14 0v-1"
          stroke="#1F8F7A"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 19v3"
          stroke="#1F8F7A"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )}
  </button>
)}

{/* Send Button */}
{canSend && !recording && (
  <button
    onClick={handleSend}
    disabled={sending}
    title="Send"
    style={{
      width: "42px",
      height: "42px",
      borderRadius: "14px",
      border: "none",
      cursor: "pointer",
      background:
        "linear-gradient(135deg,#1F8F7A,#177a67)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      opacity: sending ? 0.7 : 1,
      transition: "0.2s",
      boxShadow: "0 4px 14px rgba(31,143,122,0.25)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M22 2L11 13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
)}</div>

      {/* Pulse animation for recording indicator */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

/* =========================
   CHAT INNER
========================= */

const ChatInner = ({ targetUser, authUser, onBack, client }) => {
  return (
    <Window>
      <CustomHeader
        targetUser={targetUser}
        authUser={authUser}
        onBack={onBack}
      />

      <MessageList />

      {/* Pass client down so CustomInput can guard sends reliably */}
      <CustomInput client={client} />
    </Window>
  );
};

/* =========================
   MAIN PAGE
========================= */

const ChatPage = () => {
  const { userId: targetUserId } = useParams();
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser || !targetUserId) return;

    let mounted = true;

    const initChat = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        // Use singleton — never create a new instance
        const chatClient = StreamChat.getInstance(STREAM_API_KEY);

        // Only disconnect if a DIFFERENT user was previously connected
        if (
          chatClient.userID &&
          chatClient.userID !== authUser._id.toString()
        ) {
          await chatClient.disconnectUser();
        }

        // Fetch Stream token + target user profile in parallel
        const [tokenRes, profileRes] = await Promise.all([
          axios.get("http://localhost:5000/api/chat/token", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `http://localhost:5000/api/user/public/profile/${targetUserId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        if (!mounted) return;

        const target = profileRes.data.user || profileRes.data;
        setTargetUser(target);

        // Ensure target user exists in Stream
        await axios.post(
          `http://localhost:5000/api/chat/upsert-user/${targetUserId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Only connect if not already connected as this user
        if (!chatClient.userID) {
          await chatClient.connectUser(
            {
              id: authUser._id.toString(),
              name: authUser.name,
              image: authUser.avatar || authUser.profilePic || "",
            },
            tokenRes.data.token
          );
        }

        // Build deterministic channel ID from sorted member IDs
        const members = [
          authUser._id.toString(),
          targetUserId.toString(),
        ].sort();

        const channelId = `chat-${members[0]}-${members[1]}`;

        const currentChannel = chatClient.channel("messaging", channelId, {
          members,
        });

        await currentChannel.watch();

        if (!mounted) return;

        setClient(chatClient);
        setChannel(currentChannel);
      } catch (err) {
        console.error("CHAT INIT ERROR:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initChat();

    return () => {
      // Only flag unmount — do NOT call disconnectUser() here.
      // The singleton client is shared across the app; disconnecting
      // it in a cleanup would break any concurrent channel operations
      // and cause the "connectUser wasn't called" error on send.
      mounted = false;
    };
  }, [authUser, targetUserId]);

  if (loading || !client || !channel) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#1F8F7A",
          fontWeight: "600",
        }}
      >
        Connecting...
      </div>
    );
  }

  return (
    <>
      <style>{buildTheme()}</style>

      <div
        style={{
          height: "88vh",
          maxWidth: "920px",
          margin: "0 auto",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(31,143,122,0.15)",
          boxShadow: "0 8px 40px rgba(31,143,122,0.10)",
          background: "#f7fdfb",
        }}
      >
        <Chat client={client} theme="messaging light">
          <Channel channel={channel}>
            <ChatInner
              targetUser={targetUser}
              authUser={authUser}
              onBack={() => navigate(-1)}
              client={client}
            />

            <Thread />
          </Channel>
        </Chat>
      </div>
    </>
  );
};

export default ChatPage;