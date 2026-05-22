// export default Navbar;
// import { IoNotificationsOutline } from "react-icons/io5";
// import { HiOutlineCog6Tooth } from "react-icons/hi2";
// import { Link, useNavigate } from "react-router-dom";
// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { DarkModeContext } from "../context/DarkModeContext";
// import MoonIcon from "../assets/imageofmoon.png";
// import SunIcon from "../assets/imageofsun.png";
// import AIChat from "../pages/AIChat";
// import socket from "../socket";

// /* NEW ICONS */
// import { FiSettings, FiBell } from "react-icons/fi";

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
//   const navigate = useNavigate();

//   const [notifications, setNotifications] = useState([]);
//   const [showChat, setShowChat] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   const token = localStorage.getItem("token");

//   /* ---------------- LOAD NOTIFICATIONS ---------------- */
//   useEffect(() => {
//     if (!user || !token) return;

//     socket.emit("join", user._id);

//     const fetchNotifications = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/notifications", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setNotifications(data);
//         }
//       } catch (err) {
//         console.error("Failed to load notifications:", err);
//       }
//     };

//     fetchNotifications();

//     socket.on("notification", (data) => {
//       setNotifications((prev) => [data, ...prev]);
//     });

//     return () => {
//       socket.off("notification");
//     };
//   }, [user, token]);

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   return (
//     <>
//       <nav
//         className={`w-full px-10 py-4 flex items-center justify-between shadow-md transition-colors ${
//           darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800"
//         }`}
//       >
//         {/* LOGO */}
//         <Link to="/" className="flex items-center gap-2">
//           <span className="text-3xl font-extrabold text-teal-500">S</span>
//           <span className="text-2xl font-extrabold tracking-wide">
//             SkillSwap
//           </span>
//         </Link>

//         {/* RIGHT SIDE */}
//         <div className="flex items-center gap-6 text-sm font-semibold relative">

//           {/* DARK MODE TOGGLE */}
//           <button
//             onClick={toggleDarkMode}
//             className="w-8 h-8 rounded-full overflow-hidden"
//           >
//             <img
//               src={darkMode ? SunIcon : MoonIcon}
//               alt="Toggle Dark Mode"
//               className="w-full h-full object-contain"
//             />
//           </button>

//           {/* BROWSE SKILLS */}
//           <Link
//             to={user ? "/search" : "/login"}
//             className="hover:text-teal-600 transition"
//           >
//             Browse Skills
//           </Link>

//           {/* SKILL MATCHES */}
//           {user && (
//             <Link
//               to="/matches"
//               className="hover:text-teal-600 transition"
//             >
//               Skill Matches
//             </Link>
//           )}

//           {/* LEADERBOARD (trophy removed) */}
//           {user && (
//             <Link
//               to="/leaderboard"
//               className="hover:text-teal-600 transition"
//             >
//               Leaderboard
//             </Link>
//           )}

//           {user && (
//             <>
//               {/* PROFILE */}
//               <Link
//                 to="/profile"
//                 className="hover:text-teal-600 transition"
//               >
//                 Profile
//               </Link>

//              {/* SETTINGS ICON */}
// <Link
//   to="/settings"
//   className={`text-xl transition ${
//     darkMode
//       ? "text-slate-300 hover:text-teal-400"
//       : "text-slate-600 hover:text-teal-500"
//   }`}
// >
//   <HiOutlineCog6Tooth />
// </Link>

// {/* NOTIFICATION BELL */}
// <div className="relative">
//   <button
//     onClick={() => setShowNotifications(!showNotifications)}
//     className={`text-xl transition ${
//       darkMode
//         ? "text-slate-300 hover:text-teal-400"
//         : "text-slate-600 hover:text-teal-500"
//     }`}
//   >
//     <IoNotificationsOutline />

//     {unreadCount > 0 && (
//       <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs px-1 rounded-full">
//         {unreadCount}
//       </span>
//     )}
//   </button>

//   {/* DROPDOWN */}
//   {showNotifications && (
//     <div
//       className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl p-4 z-50 ${
//         darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"
//       }`}
//     >
//       <p className="font-semibold mb-3">Notifications</p>

//       {notifications.length === 0 ? (
//         <p className="text-sm text-slate-400">No notifications yet</p>
//       ) : (
//         notifications.slice(0, 5).map((n) => (
//           <div
//             key={n._id}
//             onClick={() => markAsRead(n._id)}
//             className={`p-3 rounded-xl mb-2 cursor-pointer transition ${
//               darkMode
//                 ? "hover:bg-slate-700"
//                 : "hover:bg-slate-100"
//             } ${!n.read ? "bg-teal-500/10" : ""}`}
//           >
//             <p className="text-sm">{n.message}</p>
//           </div>
//         ))
//       )}

//       <Link
//         to="/notifications"
//         onClick={() => setShowNotifications(false)}
//         className="block text-center text-teal-500 mt-3 text-sm hover:underline"
//       >
//         View All Notifications
//       </Link>
//     </div>
//   )}
// </div>

//               {/* SKILL BUDDY BUTTON */}
//               <button
//                 onClick={() => setShowChat(!showChat)}
//                 className="bg-teal-500 text-white px-3 py-2 rounded-full hover:bg-teal-600 transition"
//               >
//                 Skill Buddy
//               </button>

//               {/* LOGOUT */}
//               <button
//   onClick={() => {
//     logout();
//     navigate("/");
//   }}
//   className={`px-5 py-2 rounded-xl border font-semibold transition ${
//     darkMode
//       ? "border-teal-400 text-teal-300 hover:bg-teal-500/10"
//       : "border-teal-500 text-teal-600 hover:bg-teal-50"
//   }`}
// >
//   Logout
// </button>
//             </>
//           )}

//           {!user && (
//             <Link
//               to="/login"
//               className={`px-4 py-2 border rounded-lg transition ${
//                 darkMode
//                   ? "border-white text-white hover:bg-white/20"
//                   : "border-gray-300 text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               Login
//             </Link>
//           )}
//         </div>
//       </nav>

//       {/* AI CHAT WINDOW */}
//       {showChat && (
//         <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] rounded-2xl shadow-2xl overflow-hidden">
//           <AIChat />
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;



// import { IoNotificationsOutline } from "react-icons/io5";
// import { HiOutlineCog6Tooth } from "react-icons/hi2";
// import { Link, useNavigate } from "react-router-dom";
// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { DarkModeContext } from "../context/DarkModeContext";
// import MoonIcon from "../assets/imageofmoon.png";
// import SunIcon from "../assets/imageofsun.png";
// import AIChat from "../pages/AIChat";
// import socket from "../socket";
// import { useNotifications } from "../context/NotificationContext"; // ✅ NEW

// /* NEW ICONS */
// import { FiSettings, FiBell } from "react-icons/fi";

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
//   const { unreadCount, clearUnread } = useNotifications(); // ✅ NEW
//   const navigate = useNavigate();

//   const [notifications, setNotifications] = useState([]);
//   const [showChat, setShowChat] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   const token = localStorage.getItem("token");

//   /* ---------------- LOAD NOTIFICATIONS ---------------- */
//   useEffect(() => {
//     if (!user || !token) return;

//     socket.emit("join", user._id);

//     const fetchNotifications = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/notifications", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setNotifications(data);
//         }
//       } catch (err) {
//         console.error("Failed to load notifications:", err);
//       }
//     };

//     fetchNotifications();

//     // ✅ Listen on "new_notification" (matches what backend emits)
//     socket.on("new_notification", (data) => {
//       setNotifications((prev) => [data, ...prev]);
//     });

//     return () => {
//       socket.off("new_notification"); // ✅ clean up correct event name
//     };
//   }, [user, token]);

//   /* ---------------- MARK AS READ ---------------- */
//   const markAsRead = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, read: true } : n))
//       );
//     } catch (err) {
//       console.error("Failed to mark as read", err);
//     }
//   };

//   /* ---------------- OPEN BELL ---------------- */
//   const handleBellClick = () => {
//     setShowNotifications(!showNotifications);
//     if (!showNotifications) {
//       clearUnread(); // ✅ reset live badge count when dropdown opens
//     }
//   };

//   return (
//     <>
//       <nav
//         className={`w-full px-10 py-4 flex items-center justify-between shadow-md transition-colors ${
//           darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800"
//         }`}
//       >
//         {/* LOGO */}
//         <Link to="/" className="flex items-center gap-2">
//           <span className="text-3xl font-extrabold text-teal-500">S</span>
//           <span className="text-2xl font-extrabold tracking-wide">
//             SkillSwap
//           </span>
//         </Link>

//         {/* RIGHT SIDE */}
//         <div className="flex items-center gap-6 text-sm font-semibold relative">

//           {/* DARK MODE TOGGLE */}
//           <button
//             onClick={toggleDarkMode}
//             className="w-8 h-8 rounded-full overflow-hidden"
//           >
//             <img
//               src={darkMode ? SunIcon : MoonIcon}
//               alt="Toggle Dark Mode"
//               className="w-full h-full object-contain"
//             />
//           </button>

//           {/* BROWSE SKILLS */}
//           <Link
//             to={user ? "/search" : "/login"}
//             className="hover:text-teal-600 transition"
//           >
//             Browse Skills
//           </Link>

//           {/* SKILL MATCHES */}
//           {user && (
//             <Link to="/matches" className="hover:text-teal-600 transition">
//               Skill Matches
//             </Link>
//           )}

//           {/* LEADERBOARD */}
//           {user && (
//             <Link to="/leaderboard" className="hover:text-teal-600 transition">
//               Leaderboard
//             </Link>
//           )}

//           {user && (
//             <>
//               {/* PROFILE */}
//               <Link to="/profile" className="hover:text-teal-600 transition">
//                 Profile
//               </Link>

//               {/* SETTINGS ICON */}
//               <Link
//                 to="/settings"
//                 className={`text-xl transition ${
//                   darkMode
//                     ? "text-slate-300 hover:text-teal-400"
//                     : "text-slate-600 hover:text-teal-500"
//                 }`}
//               >
//                 <HiOutlineCog6Tooth />
//               </Link>

//               {/* NOTIFICATION BELL */}
//               <div className="relative">
//                 <button
//                   onClick={handleBellClick} // ✅ uses new handler
//                   className={`text-xl transition ${
//                     darkMode
//                       ? "text-slate-300 hover:text-teal-400"
//                       : "text-slate-600 hover:text-teal-500"
//                   }`}
//                 >
//                   <IoNotificationsOutline />

//                   {/* ✅ unreadCount comes from context (live via socket) */}
//                   {unreadCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs px-1 rounded-full">
//                       {unreadCount > 9 ? "9+" : unreadCount}
//                     </span>
//                   )}
//                 </button>

//                 {/* DROPDOWN */}
//                 {showNotifications && (
//                   <div
//                     className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl p-4 z-50 ${
//                       darkMode
//                         ? "bg-slate-800 text-white"
//                         : "bg-white text-slate-800"
//                     }`}
//                   >
//                     <p className="font-semibold mb-3">Notifications</p>

//                     {notifications.length === 0 ? (
//                       <p className="text-sm text-slate-400">
//                         No notifications yet
//                       </p>
//                     ) : (
//                       notifications.slice(0, 5).map((n) => (
//                         <div
//                           key={n._id}
//                           onClick={() => markAsRead(n._id)}
//                           className={`p-3 rounded-xl mb-2 cursor-pointer transition ${
//                             darkMode
//                               ? "hover:bg-slate-700"
//                               : "hover:bg-slate-100"
//                           } ${!n.read ? "bg-teal-500/10" : ""}`}
//                         >
//                           <p className="text-sm">{n.message}</p>
//                         </div>
//                       ))
//                     )}

//                     <Link
//                       to="/notifications"
//                       onClick={() => setShowNotifications(false)}
//                       className="block text-center text-teal-500 mt-3 text-sm hover:underline"
//                     >
//                       View All Notifications
//                     </Link>
//                   </div>
//                 )}
//               </div>

//               {/* SKILL BUDDY BUTTON */}
//               <button
//                 onClick={() => setShowChat(!showChat)}
//                 className="bg-teal-500 text-white px-3 py-2 rounded-full hover:bg-teal-600 transition"
//               >
//                 Skill Buddy
//               </button>

//               {/* LOGOUT */}
//               <button
//                 onClick={() => {
//                   logout();
//                   navigate("/");
//                 }}
//                 className={`px-5 py-2 rounded-xl border font-semibold transition ${
//                   darkMode
//                     ? "border-teal-400 text-teal-300 hover:bg-teal-500/10"
//                     : "border-teal-500 text-teal-600 hover:bg-teal-50"
//                 }`}
//               >
//                 Logout
//               </button>
//             </>
//           )}

//           {!user && (
//             <Link
//               to="/login"
//               className={`px-4 py-2 border rounded-lg transition ${
//                 darkMode
//                   ? "border-white text-white hover:bg-white/20"
//                   : "border-gray-300 text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               Login
//             </Link>
//           )}
//         </div>
//       </nav>

//       {/* AI CHAT WINDOW */}
//       {showChat && (
//         <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] rounded-2xl shadow-2xl overflow-hidden">
//           <AIChat />
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;




// import { IoNotificationsOutline } from "react-icons/io5";
// import { HiOutlineCog6Tooth } from "react-icons/hi2";
// import { Link, useNavigate } from "react-router-dom";
// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { DarkModeContext } from "../context/DarkModeContext";
// import MoonIcon from "../assets/imageofmoon.png";
// import SunIcon from "../assets/imageofsun.png";
// // import socket from "../socket";
// import logolight from "../assets/logolight.png";
// import logodark from "../assets/logodark.png";
// import { useNotifications } from "../context/NotificationContext";
// import { FiSettings, FiBell } from "react-icons/fi";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // ✅

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
//   const { unreadCount, clearUnread } = useNotifications();
//   const navigate = useNavigate();

//   const [notifications, setNotifications] = useState([]);
//   const [showChat, setShowChat] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   const token = localStorage.getItem("token");

//   /* ---------------- LOAD NOTIFICATIONS ---------------- */
//   useEffect(() => {
//     if (!user || !token) return;

//     socket.emit("join", user._id);

//     const fetchNotifications = async () => {
//       try {
//         const res = await fetch(`${API_URL}/api/notifications`, {  // ✅
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setNotifications(data);
//         }
//       } catch (err) {
//         console.error("Failed to load notifications:", err);
//       }
//     };

//     fetchNotifications();

//     socket.on("new_notification", (data) => {
//       setNotifications((prev) => [data, ...prev]);
//     });

//     return () => {
//       socket.off("new_notification");
//     };
//   }, [user, token]);

//   /* ---------------- MARK AS READ ---------------- */
//   const markAsRead = async (id) => {
//     try {
//       await fetch(`${API_URL}/api/notifications/${id}/read`, {     // ✅
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, read: true } : n))
//       );
//     } catch (err) {
//       console.error("Failed to mark as read", err);
//     }
//   };

