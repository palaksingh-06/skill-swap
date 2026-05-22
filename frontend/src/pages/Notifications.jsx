import { useEffect, useState, useCallback } from "react";

/* ── SVG Icons ── */
const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
    <path d="M3.5 9.5L7.5 13.5L14.5 5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
    <path d="M2.5 2.5L13.5 13.5M13.5 2.5L2.5 13.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);
const IconUser = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const IconInfo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);
const IconBell = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* Strip emoji from message text */
const stripEmoji = (str = "") =>
  str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();

const parseSender = (message = "") => {
  const clean = stripEmoji(message);
  const words = clean.trim().split(" ").filter(Boolean);
  if (words.length > 3) {
    return { sender: words.slice(0, 2).join(" "), body: words.slice(2).join(" ") };
  }
  return { sender: null, body: clean };
};

const getIconConfig = (message = "") => {
  const msg = stripEmoji(message).toLowerCase();
  if (msg.includes("accept"))  return { Icon: IconCheck, bg: "#dcfdf4", color: "#0d9488", bgDark: "#0f2e2b", colorDark: "#2dd4bf" };
  if (msg.includes("declin") || msg.includes("reject")) return { Icon: IconX, bg: "#fee2e2", color: "#dc2626", bgDark: "#2d1515", colorDark: "#f87171" };
  if (msg.includes("assign") || msg.includes("request")) return { Icon: IconUser, bg: "#e0faf5", color: "#0f766e", bgDark: "#0f2e2b", colorDark: "#2dd4bf" };
  return { Icon: IconInfo, bg: "#e0faf5", color: "#0d9488", bgDark: "#0f2e2b", colorDark: "#2dd4bf" };
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const token = localStorage.getItem("token");

  // ── Detect dark mode from data-theme attribute (set by your useTheme hook) ──
  useEffect(() => {
    const check = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDark(theme === "dark");
    };
    check();
    // Watch for attribute changes (when user toggles theme)
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    return () => observer.disconnect();
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      if (!token) return;
      const res = await fetch("https://skill-swap-zkfd.onrender.com/api/notifications", {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await fetch(`https://skill-swap-zkfd.onrender.com/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => n._id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("https://skill-swap-zkfd.onrender.com/api/notifications/read-all", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`https://skill-swap-zkfd.onrender.com/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadList  = notifications.filter((n) => !n.read);
  const readList    = notifications.filter((n) =>  n.read);

  // ── Dark mode color tokens ──
  const d = isDark;
  const colors = {
    pageBg:        d ? "#0f172a" : "#f8fafc",
    cardBg:        d ? "#1e293b" : "#ffffff",
    cardBgUnread:  d ? "#162330" : "#f0fdfb",
    cardBgUnreadHover: d ? "#1a2e3d" : "#e6faf7",
    cardBgHover:   d ? "#253347" : "#f8fffe",
    border:        d ? "#2d3f55" : "#e2e8f0",
    borderLight:   d ? "#1e2d3f" : "#f1f5f9",
    titleColor:    d ? "#f1f5f9" : "#0f172a",
    subtitleColor: d ? "#94a3b8" : "#64748b",
    senderColor:   d ? "#e2e8f0" : "#0f172a",
    senderReadColor: d ? "#475569" : "#94a3b8",
    bodyColor:     d ? "#64748b" : "#64748b",
    bodyReadColor: d ? "#334155" : "#cbd5e1",
    labelColor:    d ? "#475569" : "#94a3b8",
    deleteBg:      d ? "#1e293b" : "#ffffff",
    deleteBorder:  d ? "#2d3f55" : "#e2e8f0",
    deleteColor:   d ? "#475569" : "#94a3b8",
    deleteHoverBg: d ? "#2d1515" : "#fef2f2",
    emptyBg:       d ? "#1e293b" : "#ffffff",
    emptyIconBg:   d ? "#0f2e2b" : "#f0fdfa",
    emptyTitleColor: d ? "#e2e8f0" : "#0f172a",
    emptyDescColor:  d ? "#475569" : "#94a3b8",
    markAllBg:     d ? "#1e293b" : "#ffffff",
    markAllHoverBg: d ? "#0d9488" : "#0d9488",
    shadowColor:   d ? "rgba(0,0,0,0.3)" : "rgba(15,23,42,0.05)",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .nf-page {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: ${colors.pageBg};
          -webkit-font-smoothing: antialiased;
          transition: background 0.2s;
        }

        .nf-inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 48px 40px 80px;
        }

        .nf-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 36px;
          padding-bottom: 28px;
          border-bottom: 2px solid ${colors.border};
        }

        .nf-title {
          font-size: 42px;
          font-weight: 800;
          color: ${colors.titleColor};
          margin: 0 0 10px;
          letter-spacing: -1.2px;
          line-height: 1;
        }

        .nf-subtitle {
          font-size: 18px;
          color: ${colors.subtitleColor};
          margin: 0;
          font-weight: 500;
        }

        .nf-subtitle strong {
          color: #0d9488;
          font-weight: 700;
        }

        .nf-mark-all {
          font-size: 15px;
          font-weight: 700;
          color: #0d9488;
          background: ${colors.markAllBg};
          border: 2px solid #0d9488;
          border-radius: 10px;
          padding: 13px 28px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
          letter-spacing: 0.1px;
        }
        .nf-mark-all:hover {
          background: #0d9488;
          color: #ffffff;
        }

        .nf-section-label {
          font-size: 13px;
          font-weight: 800;
          color: ${colors.labelColor};
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 14px;
          margin-top: 40px;
          padding-left: 4px;
        }

        .nf-group {
          background: ${colors.cardBg};
          border: 1.5px solid ${colors.border};
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px ${colors.shadowColor};
        }

        .nf-card {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 26px 32px;
          background: ${colors.cardBg};
          border-bottom: 1.5px solid ${colors.borderLight};
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
        }

        .nf-card:last-child {
          border-bottom: none;
        }

        .nf-card:hover {
          background: ${colors.cardBgHover};
        }

        .nf-card.unread {
          background: ${colors.cardBgUnread};
        }
        .nf-card.unread:hover {
          background: ${colors.cardBgUnreadHover};
        }

        .nf-card.unread::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 5px;
          background: #0d9488;
          border-radius: 0;
        }
        .nf-card.unread:first-child::before { border-radius: 14px 0 0 0; }
        .nf-card.unread:last-child::before  { border-radius: 0 0 0 14px; }
        .nf-card.unread:only-child::before  { border-radius: 14px 0 0 14px; }

        .nf-icon {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nf-content {
          flex: 1;
          min-width: 0;
        }

        .nf-sender {
          font-size: 19px;
          font-weight: 700;
          color: ${colors.senderColor};
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nf-body {
          font-size: 16px;
          color: ${colors.bodyColor};
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
        }

        .nf-card.read .nf-sender {
          font-weight: 500;
          color: ${colors.senderReadColor};
        }
        .nf-card.read .nf-body {
          color: ${colors.bodyReadColor};
          font-weight: 400;
        }

        .nf-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }

        .nf-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #0d9488;
          flex-shrink: 0;
        }

        .nf-delete {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 1.5px solid ${colors.deleteBorder};
          background: ${colors.deleteBg};
          color: ${colors.deleteColor};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          flex-shrink: 0;
        }
        .nf-delete:hover {
          background: ${d ? "#2d1515" : "#fef2f2"};
          color: #dc2626;
          border-color: ${d ? "#7f1d1d" : "#fca5a5"};
        }

        .nf-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          gap: 14px;
          background: ${colors.emptyBg};
          border: 1.5px solid ${colors.border};
          border-radius: 16px;
          margin-top: 16px;
        }

        .nf-empty-icon {
          width: 64px;
          height: 64px;
          background: ${colors.emptyIconBg};
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0d9488;
          margin-bottom: 6px;
        }

        .nf-empty-title {
          font-size: 18px;
          font-weight: 700;
          color: ${colors.emptyTitleColor};
          margin: 0;
        }

        .nf-empty-desc {
          font-size: 15px;
          color: ${colors.emptyDescColor};
          margin: 0;
        }
      `}</style>

      <div className="nf-page">
        <div className="nf-inner">

          {/* ── HEADER ── */}
          <div className="nf-header">
            <div>
              <h1 className="nf-title">Notifications</h1>
              <p className="nf-subtitle">
                {unreadCount > 0
                  ? <><strong>{unreadCount} unread</strong>&nbsp;&nbsp;·&nbsp;&nbsp;{notifications.length} total</>
                  : <>{notifications.length} notification{notifications.length !== 1 ? "s" : ""}</>
                }
              </p>
            </div>
            {unreadCount > 0 && (
              <button className="nf-mark-all" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          {/* ── EMPTY ── */}
          {notifications.length === 0 && (
            <div className="nf-empty">
              <div className="nf-empty-icon"><IconBell /></div>
              <p className="nf-empty-title">You're all caught up</p>
              <p className="nf-empty-desc">No new notifications at the moment</p>
            </div>
          )}

          {/* ── UNREAD GROUP ── */}
          {unreadList.length > 0 && (
            <>
              <div className="nf-section-label">Unread</div>
              <div className="nf-group">
                {unreadList.map((n) => {
                  const { sender, body } = parseSender(n.message);
                  const { Icon, bg, color, bgDark, colorDark } = getIconConfig(n.message);
                  return (
                    <div
                      key={n._id}
                      className="nf-card unread"
                      onClick={() => markAsRead(n._id)}
                    >
                      <div
                        className="nf-icon"
                        style={{ background: d ? bgDark : bg, color: d ? colorDark : color }}
                      >
                        <Icon />
                      </div>
                      <div className="nf-content">
                        <div className="nf-sender">{sender || body}</div>
                        {sender && <div className="nf-body">{body}</div>}
                      </div>
                      <div className="nf-actions">
                        <span className="nf-dot" />
                        <button
                          className="nf-delete"
                          onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                          title="Dismiss"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── READ GROUP ── */}
          {readList.length > 0 && (
            <>
              <div className="nf-section-label">Earlier</div>
              <div className="nf-group">
                {readList.map((n) => {
                  const { sender, body } = parseSender(n.message);
                  const { Icon } = getIconConfig(n.message);
                  return (
                    <div key={n._id} className="nf-card read">
                      <div
                        className="nf-icon"
                        style={{ background: d ? "#1e293b" : "#f8fafc", color: d ? "#475569" : "#94a3b8" }}
                      >
                        <Icon />
                      </div>
                      <div className="nf-content">
                        <div className="nf-sender">{sender || body}</div>
                        {sender && <div className="nf-body">{body}</div>}
                      </div>
                      <div className="nf-actions">
                        <button
                          className="nf-delete"
                          onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                          title="Dismiss"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default Notifications;