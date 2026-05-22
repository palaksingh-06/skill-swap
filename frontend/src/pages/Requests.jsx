import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import { motion, AnimatePresence } from "framer-motion";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  const isFromPending = location.hash === "#pending";

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash === "pending") setActiveFilter("pending");
    else if (hash === "accepted") setActiveFilter("accepted");
    else if (hash === "rejected") setActiveFilter("rejected");
    else setActiveFilter("all");
  }, [location.hash]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      const res = await axios.get(
        "https://skill-swap-zkfd.onrender.com/api/requests/incoming",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://skill-swap-zkfd.onrender.com/api/requests/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error("Failed to update request", err);
    }
  };

  const createSession = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://skill-swap-zkfd.onrender.com/api/sessions/create-from-request",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/sessions");
    } catch (err) {
      console.error("Failed to create session", err);
    }
  };

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const filteredRequests =
    activeFilter === "all"
      ? requests
      : requests.filter((r) => r.status === activeFilter);

  const cardAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.4 },
    }),
  };

  const statusStyle = {
    pending: { bg: "#fff7ed", color: "#f59e0b" },
    accepted: { bg: "#ecfdf5", color: "#10b981" },
    rejected: { bg: "#fef2f2", color: "#ef4444" },
  };

  return (
    <div
      className="min-h-screen px-10 py-10"
      style={{
        background: darkMode ? "#0b1220" : "#f3f7fb",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 style={{ fontSize: 40, fontWeight: 800 }}>
          <span style={{ color: darkMode ? "#e5e7eb" : "#0f172a" }}>
            Skill
          </span>{" "}
          <span style={{ color: "#14b8a6" }}>Requests</span>
        </h1>
        <p style={{ color: darkMode ? "#94a3b8" : "#64748b", marginTop: 6 }}>
          Manage your incoming skill exchange requests easily
        </p>
      </motion.div>

      {!isFromPending && (
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { key: "pending", label: "Pending" },
            { key: "accepted", label: "Accepted" },
            { key: "rejected", label: "Rejected" },
          ].map((item, i) => (
            <motion.div
              key={item.key}
              custom={i}
              variants={cardAnimation}
              initial="hidden"
              animate="visible"
              onClick={() => {
                setActiveFilter(item.key);
                navigate(`/requests#${item.key}`);
              }}
              style={{
                background: darkMode ? "#111827" : "#ffffff",
                borderRadius: 20,
                padding: 24,
                cursor: "pointer",
                border: darkMode ? "1px solid #1f2937" : "1px solid #e5e7eb",
                boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  color: "#14b8a6",
                }}
              >
                {counts[item.key]}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: darkMode ? "#94a3b8" : "#64748b",
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* REQUEST LIST */}
      <div className="flex flex-col gap-6">
        {filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: darkMode ? "#111827" : "#ffffff",
              borderRadius: 22,
              padding: 40,
              textAlign: "center",
              border: darkMode ? "1px solid #1f2937" : "1px solid #e5e7eb",
              boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: darkMode ? "#e5e7eb" : "#0f172a",
                marginBottom: 6,
              }}
            >
              {activeFilter === "pending"
                ? "No pending requests"
                : activeFilter === "accepted"
                ? "No accepted requests"
                : activeFilter === "rejected"
                ? "No rejected requests"
                : "No requests yet"}
            </div>

            <p style={{ color: darkMode ? "#94a3b8" : "#64748b", fontSize: 14 }}>
              {activeFilter === "pending"
                ? " "
                : "Once someone sends you a skill request, it will appear here."}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredRequests.map((req, i) => {
              const isReceiver = req.toUser === user?._id;
              const sc = statusStyle[req.status];

              return (
                <motion.div
                  key={req._id}
                  custom={i}
                  variants={cardAnimation}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    background: darkMode ? "#111827" : "#ffffff",
                    borderRadius: 22,
                    padding: 26,
                    border: darkMode ? "1px solid #1f2937" : "1px solid #e5e7eb",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: darkMode ? "#e5e7eb" : "#0f172a",
                        }}
                      >
                        {req.skill}
                      </div>

                      <div
                        style={{
                          color: darkMode ? "#94a3b8" : "#64748b",
                          marginTop: 6,
                          fontSize: 14,
                        }}
                      >
                        With {req.fromUser?.name}
                      </div>
                    </div>

                    <div
                      style={{
                        background: sc.bg,
                        color: sc.color,
                        padding: "6px 14px",
                        borderRadius: 50,
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {req.status}
                    </div>
                  </div>

                  {/* PENDING BUTTONS */}
                  {req.status === "pending" && isReceiver && (
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => updateStatus(req._id, "accepted")}
                        style={{
                          background: "#ecfdf5",
                          color: "#10b981",
                          padding: "10px 18px",
                          borderRadius: 12,
                          fontWeight: 600,
                          fontSize: 14,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => updateStatus(req._id, "rejected")}
                        style={{
                          background: "#fef2f2",
                          color: "#ef4444",
                          padding: "10px 18px",
                          borderRadius: 12,
                          fontWeight: 600,
                          fontSize: 14,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {/* CREATE SESSION (TEAL GREEN) */}
                  {req.status === "accepted" && (
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => createSession(req._id)}
                        style={{
                          background: "#14b8a6",
                          color: "#fff",
                          padding: "10px 20px",
                          borderRadius: 12,
                          fontWeight: 600,
                          fontSize: 14,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Create Session
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Requests;