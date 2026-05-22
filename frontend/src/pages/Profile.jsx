// import { LayoutDashboard, Sparkles, MessageCircle, CalendarDays } from "lucide-react";
// import { useContext, useState } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import axios from "axios";
// import { DarkModeContext } from "../context/DarkModeContext";
// import { motion, AnimatePresence } from "framer-motion";
// import ReviewsSection from "../components/ReviewsSection";
// const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// const Profile = () => {
//   const { user, setUser } = useContext(AuthContext);
//   const { darkMode } = useContext(DarkModeContext);
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState(null);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("profile"); // "profile" | "reviews" | "availability"

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       setUploadError("Please select a valid image file.");
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       setUploadError("Image must be smaller than 5MB.");
//       return;
//     }

//     setUploadError(null);
//     setUploading(true);

//     const previewUrl = URL.createObjectURL(file);
//     setUser((prev) => ({ ...prev, avatar: previewUrl }));

//     try {
//       const formData = new FormData();
//       formData.append("avatar", file);
//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         "http://localhost:5000/api/user/upload-avatar",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
//     } catch (err) {
//       console.error("Avatar upload failed", err);
//       setUploadError("Upload failed. Please try again.");
//       setUser((prev) => ({ ...prev, avatar: user?.avatar || null }));
//     } finally {
//       setUploading(false);
//     }
//   };

//   const avatarSrc = user?.avatar
//     ? user.avatar
//     : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=0d9488&color=fff&size=128`;

//   if (!user) {
//     return (
//       <p className={`p-6 ${darkMode ? "text-white" : "text-slate-900"}`}>
//         Loading profile...
//       </p>
//     );
//   }

//   return (
//     <>
//       {/* Lightbox */}
//       <AnimatePresence>
//         {lightboxOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setLightboxOpen(false)}
//             className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center cursor-zoom-out"
//           >
//             <motion.img
//               initial={{ scale: 0.85, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.85, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               src={avatarSrc}
//               alt="Profile preview"
//               className="max-w-[80vw] max-h-[80vh] rounded-2xl shadow-2xl object-contain"
//               onClick={(e) => e.stopPropagation()}
//             />
//             <button
//               onClick={() => setLightboxOpen(false)}
//               className="absolute top-6 right-8 text-white text-3xl bg-white/10 hover:bg-white/20 rounded-full w-11 h-11 flex items-center justify-center transition"
//             >
//               ✕
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className={`min-h-screen ${
//           darkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"
//         }`}
//       >
//         <main className="max-w-6xl mx-auto px-6 py-16">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.97 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.4 }}
//             className={`rounded-3xl shadow-lg grid md:grid-cols-3 overflow-hidden ${
//               darkMode ? "bg-slate-800" : "bg-white"
//             }`}
//           >
//             {/* LEFT PANEL */}
//             <motion.div
//               initial={{ x: -40, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.4 }}
//               className="bg-gradient-to-br from-teal-400 to-cyan-500 p-10 text-white flex flex-col items-center text-center"
//             >
//               {/* Avatar */}
//               <div className="relative mb-4">
//                 <div
//                   className="w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-lg cursor-pointer"
//                   onClick={() => setLightboxOpen(true)}
//                   title="Click to view photo"
//                 >
//                   <img
//                     src={avatarSrc}
//                     alt="profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 {/* Camera badge */}
//                 <label
//                   htmlFor="avatar-upload"
//                   className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-teal-400 flex items-center justify-center cursor-pointer shadow hover:scale-110 transition-transform"
//                   title="Change photo"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   {uploading ? (
//                     <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="w-4 h-4 text-teal-600"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                     </svg>
//                   )}
//                 </label>

//                 <input
//                   id="avatar-upload"
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleImageUpload}
//                   disabled={uploading}
//                 />
//               </div>

//               {uploadError && (
//                 <p className="text-xs text-red-200 bg-red-500/30 px-3 py-1 rounded-full mb-3">
//                   {uploadError}
//                 </p>
//               )}

//               <h2 className="text-xl font-semibold uppercase">{user.name}</h2>
//               <p className="text-sm opacity-90">{user.email}</p>

