import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { DarkModeContext } from "../context/DarkModeContext";
import { motion, AnimatePresence } from "framer-motion";

const WELCOME = {
  id: "welcome",
  role: "bot",
  text: `Hi! What skill would you like to learn today?`,
};

const LayersIcon = ({ size = 16, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" />
  </svg>
);

const FormattedText = ({ text }) => {
  const lines = text.split("\n");
  return (
    <span>
      {lines.map((line, li) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={li}>
            {parts.map((part, pi) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={pi}>{part.slice(2, -2)}</strong>
              ) : (
                <span key={pi}>{part}</span>
              )
            )}
            {li < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
};

const SkillBuddy = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([WELCOME]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [hiddenHistory, setHiddenHistory] = useState([]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/ai/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHiddenHistory(res.data.map((m) => ({ role: m.role, text: m.text })));
      } catch {
        console.error("History load failed");
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!msg.trim() || loading) return;
    const userMsg = { id: Date.now(), role: "user", text: msg.trim() };
    setChat((prev) => [...prev, userMsg]);
    setMsg("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const history = [...hiddenHistory, ...chat]
        .filter((c) => c.id !== "welcome")
        .slice(-10)
        .map((c) => ({ role: c.role, text: c.text }));
      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        { message: userMsg.text, history },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const botReply = res.data.reply;
      setChat((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: botReply }]);
      setHiddenHistory((prev) => [
        ...prev,
        { role: "user", text: userMsg.text },
        { role: "bot", text: botReply },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: "⚠️ Something went wrong. Try again.", isError: true },
      ]);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: darkMode ? "#0f172a" : "#f0fdfa",
        padding: "24px 16px",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: "fixed", top: "-60px", right: "-60px",
        width: "260px", height: "260px", borderRadius: "50%",
        background: darkMode ? "rgba(20,184,166,0.08)" : "rgba(20,184,166,0.13)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "40px", left: "-40px",
        width: "160px", height: "160px", borderRadius: "50%",
        background: darkMode ? "rgba(20,184,166,0.06)" : "rgba(20,184,166,0.10)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: "520px",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: darkMode
            ? "0 24px 80px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)"
            : "0 24px 80px rgba(20,184,166,0.15), 0 1px 0 rgba(255,255,255,0.9)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 80px)",
          maxHeight: "700px",
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          background: "#14b8a6",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexShrink: 0,
        }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "14px",
            background: "#0f766e",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <LayersIcon size={20} color="#99f6e4" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: "17px", fontWeight: "700", color: "#ffffff",
              letterSpacing: "-0.01em", lineHeight: 1.2,
            }}>
              Skill Buddy
            </div>
            <div style={{ fontSize: "12px", color: "#ccfbf1", marginTop: "2px" }}>
              AI Learning Assistant
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "#34d399",
              boxShadow: "0 0 0 2px rgba(52,211,153,0.3)",
            }} />
            <span style={{ fontSize: "13px", color: "#ccfbf1", fontWeight: "500" }}>
              Online
            </span>
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          background: darkMode ? "#1e293b" : "#ffffff",
          scrollbarWidth: "thin",
          scrollbarColor: darkMode ? "#334155 transparent" : "#ccfbf1 transparent",
        }}>
          {historyLoading ? (
            <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "8px" }}>
              {[0, 1, 2].map((i) => (
                <motion.div key={i}
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#14b8a6" }}
                />
              ))}
            </div>
          ) : (
            <>
              <AnimatePresence initial={false}>
                {chat.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    style={{
                      display: "flex",
                      justifyContent: c.role === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                      gap: "10px",
                    }}
                  >
                    {c.role === "bot" && (
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "10px",
                        background: "#14b8a6",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <LayersIcon size={14} color="white" />
                      </div>
                    )}

                    <div style={{
                      maxWidth: "72%",
                      padding: "11px 15px",
                      borderRadius: c.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      background: c.role === "user"
                        ? "#14b8a6"
                        : darkMode ? "#0f172a" : "#f0fdfa",
                      color: c.role === "user"
                        ? "#ffffff"
                        : darkMode ? "#e2e8f0" : "#134e4a",
                      border: c.role === "bot"
                        ? darkMode ? "1px solid #134e4a" : "1px solid #ccfbf1"
                        : "none",
                      boxShadow: c.role === "bot"
                        ? darkMode
                          ? "0 2px 8px rgba(0,0,0,0.3)"
                          : "0 2px 12px rgba(20,184,166,0.08)"
                        : "none",
                    }}>
                      <FormattedText text={c.text} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
                >
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "10px",
                    background: "#14b8a6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <LayersIcon size={14} color="white" />
                  </div>
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: "18px 18px 18px 4px",
                    background: darkMode ? "#0f172a" : "#f0fdfa",
                    border: darkMode ? "1px solid #134e4a" : "1px solid #ccfbf1",
                    display: "flex", gap: "5px", alignItems: "center",
                  }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i}
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        style={{
                          width: "7px", height: "7px", borderRadius: "50%",
                          background: "#14b8a6",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* ── INPUT BAR ── */}
        <div style={{
          padding: "14px 16px",
          borderTop: darkMode ? "1px solid #1e293b" : "1px solid #ccfbf1",
          background: darkMode ? "#1e293b" : "#ffffff",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexShrink: 0,
        }}>
          <input
            ref={inputRef}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything about learning, DSA, skills..."
            style={{
              flex: 1,
              background: darkMode ? "#0f172a" : "#f0fdfa",
              border: darkMode ? "1px solid #134e4a" : "1px solid #ccfbf1",
              borderRadius: "40px",
              padding: "11px 18px",
              fontSize: "14px",
              color: darkMode ? "#e2e8f0" : "#134e4a",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#14b8a6";
              e.target.style.boxShadow = "0 0 0 3px rgba(20,184,166,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? "#134e4a" : "#ccfbf1";
              e.target.style.boxShadow = "none";
            }}
          />

          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.06, background: "#0d9488" }}
            onClick={sendMessage}
            disabled={!msg.trim() || loading}
            style={{
              width: "44px", height: "44px",
              borderRadius: "50%",
              background: msg.trim() && !loading ? "#14b8a6" : "#99f6e4",
              border: "none",
              cursor: msg.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <SendIcon />
          </motion.button>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: "16px",
          fontSize: "12px",
          color: darkMode ? "#475569" : "#94a3b8",
          zIndex: 1,
          position: "relative",
        }}
      >
        Powered by SkillSwap AI · Your learning, accelerated
      </motion.p>
    </div>
  );
};

export default SkillBuddy;