//   /* ---------------- OPEN BELL ---------------- */
//   const handleBellClick = () => {
//     setShowNotifications(!showNotifications);
//     if (!showNotifications) {
//       clearUnread();
//     }
//   };

//   return (
//     <>
//       <nav
//         className={`w-full px-10 py-4 flex items-center justify-between shadow-md transition-colors ${
//           darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800"
//         }`}
//       >
//         {/* LOGO */}
//         <Link to="/" className="flex items-center gap-2">
//           <span className="text-3xl font-extrabold text-teal-500">S</span>
//           <span className="text-2xl font-extrabold tracking-wide">
//             SkillSwap
//           </span>
//         </Link>

//         {/* RIGHT SIDE */}
//         <div className="flex items-center gap-6 text-sm font-semibold relative">

//           {/* DARK MODE TOGGLE */}
//           <button onClick={toggleDarkMode} className="w-8 h-8 rounded-full overflow-hidden">
//             <img
//               src={darkMode ? SunIcon : MoonIcon}
//               alt="Toggle Dark Mode"
//               className="w-full h-full object-contain"
//             />
//           </button>

//           {/* BROWSE SKILLS */}
//           <Link to={user ? "/search" : "/login"} className="hover:text-teal-600 transition">
//             Browse Skills
//           </Link>