//               {/* Average rating badge */}
//               {user.averageRating && (
//                 <div className="mt-3 flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
//                   <span className="text-yellow-300 text-sm">★</span>
//                   <span className="text-white text-sm font-semibold">
//                     {user.averageRating}
//                   </span>
//                   <span className="text-white/70 text-xs">
//                     ({user.totalReviews} review{user.totalReviews !== 1 ? "s" : ""})
//                   </span>
//                 </div>
//               )}

//               {/* XP badge */}
//               {user.xp > 0 && (
//                 <div className="mt-2 flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
//                   <span className="text-yellow-300 text-sm">⚡</span>
//                   <span className="text-white text-sm font-semibold">{user.xp} XP</span>
//                 </div>
//               )}
// <div className="mt-6 flex flex-col gap-3 w-full items-center">

//   {/* Primary Button */}
//   <Link
//     to="/edit-profile"
//     className="px-6 py-2 w-48 rounded-full bg-white text-teal-600 font-medium text-sm shadow-md hover:scale-105 transition"
//   >
//     Edit Profile
//   </Link>

//   {/* Secondary Button */}
//   <Link
//     to="/edit-public-profile"
//     className="px-6 py-2 w-48 rounded-full border bg-white text-teal-600 font-medium text-sm shadow-md hover:scale-105 transition"
//   >
//     Edit Public Profile
//   </Link>

// </div>

//               <p className="text-sm opacity-90 mt-12">
//                 Welcome to SkillSwap!
//                 <br />
//                 Complete your profile to start swapping skills.
//               </p>
//             </motion.div>

//             {/* RIGHT PANEL */}
//             <motion.div
//               initial={{ x: 40, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.4 }}
//               className="md:col-span-2 p-12"
//             >
//               <h1 className="text-3xl font-bold mb-2">My Profile</h1>
//               <div className="w-12 h-1 bg-teal-500 rounded-full mb-6" />

//               {/* ── Tabs ── */}
//               <div className="flex gap-1 mb-8 bg-slate-100 dark:bg-slate-700 rounded-xl p-1 w-fit">
//                 {[
//                   { key: "profile", label: "Overview" },
//                   { key: "reviews", label: `Reviews${user.totalReviews > 0 ? ` (${user.totalReviews})` : ""}` },
//                   { key: "availability", label: "Availability" },
//                 ].map((tab) => (
//                   <button
//                     key={tab.key}
//                     onClick={() => setActiveTab(tab.key)}
//                     className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
//                       activeTab === tab.key
//                         ? "bg-white shadow text-teal-600"
//                         : darkMode
//                         ? "text-slate-300 hover:text-white"
//                         : "text-slate-500 hover:text-slate-700"
//                     }`}
//                   >
//                     {tab.label}
//                   </button>
//                 ))}
//               </div>

//               {/* ── Tab content ── */}
//               <AnimatePresence mode="wait">
//                 {activeTab === "profile" ? (
//                   <motion.div
//                     key="profile"
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -8 }}
//                     transition={{ duration: 0.2 }}
//                     className="space-y-6"
//                   >
//                    <ProfileItem title="Dashboard" icon={<LayoutDashboard size={20} />} link="/dashboard" darkMode={darkMode} />
// <ProfileItem title="Skills"    icon={<Sparkles size={20} />}        link="/skills"    darkMode={darkMode} />
// <ProfileItem title="Messages"  icon={<MessageCircle size={20} />}   link="/messages"  darkMode={darkMode} />
//                   </motion.div>
//                 ) : activeTab === "reviews" ? (
//                   <motion.div
//                     key="reviews"
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -8 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <ReviewsSection userId={user._id} />
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     key="availability"
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -8 }}
//                     transition={{ duration: 0.2 }}
//                     className="space-y-4"
//                   >
// <h2 className="text-lg font-semibold">Available Days</h2>

// {user.availability && user.availability.length > 0 ? (
//   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//     {user.availability
//       .slice()
//       .sort((a, b) => weekdays.indexOf(a) - weekdays.indexOf(b))
//       .map((day, idx) => (
//         <div
//           key={idx}
//           className={`
//             flex items-center gap-3 px-5 py-4 rounded-2xl backdrop-blur-md
//             border border-white/10 transition-all
//             ${
//               darkMode
//                 ? "bg-white/5 hover:bg-white/10"
//                 : "bg-white shadow hover:shadow-md"
//             }
//           `}
//         >
//           <CalendarDays size={18} className="text-teal-500" />
//           <span className="font-medium">{day}</span>
//         </div>
//       ))}
//   </div>
// ) : (
//   <p className="text-slate-500">No availability set.</p>
// )}
                   
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           </motion.div>
//         </main>
//       </motion.div>
//     </>
//   );
// };

