



import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import { motion, AnimatePresence } from "framer-motion";
import { User, Sparkles, BookOpen, Save, X, Camera, Zap } from "lucide-react";

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [skillsTeach, setSkillsTeach] = useState("");
  const [skillsLearn, setSkillsLearn] = useState("");

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // XP Popup state
  const [xpPopup, setXpPopup] = useState({ visible: false, amount: 0 });

  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  const showXpPopup = (xpAmount) => {
    setXpPopup({ visible: true, amount: xpAmount });
    setTimeout(() => {
      setXpPopup({ visible: false, amount: 0 });
    }, 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const newTeach = skillsTeach
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const newLearn = skillsLearn
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const mergedTeach = [
        ...new Set([...(user.skillsTeach || []).map((s) => s.name), ...newTeach]),
      ];

      const mergedLearn = [
        ...new Set([...(user.skillsLearn || []).map((s) => s.name), ...newLearn]),
      ];

      const res = await axios.put(
        "https://skill-swap-zkfd.onrender.com/api/user/update",
        {
          name,
          skillsTeach: mergedTeach,
          skillsLearn: mergedLearn,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Show XP popup only for skills you can teach (not learn)
      const totalNewSkills = newTeach.length;
      if (totalNewSkills > 0) {
        const xpEarned = totalNewSkills * 3; // +3 XP per new skill
        showXpPopup(xpEarned);
        // Also dispatch event for any external listeners
        window.dispatchEvent(
          new CustomEvent("skillswap:xp-earned", {
            detail: xpEarned,
          })
        );
      }

      setSaved(true);
      setTimeout(() => {
        setUser(res.data.user);
        navigate("/Profile");
      }, 1500);
    } catch (err) {
      console.error("Profile update failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    setSaved(false);
    navigate("/home");
  };

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-all ${
        darkMode
          ? "bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* ✅ XP POPUP — Fixed top-right, fully self-contained */}
      <AnimatePresence>
        {xpPopup.visible && (
          <motion.div
            key="xp-popup"
            initial={{ opacity: 0, y: -60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ zIndex: 9999 }}
            className="fixed top-6 right-6 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl bg-teal-500 text-white"
          >
            {/* Pulsing ring around icon */}
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-8 w-8 rounded-full bg-teal-300 opacity-40 animate-ping" />
              <Zap size={20} className="relative text-yellow-300 fill-yellow-300" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-xs font-medium opacity-80 uppercase tracking-wide">
                XP Earned
              </span>
              <span className="text-2xl font-bold tracking-tight">
                +{xpPopup.amount} XP
              </span>
            </div>

            {/* Progress bar draining over 3s */}
            <div className="absolute bottom-0 left-0 h-1 rounded-b-2xl bg-teal-300 w-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-300"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-3xl shadow-xl p-8 backdrop-blur-md border ${
            darkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col items-center text-center">

            {/* PROFILE IMAGE */}
            <div className="relative w-32 h-32 mb-4">
              {user?.profilePic || user?.avatar ? (
                <img
                  src={user?.profilePic || user?.avatar}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full border-4 border-teal-500 shadow-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-full border-4 border-teal-500 shadow-lg bg-teal-500 text-white text-3xl font-bold">
                  {name
                    ? name
                        .trim()
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "U"}
                </div>
              )}

              <div className="absolute bottom-2 right-2 bg-teal-500 p-2 rounded-full shadow-md">
                <Camera size={16} className="text-white" />
              </div>
            </div>

            <h2 className="text-xl font-semibold">{name || "Your Name"}</h2>
            <p className="text-sm opacity-70 mt-1">Update your skills & profile</p>

            <div className="w-full mt-6 space-y-4 text-left">
              <div className="flex items-center gap-3 text-sm opacity-80">
                <Sparkles size={16} /> Improve your profile visibility
              </div>
              <div className="flex items-center gap-3 text-sm opacity-80">
                <BookOpen size={16} /> Add skills you want to learn
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-2 rounded-3xl shadow-xl p-8 border ${
            darkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          <h1 className="text-2xl font-bold mb-8">Edit Profile</h1>

          <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">

            {/* NAME */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Full Name</label>

              <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all shadow-sm focus-within:shadow-md focus-within:border-teal-500 ${
                darkMode ? "bg-slate-800/60 border-slate-600" : "bg-white border-gray-300"
              }`}>
                <User size={18} className="text-teal-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(val)) setName(val);
                  }}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent outline-none text-[15px]"
                />
              </div>
            </div>

            {/* SKILLS TO TEACH */}
            <div>
              <label className="text-sm font-medium mb-2 block">Skills You Can Teach</label>

              <div className={`p-5 rounded-2xl border transition-all shadow-sm focus-within:shadow-md focus-within:border-teal-500 ${
                darkMode ? "bg-slate-800/60 border-slate-600" : "bg-white border-gray-300"
              }`}>
                <input
                  type="text"
                  value={skillsTeach}
                  onChange={(e) => setSkillsTeach(e.target.value)}
                  placeholder="React, Java, UI Design"
                  className="w-full bg-transparent outline-none text-[15px]"
                />
                <p className="text-xs opacity-60 mt-2">Separate skills using commas</p>
              </div>
            </div>

            {/* SKILLS TO LEARN */}
            <div>
              <label className="text-sm font-medium mb-2 block">Skills You Want to Learn</label>

              <div className={`p-5 rounded-2xl border transition-all shadow-sm focus-within:shadow-md focus-within:border-teal-500 ${
                darkMode ? "bg-slate-800/60 border-slate-600" : "bg-white border-gray-300"
              }`}>
                <input
                  type="text"
                  value={skillsLearn}
                  onChange={(e) => setSkillsLearn(e.target.value)}
                  placeholder="AI, DevOps, Python"
                  className="w-full bg-transparent outline-none text-[15px]"
                />
                <p className="text-xs opacity-60 mt-2">Separate skills using commas</p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="md:col-span-2 flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition ${
                  darkMode
                    ? "border-gray-600 text-gray-300 hover:bg-slate-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <X size={18} /> Cancel
              </button>

              <button
                type="submit"
                disabled={loading || saved}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white shadow-md transition-all ${
                  loading || saved
                    ? "bg-gray-400"
                    : "bg-teal-500 hover:bg-teal-600"
                }`}
              >
                <Save size={18} />
                {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* SUCCESS MODAL */}
      {saved && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40" style={{ zIndex: 9998 }}>
          <div
            className={`p-6 rounded-2xl shadow-xl text-center ${
              darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <p className="text-lg font-semibold mb-4 text-green-500">
              Profile Saved Successfully!
            </p>

            <button
              onClick={handleOk}
              className="px-6 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;