//           {/* SKILL MATCHES */}
//           {user && (
//             <Link to="/matches" className="hover:text-teal-600 transition">
//               Skill Matches
//             </Link>
//           )}

//           {/* LEADERBOARD */}
//           {user && (
//             <Link to="/leaderboard" className="hover:text-teal-600 transition">
//               Leaderboard
//             </Link>
//           )}

//           {user && (
//             <>
//               {/* PROFILE */}
//               <Link to="/profile" className="hover:text-teal-600 transition">
//                 Profile
//               </Link>

//               {/* SETTINGS ICON */}
//               <Link
//                 to="/settings"
//                 className={`text-xl transition ${
//                   darkMode ? "text-slate-300 hover:text-teal-400" : "text-slate-600 hover:text-teal-500"
//                 }`}
//               >
//                 <HiOutlineCog6Tooth />
//               </Link>

//               {/* NOTIFICATION BELL */}
//               <div className="relative">
//                 <button
//                   onClick={handleBellClick}
//                   className={`text-xl transition ${
//                     darkMode ? "text-slate-300 hover:text-teal-400" : "text-slate-600 hover:text-teal-500"
//                   }`}
//                 >
//                   <IoNotificationsOutline />

//                   {unreadCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs px-1 rounded-full">
//                       {unreadCount > 9 ? "9+" : unreadCount}
//                     </span>
//                   )}
//                 </button>