// const ProfileItem = ({ title, icon, link, darkMode }) => (
//   <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
//     <Link
//       to={link}
//       className={`
//         flex items-center justify-between rounded-2xl px-6 py-5 transition-all backdrop-blur-lg
//         border border-white/10
//         ${darkMode 
//           ? "bg-white/5 hover:bg-white/10 text-white shadow-lg" 
//           : "bg-white/60 hover:bg-white/80 text-slate-800 shadow-md"}
//       `}
//     >
//       <div className="flex items-center gap-4">
//         <div
//           className={`
//             w-10 h-10 rounded-xl flex items-center justify-center
//             ${darkMode ? "bg-white/10" : "bg-white shadow"}
//           `}
//         >
//           {icon}
//         </div>
//         <span className="font-medium">{title}</span>
//       </div>

//       <span className="text-slate-400 text-xl">›</span>
//     </Link>
//   </motion.div>
// );

// export default Profile;

import { LayoutDashboard, Sparkles, MessageCircle, CalendarDays, Star, Zap, ChevronRight, Camera, Edit, Users, Mail } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { DarkModeContext } from "../context/DarkModeContext";
import { motion, AnimatePresence } from "framer-motion";
import ReviewsSection from "../components/ReviewsSection";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { darkMode }      = useContext(DarkModeContext);
  const [uploading, setUploading]       = useState(false);
  const [uploadError, setUploadError]   = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab]       = useState("overview");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError("Please select a valid image file."); return; }
    if (file.size > 5 * 1024 * 1024)    { setUploadError("Image must be smaller than 5MB.");   return; }
    setUploadError(null);
    setUploading(true);
    setUser((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const token = localStorage.getItem("token");
      const res = await axios.post("https://skill-swap-zkfd.onrender.com/api/user/upload-avatar", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
    } catch {
      setUploadError("Upload failed. Please try again.");
      setUser((prev) => ({ ...prev, avatar: user?.avatar || null }));
    } finally {
      setUploading(false);
    }
  };

  const avatarSrc = user?.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=0d9488&color=fff&size=200`;

  if (!user) return <p style={{ padding: 32, color: "#94a3b8", fontFamily: "system-ui" }}>Loading profile…</p>;

  const dm = darkMode;

  const bg      = dm ? "#0e1118" : "#f0f4f8";
  const card    = dm ? "#161c28" : "#ffffff";
  const border  = dm ? "#222a3a" : "#e2e8f0";
  const text1   = dm ? "#e6ecf5" : "#0f172a";
  const text2   = dm ? "#7a8aa0" : "#64748b";
  const accent  = "#0d9488";
  const accentL = dm ? "rgba(13,148,136,0.15)" : "rgba(13,148,136,0.09)";

  const sidebarBg = dm
    ? "linear-gradient(180deg, #0d9488 0%, #0a8077 38%, #087068 70%, #065f57 100%)"
    : "linear-gradient(180deg, #0a9688 0%, #0d9488 40%, #0f766e 75%, #115e59 100%)";

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] },
  });

  const tabs = [
    { key: "overview",     label: "Overview"    },
    { key: "reviews",      label: `Reviews${user.totalReviews > 0 ? ` (${user.totalReviews})` : ""}` },
    { key: "availability", label: "Availability" },
  ];

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={28} />, link: "/dashboard", desc: "View your activity overview" },
    { label: "Skills",    icon: <Sparkles size={28} />,        link: "/skills",    desc: "Manage your listed skills"   },
    { label: "Messages",  icon: <MessageCircle size={28} />,   link: "/messages",  desc: "Check your conversations"    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');

        html, body, #root { height: 100%; min-height: 100vh; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .profile-layout {
          display: flex;
          min-height: 100vh;
          height: 100%;
          background: ${bg};
          font-family: 'DM Sans', system-ui, sans-serif;
          color: ${text1};
        }

        /* ══ SIDEBAR — 52vw ══ */
        .profile-sidebar {
          width: 52vw;
          min-width: 360px;
          max-width: 560px;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          background: ${sidebarBg};
          border-right: 1.5px solid rgba(255,255,255,0.12);
          scrollbar-width: none;
        }
        .profile-sidebar::-webkit-scrollbar { display: none; }

        /* blobs */
        .sb-blob { position: absolute; border-radius: 50%; pointer-events: none; }
        .sb-blob-1 { top: -70px; right: -70px; width: 220px; height: 220px; background: rgba(255,255,255,0.08); }
        .sb-blob-2 { bottom: 10px; left: -90px; width: 240px; height: 240px; background: rgba(255,255,255,0.05); }
        .sb-blob-3 { top: 44%; left: 50%; transform: translate(-50%,-50%); width: 280px; height: 280px; background: rgba(255,255,255,0.03); }

        .sidebar-inner {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center;
          padding: 44px 28px 36px;
          height: 100%;
        }

        /* avatar */
        .avatar-wrap { position: relative; margin-bottom: 22px; }
        .avatar-ring {
          width: 110px; height: 110px; border-radius: 50%; overflow: hidden;
          border: 4px solid rgba(255,255,255,0.40);
          box-shadow: 0 0 0 7px rgba(255,255,255,0.10), 0 12px 36px rgba(0,0,0,0.28);
          cursor: pointer; transition: transform 0.2s;
        }
        .avatar-ring:hover { transform: scale(1.05); }
        .avatar-ring img { width: 100%; height: 100%; object-fit: cover; }
        .camera-btn {
          position: absolute; bottom: 2px; right: 2px;
          width: 32px; height: 32px; border-radius: 50%;
          background: #fff; border: 2.5px solid ${accent};
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: ${accent};
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          transition: transform 0.15s;
        }
        .camera-btn:hover { transform: scale(1.12); }

        /* text */
        .sb-name {
          font-size: 26px; font-weight: 900; color: #fff;
          letter-spacing: -0.6px; text-align: center;
          margin-bottom: 6px; line-height: 1.15;
        }
        .sb-email {
          font-size: 13.5px; color: rgba(255,255,255,0.72);
          font-weight: 500; text-align: center;
          margin-bottom: 22px; word-break: break-all; line-height: 1.5;
        }

        /* chips */
        .chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 18px; }
        .chip {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.16);
          border: 1.5px solid rgba(255,255,255,0.28);
          border-radius: 22px; padding: 8px 16px;
          font-size: 14px; font-weight: 800; color: #fff;
          backdrop-filter: blur(4px);
        }

        /* stars */
        .stars { display: flex; align-items: center; gap: 5px; margin-bottom: 24px; }
        .stars-val { font-size: 18px; font-weight: 900; color: #fff; margin-left: 4px; }
        .stars-cnt { font-size: 14px; color: rgba(255,255,255,0.65); font-weight: 600; }

        .sb-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.17); margin-bottom: 22px; }

        /* sidebar buttons */
        .sb-btn {
          width: 100%;
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.13);
          border: 1.5px solid rgba(255,255,255,0.24);
          border-radius: 14px; padding: 16px 18px;
          color: #fff; font-size: 16px; font-weight: 700;
          text-decoration: none; cursor: pointer; margin-bottom: 10px;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .sb-btn:hover {
          background: rgba(255,255,255,0.24);
          border-color: rgba(255,255,255,0.44);
          transform: translateX(3px);
        }
        .sb-btn-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        /* footer */
        .sb-footer { margin-top: auto; width: 100%; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.15); }
        .sb-footer-lbl {
          font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.5);
          text-transform: uppercase; letter-spacing: 1.6px; margin-bottom: 8px;
        }
        .sb-footer-email { font-size: 13px; color: rgba(255,255,255,0.82); font-weight: 600; word-break: break-all; line-height: 1.5; }

        .sb-error {
          font-size: 13px; font-weight: 600; color: #fca5a5;
          background: rgba(239,68,68,0.18); border-radius: 10px;
          padding: 9px 14px; width: 100%; margin-bottom: 14px; text-align: center;
        }

        /* ══ MAIN ══ */
        .profile-main {
          flex: 1; min-width: 0;
          padding: 52px 72px 90px;
          display: flex; flex-direction: column; gap: 28px;
        }

        .page-title {
          font-size: 50px; font-weight: 900;
          color: ${text1}; letter-spacing: -1.8px;
          margin-bottom: 8px; line-height: 1.05;
        }
        .page-title span { color: ${accent}; }
        .page-sub { font-size: 20px; color: ${text2}; font-weight: 500; line-height: 1.5; }

        /* stats */
        .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .stat-card {
          background: ${card}; border: 1.5px solid ${border};
          border-radius: 20px; padding: 30px 28px;
          display: flex; flex-direction: column; gap: 8px;
          box-shadow: 0 1px 6px rgba(15,23,42,0.05);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(13,148,136,0.13); }
        .stat-lbl { font-size: 13px; font-weight: 800; color: ${text2}; text-transform: uppercase; letter-spacing: 1.5px; }
        .stat-val { font-size: 56px; font-weight: 900; color: ${accent}; letter-spacing: -2.5px; line-height: 1; }
        .stat-sub { font-size: 17px; color: ${text2}; font-weight: 600; line-height: 1.4; }

        /* tabs */
        .tabs-box {
          background: ${card}; border: 1.5px solid ${border};
          border-radius: 22px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(15,23,42,0.07);
        }
        .tabs-bar {
          display: flex; border-bottom: 1.5px solid ${border};
          background: ${dm ? "#131920" : "#f8fafb"};
          padding: 0 12px; gap: 4px;
        }
        .tab-btn {
          padding: 18px 28px; font-size: 15px; font-weight: 800;
          cursor: pointer; background: none; border: none;
          border-bottom: 3px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .tab-btn.active { color: ${accent}; border-bottom-color: ${accent}; }
        .tab-btn:not(.active) { color: ${text2}; }
        .tab-btn:not(.active):hover { color: ${text1}; }

        /* nav items */
        .nav-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 38px; border-bottom: 1.5px solid ${border};
          cursor: pointer; transition: background 0.15s; text-decoration: none;
        }
        .nav-item:last-child { border-bottom: none; }
        .nav-item:hover { background: ${dm ? "#1a2332" : "#f8fffe"}; }
        .nav-item-left { display: flex; align-items: center; gap: 18px; }
        .nav-icon {
          width: 52px; height: 52px; border-radius: 15px;
          background: ${accentL};
          display: flex; align-items: center; justify-content: center;
          color: ${accent}; flex-shrink: 0;
        }
        .nav-lbl { font-size: 18px; font-weight: 900; color: ${text1}; letter-spacing: -0.3px; margin-bottom: 4px; }
        .nav-desc { font-size: 14px; color: ${text2}; font-weight: 500; line-height: 1.4; }

        /* availability */
        .avail-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; padding: 28px 38px; }
        .avail-day {
          display: flex; align-items: center; gap: 12px;
          background: ${accentL}; border: 1.5px solid ${accent}40;
          border-radius: 14px; padding: 18px 22px;
        }
        .avail-day-lbl { font-size: 16px; font-weight: 700; color: ${text1}; }

        .reviews-wrap { padding: 32px 38px; }
        .section-lbl { font-size: 13px; font-weight: 800; color: ${text2}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .profile-sidebar { width: 48vw; min-width: 300px; }
          .profile-main { padding: 36px 48px 70px; }
          .page-title { font-size: 38px; }
          .stat-val { font-size: 44px; }
        }
        @media (max-width: 768px) {
          .profile-layout { flex-direction: column; }
          .profile-sidebar { width: 100%; min-width: unset; max-width: unset; height: auto; position: relative; }
          .profile-main { padding: 28px 24px 60px; }
          .stats-row { grid-template-columns: 1fr 1fr; }
          .avail-grid { grid-template-columns: repeat(2,1fr); }
          .page-title { font-size: 30px; }
          .stat-val { font-size: 36px; }
        }
      `}</style>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
            <motion.img initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }} transition={{ duration: 0.25 }}
              src={avatarSrc} alt="avatar"
              style={{ maxWidth: "72vw", maxHeight: "72vh", borderRadius: 20, objectFit: "contain", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
              onClick={e => e.stopPropagation()} />
            <button onClick={() => setLightboxOpen(false)}
              style={{ position: "absolute", top: 24, right: 28, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: 48, height: 48, borderRadius: "50%", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="profile-layout">

        {/* ══ SIDEBAR ══ */}
        <aside className="profile-sidebar">
          <div className="sb-blob sb-blob-1" />
          <div className="sb-blob sb-blob-2" />
          <div className="sb-blob sb-blob-3" />

          <div className="sidebar-inner">

            <div className="avatar-wrap">
              <div className="avatar-ring" onClick={() => setLightboxOpen(true)}>
                <img src={avatarSrc} alt={user.name} />
              </div>
              <label htmlFor="avatar-upload" className="camera-btn" onClick={e => e.stopPropagation()}>
                {uploading
                  ? <div style={{ width: 13, height: 13, border: `2.5px solid ${accent}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  : <Camera size={15} />}
              </label>
              <input id="avatar-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} disabled={uploading} />
            </div>

            <h2 className="sb-name">{user.name}</h2>
            <p className="sb-email">{user.email}</p>

            <div className="chips">
              {user.xp > 0 && (
                <div className="chip"><Zap size={15} color="#fde68a" /><span>{user.xp} XP</span></div>
              )}
              {user.totalReviews > 0 && (
                <div className="chip"><Star size={15} color="#fde68a" fill="#fde68a" /><span>{user.averageRating} · {user.totalReviews} reviews</span></div>
              )}
            </div>

            {user.averageRating && (
              <div className="stars">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} size={20} fill={n <= Math.round(user.averageRating) ? "#fbbf24" : "none"} color="#fbbf24" />
                ))}
                <span className="stars-val">{user.averageRating}</span>
                <span className="stars-cnt">({user.totalReviews})</span>
              </div>
            )}

            <div className="sb-divider" />

            {uploadError && <p className="sb-error">{uploadError}</p>}

            <Link to="/edit-profile" className="sb-btn">
              <div className="sb-btn-icon"><Edit size={17} /></div>
              Edit Profile
              <ChevronRight size={17} style={{ marginLeft: "auto", opacity: 0.6 }} />
            </Link>
            <Link to="/edit-public-profile" className="sb-btn">
              <div className="sb-btn-icon"><Users size={17} /></div>
              Edit Public Profile
              <ChevronRight size={17} style={{ marginLeft: "auto", opacity: 0.6 }} />
            </Link>

            <div className="sb-footer">
              <p className="sb-footer-lbl">Account</p>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Mail size={14} color="rgba(255,255,255,0.55)" />
                <p className="sb-footer-email">{user.email}</p>
              </div>
            </div>

          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main className="profile-main">

          <motion.div {...fadeUp(0)}>
            <h1 className="page-title">My <span>Profile</span></h1>
            <p className="page-sub">Manage your skills, reviews and availability</p>
          </motion.div>

          

          <motion.div {...fadeUp(0.1)} className="tabs-box">
            <div className="tabs-bar">
              {tabs.map((tab) => (
                <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}>
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">

              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {navItems.map((item, i) => (
                    <Link key={i} to={item.link} className="nav-item">
                      <div className="nav-item-left">
                        <div className="nav-icon">{item.icon}</div>
                        <div>
                          <p className="nav-lbl">{item.label}</p>
                          <p className="nav-desc">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={22} color={text2} />
                    </Link>
                  ))}
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div key="reviews" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  className="reviews-wrap">
                  <ReviewsSection userId={user._id} />
                </motion.div>
              )}

              {activeTab === "availability" && (
                <motion.div key="availability" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <div style={{ padding: "28px 38px 16px" }}>
                    <p className="section-lbl">Available Days</p>
                  </div>
                  {user.availability && user.availability.length > 0 ? (
                    <div className="avail-grid" style={{ paddingTop: 0 }}>
                      {user.availability
                        .slice()
                        .sort((a, b) => weekdays.indexOf(a) - weekdays.indexOf(b))
                        .map((day, idx) => (
                          <div key={idx} className="avail-day">
                            <CalendarDays size={22} color={accent} />
                            <span className="avail-day-lbl">{day}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p style={{ padding: "0 38px 28px", fontSize: 18, color: text2, fontWeight: 500 }}>No availability set yet.</p>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>

        </main>
      </div>
    </>
  );
};

export default Profile;