//                 {/* DROPDOWN */}
//                 {showNotifications && (
//                   <div
//                     className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl p-4 z-50 ${
//                       darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"
//                     }`}
//                   >
//                     <p className="font-semibold mb-3">Notifications</p>

//                     {notifications.length === 0 ? (
//                       <p className="text-sm text-slate-400">No notifications yet</p>
//                     ) : (
//                       notifications.slice(0, 5).map((n) => (
//                         <div
//                           key={n._id}
//                           onClick={() => markAsRead(n._id)}
//                           className={`p-3 rounded-xl mb-2 cursor-pointer transition ${
//                             darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
//                           } ${!n.read ? "bg-teal-500/10" : ""}`}
//                         >
//                           <p className="text-sm">{n.message}</p>
//                         </div>
//                       ))
//                     )}

//                     <Link
//                       to="/notifications"
//                       onClick={() => setShowNotifications(false)}
//                       className="block text-center text-teal-500 mt-3 text-sm hover:underline"
//                     >
//                       View All Notifications
//                     </Link>
//                   </div>
//                 )}
//               </div>

          

//               {/* LOGOUT */}
//               <button
//                 onClick={() => { logout(); navigate("/"); }}
//                 className={`px-5 py-2 rounded-xl border font-semibold transition ${
//                   darkMode
//                     ? "border-teal-400 text-teal-300 hover:bg-teal-500/10"
//                     : "border-teal-500 text-teal-600 hover:bg-teal-50"
//                 }`}
//               >
//                 Logout
//               </button>
//             </>
//           )}

//           {!user && (
//             <Link
//               to="/login"
//               className={`px-4 py-2 border rounded-lg transition ${
//                 darkMode
//                   ? "border-white text-white hover:bg-white/20"
//                   : "border-gray-300 text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               Login
//             </Link>
//           )}
//         </div>
//       </nav>

//       {/* AI CHAT WINDOW */}
//       {showChat && (
//         <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] rounded-2xl shadow-2xl overflow-hidden">
//           <AIChat />
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;




import { IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import MoonIcon from "../assets/imageofmoon.png";
import SunIcon from "../assets/imageofsun.png";
import socket from "../socket";
import logolight from "../assets/logolight.png";
import logodark from "../assets/logodark.png";
import { useNotifications } from "../context/NotificationContext";
import { FiSettings, FiBell } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "https://skill-swap-zkfd.onrender.com"; // ✅

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { unreadCount, clearUnread } = useNotifications();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const token = localStorage.getItem("token");

  /* ---------------- LOAD NOTIFICATIONS ---------------- */
  useEffect(() => {
    if (!user || !token) return;

    socket.emit("join", user._id);

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notifications`, {  // ✅
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };

    fetchNotifications();

    socket.on("new_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("new_notification");
    };
  }, [user, token]);

  /* ---------------- MARK AS READ ---------------- */
  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/api/notifications/${id}/read`, {     // ✅
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  /* ---------------- OPEN BELL ---------------- */
  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      clearUnread();
    }
  };

  return (
    <>
      <nav
        className={`w-full px-10 py-4 flex items-center justify-between shadow-md transition-colors ${
          darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* LOGO */}
<Link to="/" className="flex items-center gap-3">
  <img
    src={darkMode ? logodark : logolight}
    alt="SkillSwap Logo"
    className="w-10 h-10 object-contain"
  />

<span className="text-2xl font-extrabold tracking-wide">
  <span className="text-teal-500">Skill</span>
  <span className={darkMode ? "text-white" : "text-black"}>
    Swap
  </span>
</span>
</Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6 text-sm font-semibold relative">

          {/* DARK MODE TOGGLE */}
          <button onClick={toggleDarkMode} className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={darkMode ? SunIcon : MoonIcon}
              alt="Toggle Dark Mode"
              className="w-full h-full object-contain"
            />
          </button>

          {/* BROWSE SKILLS */}
          <Link to={user ? "/search" : "/login"} className="hover:text-teal-600 transition">
            Browse Skills
          </Link>

          {/* SKILL MATCHES */}
          {user && (
            <Link to="/matches" className="hover:text-teal-600 transition">
              Skill Matches
            </Link>
          )}

          {/* LEADERBOARD */}
          {user && (
            <Link to="/leaderboard" className="hover:text-teal-600 transition">
              Leaderboard
            </Link>
          )}

          {user && (
            <>
              {/* PROFILE */}
              <Link to="/profile" className="hover:text-teal-600 transition">
                Profile
              </Link>

              {/* SETTINGS ICON */}
              <Link
                to="/settings"
                className={`text-xl transition ${
                  darkMode ? "text-slate-300 hover:text-teal-400" : "text-slate-600 hover:text-teal-500"
                }`}
              >
                <HiOutlineCog6Tooth />
              </Link>

              {/* NOTIFICATION BELL */}
              <div className="relative">
                <button
                  onClick={handleBellClick}
                  className={`text-xl transition ${
                    darkMode ? "text-slate-300 hover:text-teal-400" : "text-slate-600 hover:text-teal-500"
                  }`}
                >
                  <IoNotificationsOutline />

                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs px-1 rounded-full">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* DROPDOWN */}
                {showNotifications && (
                  <div
                    className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl p-4 z-50 ${
                      darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"
                    }`}
                  >
                    <p className="font-semibold mb-3">Notifications</p>

                    {notifications.length === 0 ? (
                      <p className="text-sm text-slate-400">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n._id}
                          onClick={() => markAsRead(n._id)}
                          className={`p-3 rounded-xl mb-2 cursor-pointer transition ${
                            darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                          } ${!n.read ? "bg-teal-500/10" : ""}`}
                        >
                          <p className="text-sm">{n.message}</p>
                        </div>
                      ))
                    )}

                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="block text-center text-teal-500 mt-3 text-sm hover:underline"
                    >
                      View All Notifications
                    </Link>
                  </div>
                )}
              </div>

          

              {/* LOGOUT */}
              <button
                onClick={() => { logout(); navigate("/"); }}
                className={`px-5 py-2 rounded-xl border font-semibold transition ${
                  darkMode
                    ? "border-teal-400 text-teal-300 hover:bg-teal-500/10"
                    : "border-teal-500 text-teal-600 hover:bg-teal-50"
                }`}
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <Link
              to="/login"
              className={`px-4 py-2 border rounded-lg transition ${
                darkMode
                  ? "border-white text-white hover:bg-white/20"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* AI CHAT WINDOW */}
      {showChat && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] rounded-2xl shadow-2xl overflow-hidden">
          <AIChat />
        </div>
      )}
    </>
  );
};

export default Navbar;